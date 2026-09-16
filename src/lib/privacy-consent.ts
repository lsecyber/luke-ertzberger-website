export const MEASUREMENT_ID = "G-LYJM23WLL3";
export const PREFERENCE_KEY = "analytics-preference-v1";
export const REGION_TIMEOUT_MS = 3000;
const DISABLE_KEY = `ga-disable-${MEASUREMENT_ID}` as const;

type Policy = "opt-in" | "opt-out";
type Preference = "accepted" | "rejected" | "us-notice";
type Panel = "notice" | "settings" | null;

type ConsentState = {
  policy: Policy | null;
  preference: Preference | null;
  analyticsEnabled: boolean;
  panel: Panel;
  storageWarning: string | null;
  regionWarning: string | null;
};

declare global {
  interface Window {
    dataLayer?: IArguments[];
    gtag?: (...args: unknown[]) => void;
    "ga-disable-G-LYJM23WLL3"?: boolean;
  }
}

const advertisingDenied = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

function isPreference(value: string | null): value is Preference {
  return value === "accepted" || value === "rejected" || value === "us-notice";
}

function removeAnalyticsCookies() {
  const domains = window.location.hostname.split(".").map((_, index, parts) => parts.slice(index).join("."));
  const paths = new Set(["/"]);
  window.location.pathname.split("/").forEach((_, index, parts) => {
    const path = parts.slice(0, index + 1).join("/") || "/";
    paths.add(path);
    paths.add(path.endsWith("/") ? path : `${path}/`);
  });
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
    for (const path of paths) {
      const expired = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=${path}`;
      document.cookie = expired;
      for (const domain of domains) {
        document.cookie = `${expired}; Domain=${domain}`;
        document.cookie = `${expired}; Domain=.${domain}`;
      }
    }
  }
}

export class PrivacyConsentController {
  private state: ConsentState = {
    policy: null,
    preference: null,
    analyticsEnabled: false,
    panel: null,
    storageWarning: null,
    regionWarning: null,
  };
  private listeners = new Set<() => void>();
  private initialization: Promise<void> | null = null;
  private tagStarted = false;
  private tagLoaded = false;
  private tagConfigured = false;
  private storageReadFailed = false;

  getSnapshot = () => this.state;

  subscribe = (listener: () => void) => {
    if (this.listeners.size === 0) window.addEventListener("storage", this.handleStorageChange);
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) window.removeEventListener("storage", this.handleStorageChange);
    };
  };

  private handleStorageChange = (event: StorageEvent) => {
    if (event.key !== PREFERENCE_KEY && event.key !== null) return;
    let saved: string | null;
    try {
      const storage = window.localStorage;
      if (event.storageArea !== storage) return;
      saved = storage.getItem(PREFERENCE_KEY);
    } catch {
      this.storageReadFailed = true;
      this.setAnalytics(false);
      this.publish({
        preference: null,
        storageWarning: "Saved cookie preferences could not be read. Analytics stays off until you choose. Enable site storage to remember your choice.",
        panel: "settings",
      });
      return;
    }
    this.storageReadFailed = false;
    this.publish({
      preference: isPreference(saved) ? saved : null,
      storageWarning: null,
    });
    this.applyPolicy(this.state.policy);
  };

  private publish(update: Partial<ConsentState>) {
    this.state = { ...this.state, ...update };
    this.listeners.forEach((listener) => listener());
  }

  initialize = (): Promise<void> => {
    if (!this.initialization) {
      window[DISABLE_KEY] = true;
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem(PREFERENCE_KEY);
      } catch {
        this.storageReadFailed = true;
        this.publish({
          storageWarning: "Saved cookie preferences could not be read. Analytics stays off until you choose. Enable site storage to remember your choice.",
          panel: "settings",
        });
      }
      if (isPreference(saved)) this.publish({ preference: saved });
      if (saved === "accepted") this.setAnalytics(true);
      if (saved === "rejected") removeAnalyticsCookies();
      this.initialization = this.resolvePolicy();
    }
    return this.initialization;
  };

  private async resolvePolicy() {
    const abort = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let policy: Policy = "opt-in";
    try {
      // Race the entire read, not just the headers, so a stalled body also fails closed.
      const result: unknown = await Promise.race([
        (async () => {
          const response = await fetch("/api/privacy-region", {
            signal: abort.signal,
            cache: "no-store",
            credentials: "same-origin",
            redirect: "error",
          });
          if (!response.ok) throw new Error(`Region lookup returned ${response.status}`);
          return response.json();
        })(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            abort.abort();
            reject(new Error("Region lookup timed out"));
          }, REGION_TIMEOUT_MS);
        }),
      ]);
      if (
        typeof result !== "object" || result === null ||
        !("policy" in result) || (result.policy !== "opt-in" && result.policy !== "opt-out")
      ) {
        throw new Error("Invalid region policy");
      }
      policy = result.policy;
    } catch (error) {
      console.warn("Privacy region lookup failed; using opt-in.", error);
      this.publish({ regionWarning: "We couldn't confirm your region, so we ask before enabling analytics." });
    } finally {
      clearTimeout(timer!);
    }

    this.applyPolicy(policy);
  }

  private applyPolicy(policy: Policy | null) {
    // Re-read in-memory choice: a decision made during the lookup always wins.
    const { preference } = this.state;
    const enabled = preference === "accepted" ||
      (policy === "opt-out" && preference !== "rejected" && !this.storageReadFailed);
    this.setAnalytics(enabled);
    const needsNotice = policy !== null && preference !== "accepted" && preference !== "rejected" &&
      !(policy === "opt-out" && preference === "us-notice" && !this.storageReadFailed);
    this.publish({
      policy,
      panel: this.state.panel === "settings" ? "settings" : needsNotice ? "notice" : null,
    });
  }

  private setAnalytics(enabled: boolean) {
    // Consent Mode's denied state alone can still send cookieless pings.
    // Google's disable flag must be set BEFORE any consent update on rejection.
    // This blocks new GA events, not hits already buffered with an earlier client ID
    // and granted consent. The real tag can still send those later or on pagehide;
    // there is no documented cancellation API, and reload is not a reliable fix.
    window[DISABLE_KEY] = !enabled;
    if (enabled === this.state.analyticsEnabled) {
      if (!enabled) removeAnalyticsCookies();
      return;
    }
    if (enabled) {
      if (!this.tagStarted) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function (..._args: unknown[]) {
          // eslint-disable-next-line prefer-rest-params -- Google's gtag queue expects Arguments objects, not arrays.
          window.dataLayer!.push(arguments);
        };
        window.gtag("consent", "default", { ...advertisingDenied, analytics_storage: "denied" });
        window.gtag("set", "ads_data_redaction", true);
      }
      window.gtag!("consent", "update", { ...advertisingDenied, analytics_storage: "granted" });
      if (!this.tagStarted) window.gtag!("js", new Date());
      if (!this.tagStarted) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
        script.addEventListener("load", () => {
          this.tagLoaded = true;
          if (this.state.analyticsEnabled) this.sendPageView();
        }, { once: true });
        document.head.appendChild(script);
        this.tagStarted = true;
      }
      this.sendPageView();
    } else {
      if (this.tagStarted) {
        window.gtag!("consent", "update", { ...advertisingDenied, analytics_storage: "denied" });
      }
      removeAnalyticsCookies();
    }
    this.publish({ analyticsEnabled: enabled });
  }

  private sendPageView() {
    // Wait for execution so pre-load consent toggles cannot queue duplicate views.
    if (!this.tagLoaded) return;
    if (!this.tagConfigured) {
      window.gtag!("config", MEASUREMENT_ID, {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_path: "/",
      });
      this.tagConfigured = true;
    } else {
      // Repeating config does not generate another pageview after re-enabling.
      window.gtag!("event", "page_view", { send_to: MEASUREMENT_ID });
    }
  }

  private save(preference: Preference) {
    let storageWarning: string | null = null;
    try {
      window.localStorage.setItem(PREFERENCE_KEY, preference);
    } catch {
      storageWarning = "Your choice applies to this page, but could not be saved. A previous preference or regional default may apply on your next visit. Enable site storage, then choose again to retry.";
    }
    this.publish({ preference, storageWarning, panel: storageWarning ? "settings" : null });
  }

  allow = () => {
    this.setAnalytics(true);
    this.save("accepted");
  };

  reject = () => {
    this.setAnalytics(false);
    this.save("rejected");
  };

  acknowledge = () => {
    if (this.state.policy === "opt-out" && this.state.analyticsEnabled && this.state.preference !== "accepted") {
      this.save("us-notice");
    }
  };

  openSettings = () => this.publish({ panel: "settings" });
  closeSettings = () => this.publish({ panel: null });
}

export const privacyConsent = new PrivacyConsentController();
