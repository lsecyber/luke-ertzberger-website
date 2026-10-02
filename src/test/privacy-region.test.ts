import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import privacyRegion, { config } from "../../netlify/edge-functions/privacy-region";
import privacyRegionHtml, { config as htmlConfig } from "../../netlify/edge-functions/privacy-region-html";

describe("Netlify regional privacy policy", () => {
  it.each([
    ["US", "opt-out"],
    ["GB", "opt-in"],
    ["DE", "opt-in"],
    ["FR", "opt-in"],
    ["IE", "opt-in"],
    ["NO", "opt-in"],
    ["IS", "opt-in"],
    ["LI", "opt-in"],
    ["CA", "opt-in"],
    ["AU", "opt-in"],
    ["ZZ", "opt-in"],
    ["us", "opt-in"],
    ["US ", "opt-in"],
    ["USA", "opt-in"],
    ["", "opt-in"],
    [undefined, "opt-in"],
  ])("maps %s to %s using only trusted context", async (code, policy) => {
    const request = new Request("https://example.com/api/privacy-region?country=US", {
      headers: { "X-Country": "US", "Accept-Language": "en-US" },
    });
    const response = privacyRegion(request, { geo: { country: { code } } });
    expect(await response.json()).toEqual({ policy });
  });

  it.each([{}, { geo: {} }, { geo: { country: {} } }, { geo: null }])(
    "fails closed when geo is missing: %j",
    async (context) => {
      expect(await privacyRegion(new Request("https://example.com/api/privacy-region"), context).json())
        .toEqual({ policy: "opt-in" });
    },
  );

  it.each([null, 123, ["US"], { code: "US" }])("fails closed for malformed country codes: %j", async (code) => {
    const context = { geo: { country: { code } } } as unknown as Parameters<typeof privacyRegion>[1];
    expect(await privacyRegion(new Request("https://example.com/api/privacy-region"), context).json())
      .toEqual({ policy: "opt-in" });
  });

  it("does not cache or expose the visitor's location", async () => {
    const response = privacyRegion(new Request("https://example.com/api/privacy-region"), {
      geo: { country: { code: "US" } },
    });
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/json; charset=utf-8");
    for (const header of ["Cache-Control", "CDN-Cache-Control", "Netlify-CDN-Cache-Control"]) {
      expect(response.headers.get(header)).toBe("no-store");
    }
    expect(await response.json()).toEqual({ policy: "opt-out" });
    expect(config).toEqual({ path: "/api/privacy-region" });
  });
});

describe("Netlify HTML region stamp", () => {
  const page = (body = "<!doctype html><html lang=\"en\"><head><title>x</title></head><body></body></html>", type = "text/html; charset=UTF-8") =>
    new Response(body, { headers: { "Content-Type": type, "Content-Length": String(body.length), "Cache-Control": "public, max-age=0, must-revalidate" } });
  const run = (code: string | undefined, response = page()) =>
    privacyRegionHtml(new Request("https://example.com/"), { geo: { country: { code } }, next: async () => response });

  it.each([["US", "opt-out"], ["DE", "opt-in"], [undefined, "opt-in"]])(
    "stamps %s visitors with %s inside <head>",
    async (code, policy) => {
      const response = await run(code);
      const html = await response.text();
      expect(html).toContain(`<head><meta name="privacy-region-policy" content="${policy}"><title>`);
      expect(response.headers.get("Content-Length")).toBeNull();
      expect(response.headers.get("Cache-Control")).toBe("private, no-cache");
      expect(response.headers.get("Netlify-CDN-Cache-Control")).toBe("no-store");
    },
  );

  it("passes non-HTML responses through untouched", async () => {
    const original = page("{}", "application/json");
    expect(await run("US", original)).toBe(original);
  });

  it("never runs on form POSTs or API/asset paths", () => {
    expect(htmlConfig.method).toEqual(["GET"]);
    expect(htmlConfig.excludedPath).toEqual(expect.arrayContaining(["/api/*", "/assets/*"]));
    expect(htmlConfig.onError).toBe("bypass");
  });

  it("is not baked into the static page", () => {
    expect(readFileSync(path.resolve(__dirname, "../../index.html"), "utf8")).not.toContain("privacy-region-policy");
  });
});
