# luke-ertzberger-website

[![Netlify Status](https://api.netlify.com/api/v1/badges/752e2e16-0259-4d14-95e5-0d8fd0180f81/deploy-status)](https://app.netlify.com/sites/lukeertzberger/deploys)

Personal portfolio site for Luke Ertzberger — AI Solutions Architect & Senior AI Engineer. The main site is a React + TypeScript single-page app built with Vite, styled with Tailwind CSS and shadcn/ui, and animated with Framer Motion.

Live site: https://lukeertzberger.com

## Highlights

- Responsive portfolio focused on AI solutions architecture, engineering, and public sector work
- Sections for hero, about, experience, skills, projects, testimonials, and contact
- Netlify-powered contact form submission flow
- Google Analytics integration
- Static deployment optimized for a custom domain on Netlify

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Router v6
- React Hook Form + Zod
- TanStack Query
- Vitest

## Getting Started

Requirements:

- Node.js 18+
- [Bun](https://bun.sh)

Install dependencies:

```sh
bun install
```

Start the development server:

```sh
bun run dev
```

Create a production build:

```sh
bun run build
```

Preview the production build locally:

```sh
bun run preview
```

Run tests:

```sh
bun run test
```

Run linting:

```sh
bun run lint
```

## Deployment

This site is deployed on Netlify. The contact form is configured for Netlify form handling, including the hidden build-time form in `index.html` and the client-side form post in the React app.

### Regional analytics preferences

GA4 uses measurement ID `G-LYJM23WLL3`. A single controller in `src/lib/privacy-consent.ts` reads the saved preference before loading Google's tag:

- **US:** analytics starts after the regional lookup, with a notice and **Got it / Reject analytics** actions. Got it only acknowledges the US notice; it is not explicit consent.
- **EU/EEA, UK, and every other or unknown country:** no Google Analytics tag or collection requests until **Allow analytics**.
- **Lookup failure, invalid response, or a three-second timeout:** a console warning is logged and the site defaults to opt-in. Unreadable preference storage also prevents automatic analytics.
- Explicit acceptance or rejection is saved locally under `analytics-preference-v1` and applies on future visits. Changes also synchronize across open tabs. A US acknowledgement does not allow analytics when visiting an opt-in region. Region is checked again on each page load, not continuously during an open visit.
- **Cookie settings** is available on every route to reject or re-enable analytics. Rejection sets Google's measurement-specific disable flag before updating Consent Mode v2, blocks new analytics events, and expires accessible GA cookies at the host and parent domains. Google may still transmit events buffered before rejection; already-sent data cannot be recalled, and rejecting does not delete data already held by Google. A tag already loaded remains in memory but is disabled; a saved rejection prevents loading it on the next visit.
- Advertising consent always remains denied, with Google signals and ad personalization disabled. Storage failures show a visible warning: the current-page choice works, but persistence cannot be promised.

Netlify automatically discovers `netlify/edge-functions/privacy-region.ts`; its inline route config serves `/api/privacy-region`. It uses only trusted `context.geo.country.code`, returns just the policy, and disables browser and CDN caching. Deploy the repository through Netlify with `npm run build` and publish directory `dist`; uploading only `dist` to a static host will **not** deploy this edge function. Keep the endpoint ahead of any future forced SPA rewrites and do not cache it. No third-party location service or browser-language inference is used.

Netlify includes Edge Functions on its Free plan; geolocation has no separate paid-service dependency. On the current credit-based Free plan, the endpoint's requests and bandwidth count toward the included monthly allowance (300 credits, hard limit, no automatic recharge). This is not unlimited free usage: exhausting the allowance can pause the site. Older accounts may have legacy allowances; check the site's actual plan before deployment. See [Netlify's pricing documentation](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/).

Vite dev/preview does not execute Netlify edge functions, so local region lookups intentionally fall back to opt-in. Use a Netlify preview or Netlify's development tooling to verify real geolocation. Tests mock the same-origin endpoint for deterministic regional and failure scenarios. Do not add a client-controlled production region override.

This is a technical preference mechanism, not a legal-compliance guarantee. US opt-out defaults may not meet every applicable state law or other requirement; the site owner should review notice, consent, retention, and privacy-policy obligations for the actual deployment.

To troubleshoot GA4 “no data,” allow analytics (or verify a US policy response), then check browser Network for `gtag/js?id=G-LYJM23WLL3` and successful `g/collect` requests. On rejection or an unresolved/opt-in policy without acceptance, their absence is expected. Ad blockers, tracking protection, CSP errors, and a saved rejection can prevent data even when the integration is correct. Check the matching GA4 property's Realtime view after several minutes; standard reports can take 24–48 hours. Use DebugView only with a deliberately enabled debug session, not a permanent production debug flag.
