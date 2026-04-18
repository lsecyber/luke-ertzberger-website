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
