import { regionPolicy, type GeoContext } from "./privacy-region.ts";

export const POLICY_META_NAME = "privacy-region-policy";

type HtmlContext = GeoContext & { next: () => Promise<Response> };

// Stamps the visitor's policy into the page itself so the banner never depends on a
// second request that slow mobile networks or content blockers can drop.
export default async function privacyRegionHtml(_request: Request, context: HtmlContext): Promise<Response> {
  const response = await context.next();
  if (!response.headers.get("Content-Type")?.includes("text/html")) return response;

  const html = await response.text();
  const meta = `<meta name="${POLICY_META_NAME}" content="${regionPolicy(context)}">`;
  const headers = new Headers(response.headers);
  headers.delete("Content-Length");
  // The page now varies per visitor location, so no shared cache may store it.
  headers.set("Cache-Control", "private, no-cache");
  headers.set("CDN-Cache-Control", "no-store");
  headers.set("Netlify-CDN-Cache-Control", "no-store");

  return new Response(html.replace(/<head(\s[^>]*)?>/i, (head) => `${head}${meta}`), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// GET only, so contact-form POSTs to "/" never pass through here.
// "bypass" serves the untouched page if this function ever errors; the client then
// falls back to /api/privacy-region.
export const config = {
  path: "/*",
  method: ["GET"],
  excludedPath: ["/api/*", "/assets/*"],
  onError: "bypass",
};
