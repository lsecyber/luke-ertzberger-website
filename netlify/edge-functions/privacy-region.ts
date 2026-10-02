export type GeoContext = {
  geo?: { country?: { code?: string } };
};

export function regionPolicy(context: GeoContext): "opt-in" | "opt-out" {
  // Only Netlify's trusted geolocation can enable the US default.
  return context.geo?.country?.code === "US" ? "opt-out" : "opt-in";
}

export default function privacyRegion(_request: Request, context: GeoContext): Response {
  const policy = regionPolicy(context);

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
