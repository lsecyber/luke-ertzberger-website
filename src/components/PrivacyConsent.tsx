import { useEffect, useRef, useSyncExternalStore } from "react";
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
    <>
      <div className="fixed bottom-0 left-0 z-50 max-w-full p-3 sm:p-4">
        {!state.panel && state.storageWarning && (
          <p role="status" className="mb-2 max-w-sm rounded-md border border-border bg-card p-3 text-sm text-foreground">
            {state.storageWarning}
          </p>
        )}
        <Button
          ref={settingsButton}
          variant="outline"
          className="min-h-11"
          aria-expanded={state.panel !== null}
          aria-controls={state.panel ? "analytics-consent" : undefined}
          onClick={() => {
            openedFromSettings.current = true;
            privacyConsent.openSettings();
          }}
        >
          Cookie settings
        </Button>
      </div>
      {state.panel && (
        <section
          id="analytics-consent"
          ref={panel}
          aria-labelledby="analytics-consent-title"
          className="fixed inset-x-0 bottom-20 z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto border-y border-border bg-card p-5 sm:mx-4 sm:rounded-xl sm:border sm:p-6"
          onKeyDown={(event) => {
            if (event.key === "Escape" && state.panel === "settings") {
              event.preventDefault();
              finish(privacyConsent.closeSettings);
            }
          }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2
                id="analytics-consent-title"
                ref={heading}
                tabIndex={-1}
                className="mb-2 text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {state.panel === "settings" ? "Cookie settings" : usNotice ? "Analytics on this site" : "Your analytics choice"}
              </h2>
              <p className="text-sm leading-relaxed text-foreground">
                {usNotice
                  ? "This site uses Google Analytics cookies to understand visits and improve the site. Analytics is on by default in the US. You can reject analytics now or change your choice in Cookie settings."
                  : state.panel === "settings"
                    ? `Google Analytics cookies help understand visits and improve the site. Analytics is currently ${state.analyticsEnabled ? "on" : "off"}. You can allow or reject it at any time.`
                    : "May this site use Google Analytics cookies to understand visits and improve the site? Analytics stays off unless you allow it. You can change your choice in Cookie settings."}
                {" "}Advertising storage and personalization are disabled.
              </p>
              {state.policy === null && (
                <p role="status" className="mt-2 text-sm text-foreground">
                  Checking your region. No analytics starts without a regional policy or your permission.
                </p>
              )}
              {state.regionWarning && (
                <p className="mt-2 text-sm text-foreground">{state.regionWarning}</p>
              )}
              {state.storageWarning && (
                <p role="alert" className="mt-3 text-sm font-medium text-foreground">{state.storageWarning}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:flex-wrap lg:max-w-sm">
              <Button variant="outline" className="min-h-11" onClick={() => finish(usNotice ? privacyConsent.acknowledge : privacyConsent.allow)}>
                {usNotice ? "Got it" : "Allow analytics"}
              </Button>
              <Button variant="outline" className="min-h-11" onClick={() => finish(privacyConsent.reject)}>
                Reject analytics
              </Button>
              {state.panel === "settings" && (
                <Button variant="ghost" className="min-h-11" onClick={() => finish(privacyConsent.closeSettings)}>
                  Close settings
                </Button>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
