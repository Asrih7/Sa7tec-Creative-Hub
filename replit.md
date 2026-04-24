# SA7TEC Workspace

## Overview

Marketing website for **SA7TEC** — a mobile app studio building games, e-commerce, education, health and custom mobile apps. Tagline: "From Idea to Reality."

The site is a single-page React app with a hidden admin panel. There is no backend — all editable content and contact-form submissions are stored in the visitor's browser (`localStorage`).

## Artifacts

- `artifacts/sa7tec` — public marketing site + hidden admin panel (React + Vite + Tailwind v4 + framer-motion + wouter)
- `artifacts/api-server` — scaffolded Express API (not currently used by the site)
- `artifacts/mockup-sandbox` — design sandbox (unused)

## Public routes

- `/` — animated landing page (hero, services, flagship game, portfolio, process, stats, testimonials, contact CTA)
- `/games/rubiks-race` — flagship game detail page
- `/contact` — contact form (submissions saved to localStorage)

## Hidden admin

- `/admin` — password login (NOT linked in any nav)
- `/admin/dashboard` — full content editor (site info, services, games, portfolio, testimonials, stats, process, contact info, view/export contact submissions, change password, logout)

**Default admin password:** `sa7tec2026`
The password is stored in `localStorage` under `sa7tec_admin_pwd` and can be changed from the dashboard.
Session token is kept in `sessionStorage` so login expires when the browser closes.

All site content is stored in `localStorage` under `sa7tec_content_v1` via `src/lib/content-store.tsx`.

## Languages (i18n)

The site supports **English / French / Arabic** via `src/lib/i18n.tsx`:
- Language switcher (globe icon) in the public header and admin top bar.
- Selected language persists to `localStorage` under `sa7tec_lang`.
- Arabic auto-applies `dir="rtl"` to `<html>` and switches the font stack to Noto Sans/Kufi Arabic.
- Static UI strings live in the `STRINGS` dictionary (`useLanguage().t(key)`).
- Admin-editable text fields use the `LocalizedString` type (`string | { en, fr?, ar? }`); pages render them with `useLanguage().tr(value)`.
- The admin dashboard exposes EN/FR/AR tabs per translatable text field via `<LocalizedField>`.

## Stack

- pnpm workspace monorepo, Node 24, TypeScript 5.9
- React 18 + Vite + Tailwind v4 + shadcn/ui + framer-motion + wouter + lucide-react
