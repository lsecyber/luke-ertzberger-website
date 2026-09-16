type GeoContext = {
  geo?: { country?: { code?: string } };
};

export default function privacyRegion(_request: Request, context: GeoContext): Response {
  // Only Netlify's trusted geolocation can enable the US default.
  const policy = context.geo?.country?.code === "US" ? "opt-out" : "opt-in";

  return new Response(JSON.stringify({ policy }), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "CDN-Cache-Control": "no-store",
      "Netlify-CDN-Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export const config = { path: "/api/privacy-region" };
