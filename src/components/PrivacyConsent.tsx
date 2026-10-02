import { useEffect, useRef, useSyncExternalStore } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { privacyConsent } from "@/lib/privacy-consent";

export default function PrivacyConsent() {
  const state = useSyncExternalStore(privacyConsent.subscribe, privacyConsent.getSnapshot);
  const settingsButton = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLElement>(null);
  const openedFromSettings = useRef(false);
  const usNotice = state.panel === "notice" && state.policy === "opt-out" && state.analyticsEnabled;

  useEffect(() => {
    void privacyConsent.initialize();
  }, []);

  useEffect(() => {
    if (state.panel === "settings" && openedFromSettings.current) heading.current?.focus();
  }, [state.panel]);

  function finish(action: () => void) {
    const hadFocus = panel.current?.contains(document.activeElement);
    action();
    if (privacyConsent.getSnapshot().panel === null && hadFocus) settingsButton.current?.focus();
    openedFromSettings.current = false;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-start gap-2">
      {state.panel && (
        <section
          id="analytics-consent"
          ref={panel}
          aria-labelledby="analytics-consent-title"
          className="max-h-[calc(100dvh-6rem)] w-80 max-w-full overflow-y-auto rounded-xl border border-border bg-card p-4 shadow-lg"
          onKeyDown={(event) => {
            if (event.key === "Escape" && state.panel === "settings") {
              event.preventDefault();
              finish(privacyConsent.closeSettings);
            }
          }}
        >
          <h2
            id="analytics-consent-title"
            ref={heading}
            tabIndex={-1}
            className="mb-1 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {state.panel === "settings" ? "Cookie settings" : usNotice ? "Analytics on this site" : "Your analytics choice"}
          </h2>
          <p className="text-xs leading-relaxed text-foreground">
            {usNotice
              ? "This site uses Google Analytics cookies to understand visits. It's on by default in the US, and you can turn it off anytime."
              : state.panel === "settings"
                ? `Google Analytics cookies help understand visits. Analytics is currently ${state.analyticsEnabled ? "on" : "off"}.`
                : "May this site use Google Analytics cookies to understand visits? Analytics stays off unless you allow it."}
            {" "}No ads or personalization.
          </p>
          {state.policy === null && (
            <p role="status" className="mt-2 text-xs text-foreground">
              Checking your region. No analytics starts without a regional policy or your permission.
            </p>
          )}
          {state.regionWarning && (
            <p className="mt-2 text-xs text-foreground">{state.regionWarning}</p>
          )}
          {state.storageWarning && (
            <p role="alert" className="mt-2 text-xs font-medium text-foreground">{state.storageWarning}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="min-h-9 flex-1" onClick={() => finish(usNotice ? privacyConsent.acknowledge : privacyConsent.allow)}>
              {usNotice ? "Got it" : "Allow analytics"}
            </Button>
            <Button variant="outline" size="sm" className="min-h-9 flex-1" onClick={() => finish(privacyConsent.reject)}>
              Reject analytics
            </Button>
            {state.panel === "settings" && (
              <Button variant="ghost" size="sm" className="min-h-9 w-full" onClick={() => finish(privacyConsent.closeSettings)}>
                Close settings
              </Button>
            )}
          </div>
        </section>
      )}
      {!state.panel && state.storageWarning && (
        <p role="status" className="max-w-xs rounded-md border border-border bg-card p-3 text-xs text-foreground">
          {state.storageWarning}
        </p>
      )}
      <Button
        ref={settingsButton}
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-full bg-card shadow-md"
        aria-label="Cookie settings"
        title="Cookie settings"
        aria-expanded={state.panel !== null}
        aria-controls={state.panel ? "analytics-consent" : undefined}
        onClick={() => {
          openedFromSettings.current = true;
          privacyConsent.openSettings();
        }}
      >
        <Cookie aria-hidden="true" className="h-5 w-5" />
      </Button>
    </div>
  );
}
