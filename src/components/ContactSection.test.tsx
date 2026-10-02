import { readFileSync } from "fs";
import path from "path";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContactSection from "./ContactSection";

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion");
  return { ...actual, useInView: () => true };
});

class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("IntersectionObserver", IO);

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Let's talk about an AI project." } });
  fireEvent.click(screen.getByRole("button", { name: /send message/i }));
}

describe("contact form spam protection", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("declares the honeypot field in the static Netlify form that bots scrape", () => {
    const html = readFileSync(path.resolve(__dirname, "../../index.html"), "utf8");
    const form = html.match(/<form name="contact"[\s\S]*?<\/form>/)?.[0] ?? "";
    expect(form).toContain('netlify-honeypot="bot-field"');
    expect(form).toContain('name="bot-field"');
  });

  it("never renders or submits the honeypot, so real visitors can't trip it", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const { container } = render(<ContactSection />);
    expect(container.querySelector('[name="bot-field"]')).toBeNull();

    fillAndSubmit();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const body = new URLSearchParams(fetchMock.mock.calls[0][1].body);
    expect(body.has("bot-field")).toBe(false);
    expect(body.get("form-name")).toBe("contact");
    expect(body.get("message")).toBe("Let's talk about an AI project.");
    expect(await screen.findByRole("button", { name: /sent!/i })).toBeInTheDocument();
  });

  it("shows an error and keeps the message when Netlify rejects the submission", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 500 })));
    render(<ContactSection />);

    fillAndSubmit();

    expect(await screen.findByText(/didn't go through/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toHaveValue("Let's talk about an AI project.");
  });
});
