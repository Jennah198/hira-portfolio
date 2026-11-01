# Hira Muslim Students Association — Website

Official website of the Hira Muslim Students Association (Addis Ababa, Ethiopia): programs, events,
membership applications, event registration, and a password-protected submissions dashboard.

## Features

- **8 languages** — English, العربية (RTL), አማርኛ, 中文, Español, Français, हिन्दी, বাংলা
- **Light and dark themes** with a glassmorphism design and scroll animations (respects reduced-motion)
- **Pages** — Home, About Us, Our Work, Events, Membership, Contact, Graduation & Exhibition registration
- **Forms** stored in Supabase (Postgres + Storage for receipts / project demos), with spam honeypot and input limits
- **Admin dashboard** at `/admin` (server-side password, httpOnly session cookie, signed file links)
- SEO: sitemap, robots.txt, Open Graph image, per-page metadata

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui + Radix · Supabase · Vercel

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in the values
pnpm dev                     # http://localhost:3000
```

### Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only. Used by form APIs and the admin dashboard |
| `ADMIN_PASSWORD` | yes | Password for `/admin`. Never prefix with `NEXT_PUBLIC_` |
| `ADMIN_SESSION_SECRET` | recommended | Random string used to sign admin sessions |
| `NEXT_PUBLIC_SITE_URL` | recommended | Production URL, e.g. `https://hira.org` (sitemap, share links) |
| `SUBMISSION_WEBHOOK_URL` / `SUBMISSION_WEBHOOK_TOKEN` | optional | Forward submissions to another service |

### Database

Tables: `membership`, `contact_messages`, `graduation_registrations`, `exhibition_registrations`,
`exhibition_guest_registrations` (columns documented at the top of each `src/app/api/*/route.ts`).
Private storage buckets: `receipts`, `mvp-demos`.

Run `scripts/005_guest_table_and_security.sql` once in the Supabase SQL Editor: it creates the guest table and removes
all public (anon-key) access. The app only uses the service-role key on the server.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Development server |
| `pnpm build` | Production build (fails on type errors) |
| `pnpm start` | Run the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |

## Editing content

- **Text:** `src/i18n/dictionaries/*.ts` (English `en.ts` is the source; every language must have the same keys).
- **Contact details, bank account, social links:** `src/lib/site.ts`.
- **Photos:** `public/images/` (WebP, ≤ 2000px).

See `CLAUDE.md` for architecture notes.
