import { StrictMode } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function setup(policy = "opt-in", saved?: string) {
  if (saved) localStorage.setItem("analytics-preference-v1", saved);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ policy }))));
  const { default: PrivacyConsent } = await import("./PrivacyConsent");
  const { privacyConsent } = await import("@/lib/privacy-consent");
  const view = render(<StrictMode><PrivacyConsent /></StrictMode>);
  await act(async () => { await privacyConsent.initialize(); });
  return { ...view, privacyConsent };
}

describe("privacy banner and persistent settings", () => {
  beforeEach(() => {
    vi.resetModules();
    localStorage.clear();
    document.querySelectorAll('script[src*="googletagmanager.com"]').forEach((script) => script.remove());
    delete window.dataLayer;
    delete window.gtag;
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("shows equal opt-in actions in a labelled nonmodal region without stealing focus", async () => {
    await setup();
    expect(screen.getByRole("region", { name: "Your analytics choice" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(document.body);
    expect(screen.getByRole("button", { name: "Allow analytics" }).className)
      .toBe(screen.getByRole("button", { name: "Reject analytics" }).className);
    expect(document.querySelector('script[src*="googletagmanager.com"]')).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("uses the US notice and saves Got it as acknowledgement only", async () => {
    await setup("opt-out");
    expect(screen.getByText(/This site uses Google Analytics cookies/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Allow analytics" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));
    expect(localStorage.getItem("analytics-preference-v1")).toBe("us-notice");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cookie settings" })).toBeInTheDocument();
  });

  it("rejects, restores focus, reopens settings, and re-enables analytics", async () => {
    const { privacyConsent } = await setup("opt-out");
    const reject = screen.getByRole("button", { name: "Reject analytics" });
    reject.focus();
    fireEvent.click(reject);
    const settings = screen.getByRole("button", { name: "Cookie settings" });
    expect(settings).toHaveFocus();
    expect(privacyConsent.getSnapshot().analyticsEnabled).toBe(false);
    fireEvent.click(settings);
    expect(screen.getByRole("heading", { name: "Cookie settings" })).toHaveFocus();
    expect(screen.getByText(/Analytics is currently off/)).toBeInTheDocument();
    const allow = screen.getByRole("button", { name: "Allow analytics" });
    allow.focus();
    fireEvent.click(allow);
    expect(settings).toHaveFocus();
    expect(privacyConsent.getSnapshot().analyticsEnabled).toBe(true);
    expect(localStorage.getItem("analytics-preference-v1")).toBe("accepted");
  });

  it("opens settings for a saved rejection and closes with Escape without changing consent", async () => {
    const { privacyConsent } = await setup("opt-out", "rejected");
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    const settings = screen.getByRole("button", { name: "Cookie settings" });
    fireEvent.click(settings);
    const heading = screen.getByRole("heading", { name: "Cookie settings" });
    expect(heading).toHaveFocus();
    fireEvent.keyDown(heading, { key: "Escape" });
    expect(settings).toHaveFocus();
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(privacyConsent.getSnapshot().analyticsEnabled).toBe(false);
  });

  it("visibly reports storage errors, retains warning when closed, and allows retry", async () => {
    await setup();
    const write = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Blocked"); });
    fireEvent.click(screen.getByRole("button", { name: "Reject analytics" }));
    expect(screen.getByRole("alert")).toHaveTextContent("could not be saved");
    fireEvent.click(screen.getByRole("button", { name: "Close settings" }));
    expect(screen.getByRole("status")).toHaveTextContent("could not be saved");
    fireEvent.click(screen.getByRole("button", { name: "Cookie settings" }));
    write.mockRestore();
    fireEvent.click(screen.getByRole("button", { name: "Reject analytics" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(localStorage.getItem("analytics-preference-v1")).toBe("rejected");
  });

  it("shows pending settings without loading Google, and honors a choice before resolution", async () => {
    let resolve!: (response: Response) => void;
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise((done) => { resolve = done; })));
    const { default: PrivacyConsent } = await import("./PrivacyConsent");
    render(<PrivacyConsent />);
    fireEvent.click(screen.getByRole("button", { name: "Cookie settings" }));
    expect(screen.getByRole("status")).toHaveTextContent("Checking your region");
    expect(document.querySelector('script[src*="googletagmanager.com"]')).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Reject analytics" }));
    await act(async () => { resolve(new Response(JSON.stringify({ policy: "opt-out" }))); });
    await waitFor(() => expect(screen.queryByRole("region")).not.toBeInTheDocument());
    expect(document.querySelector('script[src*="googletagmanager.com"]')).toBeNull();
  });
});
