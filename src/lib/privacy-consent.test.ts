import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MEASUREMENT_ID, PREFERENCE_KEY, PrivacyConsentController, REGION_TIMEOUT_MS } from "./privacy-consent";

const disableKey = "ga-disable-G-LYJM23WLL3";
const scripts = () => document.querySelectorAll('script[src*="googletagmanager.com"]');
const loadTag = () => scripts()[0].dispatchEvent(new Event("load"));
const commands = () => (window.dataLayer ?? []).map((args) => Array.from(args));
const pageViewCommands = () => commands().filter(([command, name]) =>
  command === "config" || (command === "event" && name === "page_view"));
const response = (policy: string) => new Response(JSON.stringify({ policy }));

describe("regional analytics controller", () => {
  let controller: PrivacyConsentController;

  beforeEach(() => {
    localStorage.clear();
    scripts().forEach((script) => script.remove());
    delete window.dataLayer;
    delete window.gtag;
    delete window[disableKey];
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = `${cookie.split("=")[0].trim()}=; Max-Age=0; Path=/`;
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response("opt-in")));
    vi.spyOn(console, "warn").mockImplementation(() => {});
    controller = new PrivacyConsentController();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("does not start GA while the region is unresolved, and initializes only once", async () => {
    let resolve!: (response: Response) => void;
    vi.mocked(fetch).mockReturnValue(new Promise((done) => { resolve = done; }));
    const initialization = controller.initialize();
    expect(controller.initialize()).toBe(initialization);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/privacy-region", expect.objectContaining({
      cache: "no-store", credentials: "same-origin", redirect: "error", signal: expect.any(AbortSignal),
    }));
    expect(window[disableKey]).toBe(true);
    expect(scripts()).toHaveLength(0);
    expect(commands()).toEqual([]);
    expect(controller.getSnapshot().analyticsEnabled).toBe(false);
    resolve(response("opt-out"));
    await initialization;
    expect(scripts()).toHaveLength(1);
    expect(controller.getSnapshot()).toMatchObject({ analyticsEnabled: true, panel: "notice" });
    expect(window[disableKey]).toBe(false);
  });

  it("keeps opt-in regions completely tag-free until explicit acceptance", async () => {
    await controller.initialize();
    expect(scripts()).toHaveLength(0);
    expect(commands()).toEqual([]);
    expect(controller.getSnapshot()).toMatchObject({ analyticsEnabled: false, panel: "notice" });
    controller.allow();
    expect(scripts()).toHaveLength(1);
    expect(scripts()[0].getAttribute("src")).toBe(`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
    expect(localStorage.getItem(PREFERENCE_KEY)).toBe("accepted");
    expect(controller.getSnapshot().panel).toBeNull();
    expect(pageViewCommands()).toEqual([]);
    loadTag();
    expect(commands()).toEqual([
      ["consent", "default", {
        analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
      }],
      ["set", "ads_data_redaction", true],
      ["consent", "update", {
        analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
      }],
      ["js", expect.any(Date)],
      ["config", MEASUREMENT_ID, {
        allow_google_signals: false, allow_ad_personalization_signals: false, cookie_path: "/",
      }],
    ]);
  });

  it("reads saved rejection before even attempting the lookup and never loads a tag on reload", async () => {
    localStorage.setItem(PREFERENCE_KEY, "rejected");
    document.cookie = "_ga=old; Path=/";
    vi.mocked(fetch).mockImplementation(async () => {
      expect(window[disableKey]).toBe(true);
      expect(controller.getSnapshot().preference).toBe("rejected");
      expect(document.cookie).not.toContain("_ga=");
      return response("opt-out");
    });
    await controller.initialize();
    expect(scripts()).toHaveLength(0);
    expect(commands()).toEqual([]);
    expect(controller.getSnapshot()).toMatchObject({ analyticsEnabled: false, panel: null });
    const reloaded = new PrivacyConsentController();
    await reloaded.initialize();
    expect(scripts()).toHaveLength(0);
    expect(reloaded.getSnapshot().preference).toBe("rejected");
  });

  it("honors saved explicit acceptance before resolving location", async () => {
    localStorage.setItem(PREFERENCE_KEY, "accepted");
    const pending = controller.initialize();
    expect(scripts()).toHaveLength(1);
    expect(controller.getSnapshot().analyticsEnabled).toBe(true);
    await pending;
    expect(controller.getSnapshot().panel).toBeNull();
  });

  it("stores US acknowledgement separately, retaining default analytics without granting explicit consent", async () => {
    vi.mocked(fetch).mockResolvedValue(response("opt-out"));
    await controller.initialize();
    loadTag();
    controller.acknowledge();
    expect(localStorage.getItem(PREFERENCE_KEY)).toBe("us-notice");
    expect(controller.getSnapshot()).toMatchObject({ analyticsEnabled: true, panel: null });
    expect(commands().filter(([command]) => command === "config")).toHaveLength(1);
  });

  it.each([
    ["opt-out", true, null],
    ["opt-in", false, "notice"],
  ])("does not mistake a US acknowledgement for explicit permission in %s", async (policy, enabled, panel) => {
    localStorage.setItem(PREFERENCE_KEY, "us-notice");
    vi.mocked(fetch).mockResolvedValue(response(policy));
    const pending = controller.initialize();
    expect(scripts()).toHaveLength(0);
    await pending;
    expect(controller.getSnapshot()).toMatchObject({ analyticsEnabled: enabled, panel });
    expect(scripts()).toHaveLength(enabled ? 1 : 0);
  });

  it("does not allow acknowledgement to grant consent in opt-in regions", async () => {
    await controller.initialize();
    controller.acknowledge();
    expect(localStorage.getItem(PREFERENCE_KEY)).toBeNull();
    expect(scripts()).toHaveLength(0);
  });

  it("disables collection before consent updates, deletes only GA cookies, and can re-enable without another tag", async () => {
    await controller.initialize();
    controller.allow();
    loadTag();
    document.cookie = "_ga=client; Path=/";
    document.cookie = "_ga_LYJM23WLL3=session; Path=/";
    document.cookie = "essential=keep; Path=/";
    const gtag = window.gtag!;
    window.gtag = vi.fn((...args: unknown[]) => {
      expect(window[disableKey]).toBe(true);
      gtag(...args);
    });
    controller.reject();
    expect(window.gtag).toHaveBeenCalledWith("consent", "update", {
      analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    });
    expect(document.cookie).not.toContain("_ga");
    expect(document.cookie).toContain("essential=keep");
    expect(localStorage.getItem(PREFERENCE_KEY)).toBe("rejected");
    window.gtag = gtag;
    controller.openSettings();
    controller.allow();
    expect(window[disableKey]).toBe(false);
    expect(controller.getSnapshot()).toMatchObject({ analyticsEnabled: true, panel: null });
    expect(scripts()).toHaveLength(1);
    expect(commands().filter(([command]) => command === "js")).toHaveLength(1);
    expect(pageViewCommands()).toEqual([
      ["config", MEASUREMENT_ID, expect.any(Object)],
      ["event", "page_view", { send_to: MEASUREMENT_ID }],
    ]);
    expect(commands().slice(-2)).toEqual([
      ["consent", "update", expect.objectContaining({ analytics_storage: "granted" })],
      ["event", "page_view", { send_to: MEASUREMENT_ID }],
    ]);
  });

  it("does not duplicate the initial pageview or repeated acceptance", async () => {
    await controller.initialize();
    controller.allow();
    loadTag();
    controller.allow();
    loadTag();
    expect(pageViewCommands()).toEqual([["config", MEASUREMENT_ID, expect.any(Object)]]);
  });

  it("waits for acceptance if rejection precedes script execution", async () => {
    vi.mocked(fetch).mockResolvedValue(response("opt-out"));
    await controller.initialize();
    controller.reject();
    loadTag();
    expect(window[disableKey]).toBe(true);
    expect(pageViewCommands()).toEqual([]);
    controller.allow();
    expect(pageViewCommands()).toEqual([["config", MEASUREMENT_ID, expect.any(Object)]]);
    controller.reject();
    controller.allow();
    expect(pageViewCommands()).toHaveLength(2);
    expect(pageViewCommands()[1]).toEqual(["event", "page_view", { send_to: MEASUREMENT_ID }]);
    expect(scripts()).toHaveLength(1);
  });

  it("coalesces pre-execution consent toggles into one initial pageview", async () => {
    vi.mocked(fetch).mockResolvedValue(response("opt-out"));
    await controller.initialize();
    controller.reject();
    controller.allow();
    controller.reject();
    controller.allow();
    expect(pageViewCommands()).toEqual([]);
    loadTag();
    expect(pageViewCommands()).toEqual([["config", MEASUREMENT_ID, expect.any(Object)]]);
    expect(commands().filter(([command]) => command === "js")).toHaveLength(1);
  });

  it("queues only denied consent on rejection, without generating new pageviews", async () => {
    vi.mocked(fetch).mockResolvedValue(response("opt-out"));
    await controller.initialize();
    loadTag();
    const count = commands().length;
    controller.reject();
    controller.reject();
    controller.acknowledge();
    controller.openSettings();
    controller.closeSettings();
    expect(commands().slice(count)).toEqual([
      ["consent", "update", expect.objectContaining({ analytics_storage: "denied" })],
    ]);
    expect(window[disableKey]).toBe(true);
  });

  it("sends exactly one pageview when another tab re-enables an initialized tag", async () => {
    const unsubscribe = controller.subscribe(() => {});
    await controller.initialize();
    controller.allow();
    loadTag();
    controller.reject();
    localStorage.setItem(PREFERENCE_KEY, "accepted");
    for (let i = 0; i < 2; i++) {
      window.dispatchEvent(new StorageEvent("storage", {
        key: PREFERENCE_KEY, newValue: "accepted", storageArea: localStorage,
      }));
    }
    expect(pageViewCommands()).toEqual([
      ["config", MEASUREMENT_ID, expect.any(Object)],
      ["event", "page_view", { send_to: MEASUREMENT_ID }],
    ]);
    unsubscribe();
  });

  it("expires host-only and parent-domain GA cookies", async () => {
    const location = window.location;
    vi.stubGlobal("location", { ...location, hostname: "www.example.com", pathname: "/work/demo" });
    vi.spyOn(document, "cookie", "get").mockReturnValue("_ga=client; _ga_LYJM23WLL3=session");
    const writes = vi.spyOn(document, "cookie", "set").mockImplementation(() => {});
    await controller.initialize();
    controller.reject();
    const values = writes.mock.calls.map(([value]) => value);
    expect(values).toContainEqual(expect.stringContaining("Path=/; Domain=www.example.com"));
    expect(values).toContainEqual(expect.stringContaining("Path=/; Domain=.example.com"));
    expect(values).toContainEqual(expect.stringMatching(/_ga=;.*Path=\/$/));
    expect(values).toContainEqual(expect.stringContaining("Path=/work/demo"));
  });

  it.each(["allow", "reject"] as const)("preserves an explicit %s made while the lookup is pending", async (choice) => {
    let resolve!: (response: Response) => void;
    vi.mocked(fetch).mockReturnValue(new Promise((done) => { resolve = done; }));
    const pending = controller.initialize();
    controller[choice]();
    resolve(response("opt-out"));
    await pending;
    expect(controller.getSnapshot()).toMatchObject({
      preference: choice === "allow" ? "accepted" : "rejected",
      analyticsEnabled: choice === "allow",
      panel: null,
    });
    expect(scripts()).toHaveLength(choice === "allow" ? 1 : 0);
  });

  it("sets the disable flag even if rejection happens before Google's script executes", async () => {
    vi.mocked(fetch).mockResolvedValue(response("opt-out"));
    await controller.initialize();
    controller.reject();
    expect(window[disableKey]).toBe(true);
    const queued = commands();
    expect(queued[queued.length - 1]).toEqual(["consent", "update", expect.objectContaining({ analytics_storage: "denied" })]);
  });

  it.each(["pending", "enabled"])("honors rejection in another tab while %s", async (stage) => {
    const unsubscribe = controller.subscribe(() => {});
    let resolve!: (response: Response) => void;
    vi.mocked(fetch).mockReturnValue(new Promise((done) => { resolve = done; }));
    const pending = controller.initialize();
    if (stage === "enabled") {
      resolve(response("opt-out"));
      await pending;
    }
    localStorage.setItem(PREFERENCE_KEY, "rejected");
    window.dispatchEvent(new StorageEvent("storage", {
      key: PREFERENCE_KEY, newValue: "rejected", storageArea: localStorage,
    }));
    expect(window[disableKey]).toBe(true);
    if (stage === "pending") {
      resolve(response("opt-out"));
      await pending;
    }
    expect(controller.getSnapshot()).toMatchObject({ preference: "rejected", analyticsEnabled: false, panel: null });
    expect(scripts()).toHaveLength(stage === "pending" ? 0 : 1);
    unsubscribe();
  });

  it("ignores unrelated storage events and synchronizes explicit acceptance", async () => {
    const unsubscribe = controller.subscribe(() => {});
    await controller.initialize();
    window.dispatchEvent(new StorageEvent("storage", {
      key: "unrelated", newValue: "accepted", storageArea: localStorage,
    }));
    window.dispatchEvent(new StorageEvent("storage", {
      key: PREFERENCE_KEY, newValue: "accepted", storageArea: sessionStorage,
    }));
    expect(scripts()).toHaveLength(0);
    localStorage.setItem(PREFERENCE_KEY, "accepted");
    window.dispatchEvent(new StorageEvent("storage", {
      key: PREFERENCE_KEY, newValue: "accepted", storageArea: localStorage,
    }));
    expect(controller.getSnapshot().analyticsEnabled).toBe(true);
    unsubscribe();
  });

  it("reads the latest stored choice rather than replaying an older cross-tab acceptance", async () => {
    const unsubscribe = controller.subscribe(() => {});
    await controller.initialize();
    localStorage.setItem(PREFERENCE_KEY, "rejected");
    window.dispatchEvent(new StorageEvent("storage", {
      key: PREFERENCE_KEY, newValue: "accepted", storageArea: localStorage,
    }));
    expect(controller.getSnapshot().preference).toBe("rejected");
    expect(scripts()).toHaveLength(0);
    unsubscribe();
  });

  it("stops collection and shows a warning if cross-tab preference storage becomes unreadable", async () => {
    const unsubscribe = controller.subscribe(() => {});
    await controller.initialize();
    controller.allow();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("Blocked"); });
    window.dispatchEvent(new StorageEvent("storage", {
      key: PREFERENCE_KEY, newValue: "rejected", storageArea: localStorage,
    }));
    expect(window[disableKey]).toBe(true);
    expect(controller.getSnapshot()).toMatchObject({
      analyticsEnabled: false, panel: "settings", storageWarning: expect.stringContaining("could not be read"),
    });
    unsubscribe();
  });

  it.each([null, {}, { policy: "US" }, { policy: true }, "opt-out"])(
    "fails closed and logs malformed policy %j",
    async (body) => {
      vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(body)));
      await controller.initialize();
      expect(console.warn).toHaveBeenCalled();
      expect(controller.getSnapshot()).toMatchObject({ policy: "opt-in", analyticsEnabled: false });
      expect(scripts()).toHaveLength(0);
    },
  );

  it.each(["network", "http", "html"])("fails closed for %s errors", async (failure) => {
    if (failure === "network") vi.mocked(fetch).mockRejectedValue(new TypeError("Offline"));
    if (failure === "http") vi.mocked(fetch).mockResolvedValue(new Response("Unavailable", { status: 503 }));
    if (failure === "html") vi.mocked(fetch).mockResolvedValue(new Response("<html>Vite fallback</html>"));
    await controller.initialize();
    expect(console.warn).toHaveBeenCalled();
    expect(controller.getSnapshot()).toMatchObject({ policy: "opt-in", analyticsEnabled: false, panel: "notice" });
    expect(scripts()).toHaveLength(0);
  });

  it.each(["headers", "body"])("times out stalled %s and ignores a late US response", async (stage) => {
    vi.useFakeTimers();
    let resolve!: (value: unknown) => void;
    const stalled = new Promise((done) => { resolve = done; });
    vi.mocked(fetch).mockReturnValue(stage === "headers"
      ? stalled as Promise<Response>
      : Promise.resolve({ ok: true, json: () => stalled } as Response));
    const pending = controller.initialize();
    await vi.advanceTimersByTimeAsync(REGION_TIMEOUT_MS);
    await pending;
    expect(vi.mocked(fetch).mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(controller.getSnapshot().policy).toBe("opt-in");
    resolve(stage === "headers" ? response("opt-out") : { policy: "opt-out" });
    await Promise.resolve();
    expect(scripts()).toHaveLength(0);
    expect(console.warn).toHaveBeenCalled();
  });

  it("does not automatically enable US analytics when saved preferences cannot be read", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("Blocked"); });
    vi.mocked(fetch).mockResolvedValue(response("opt-out"));
    await controller.initialize();
    expect(controller.getSnapshot()).toMatchObject({
      analyticsEnabled: false, panel: "settings", storageWarning: expect.stringContaining("could not be read"),
    });
    expect(scripts()).toHaveLength(0);
    controller.allow();
    expect(controller.getSnapshot().analyticsEnabled).toBe(true);
  });

  it.each(["allow", "reject", "acknowledge"] as const)("shows failed persistence for %s, without undoing the current-page decision", async (action) => {
    vi.mocked(fetch).mockResolvedValue(response("opt-out"));
    await controller.initialize();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("Quota"); });
    controller[action]();
    expect(controller.getSnapshot()).toMatchObject({
      analyticsEnabled: action !== "reject",
      storageWarning: expect.stringContaining("could not be saved"),
      panel: "settings",
    });
    vi.restoreAllMocks();
    controller.reject();
    expect(controller.getSnapshot().storageWarning).toBeNull();
    expect(localStorage.getItem(PREFERENCE_KEY)).toBe("rejected");
  });
});
