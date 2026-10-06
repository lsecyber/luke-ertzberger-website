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
    <div className="fixed bottom-3 right-3 z-50 flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-2">
      {state.panel && (
        <section
          id="analytics-consent"
          ref={panel}
          aria-labelledby="analytics-consent-title"
          className="max-h-[calc(100dvh-5rem)] w-64 max-w-full overflow-y-auto rounded-lg border border-border bg-card p-3 shadow-lg"
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
            className="mb-1 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {state.panel === "settings" ? "Cookie settings" : usNotice ? "Analytics on this site" : "Your analytics choice"}
          </h2>
          <p className="text-xs leading-snug text-foreground">
            {usNotice
              ? "This site uses Google Analytics cookies. On by default in the US; turn it off anytime."
              : state.panel === "settings"
                ? `Google Analytics is currently ${state.analyticsEnabled ? "on" : "off"}.`
                : "Allow Google Analytics cookies? Off unless you allow it."}
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
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Button variant="outline" size="sm" className="h-8 flex-1 px-2 text-xs" aria-label={usNotice ? undefined : "Allow analytics"} onClick={() => finish(usNotice ? privacyConsent.acknowledge : privacyConsent.allow)}>
              {usNotice ? "Got it" : "Allow"}
            </Button>
            <Button variant="outline" size="sm" className="h-8 flex-1 px-2 text-xs" aria-label="Reject analytics" onClick={() => finish(privacyConsent.reject)}>
              Reject
            </Button>
            {state.panel === "settings" && (
              <Button variant="ghost" size="sm" className="h-8 w-full px-2 text-xs" aria-label="Close settings" onClick={() => finish(privacyConsent.closeSettings)}>
                Close
              </Button>
            )}
          </div>
        </section>
      )}
      {!state.panel && state.storageWarning && (
        <p role="status" className="max-w-64 rounded-md border border-border bg-card p-2 text-xs text-foreground">
          {state.storageWarning}
        </p>
      )}
      <Button
        ref={settingsButton}
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-full bg-card shadow-md"
        aria-label="Cookie settings"
        title="Cookie settings"
        aria-expanded={state.panel !== null}
        aria-controls={state.panel ? "analytics-consent" : undefined}
        onClick={() => {
          openedFromSettings.current = true;
          privacyConsent.openSettings();
        }}
      >
        <Cookie aria-hidden="true" className="h-4 w-4" />
      </Button>
    </div>
  );
}
