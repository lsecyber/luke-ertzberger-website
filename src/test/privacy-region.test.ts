import { describe, expect, it } from "vitest";
import privacyRegion, { config } from "../../netlify/edge-functions/privacy-region";

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
