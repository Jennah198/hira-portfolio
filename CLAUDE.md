# CLAUDE.md — Hira Muslim Students Association website

Project memory for future work. Keep this file updated when architecture, env vars, or DB schema change.

## Stack
- Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) · **Tailwind CSS v4** (CSS-first config) · shadcn/ui (new-york) + Radix
- Supabase: Postgres, Storage, Auth (`@supabase/ssr`, `@supabase/supabase-js`)
- Package manager: **pnpm** (only `pnpm-lock.yaml` is committed — don't add `package-lock.json`)
- Deploy target: Vercel

## Commands
```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # type errors FAIL the build (ignoreBuildErrors was removed on purpose)
pnpm start
pnpm lint         # ESLint 9 flat config (eslint.config.mjs). `next lint` no longer exists in Next 16
pnpm typecheck    # tsc --noEmit
```
Run `pnpm lint && pnpm typecheck && pnpm build` before committing. There is no test suite.

## Environment (`.env.local`, template in `.env.example`)
| Var | Where used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | all Supabase clients | required |
| `SUPABASE_SERVICE_ROLE_KEY` | public form API routes (preferred client), all `/api/admin/*` | server-only, bypasses RLS |
| `ADMIN_PASSWORD` | `/admin` dashboard login (`src/lib/admin-auth.ts`) | **server-only — never `NEXT_PUBLIC_`**. The old `NEXT_PUBLIC_ADMIN_PASSWORD` is no longer read at all |
| `ADMIN_SESSION_SECRET` | signs admin session cookie | optional; defaults to a value derived from the password |
| `SUBMISSION_WEBHOOK_URL`, `SUBMISSION_WEBHOOK_TOKEN` | `/api/submissions` | optional |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | forms + `/api/uploads`, `/api/contact`, `/api/submissions` | unset = check skipped (dev). Test keys in .env.example |
| `CRON_SECRET` | `/api/cron/daily` (Vercel sends it as Bearer) | without it the cron returns 401 → no keep-alive/retention |
| `RESEND_API_KEY`, `ALERT_EMAIL_TO`, `ALERT_EMAIL_FROM` | `src/lib/notify.ts` | optional email per submission (sent with `after()`) |

Without Supabase env vars the public pages still render (proxy skips Supabase), but forms/admin data fail.

## Layout
```
src/app/(marketing)/        public pages: / (overview), /about, /our-work, /events,
                            /events/{graduation,exhibition}/register, /membership, /contact
                            template.tsx = page-enter transition on every navigation
src/app/not-found.tsx       branded 404 with back button; src/app/error.tsx = translated error boundary
src/app/{icon.png,apple-icon.png,favicon.ico,opengraph-image.jpg,sitemap.ts,robots.ts}  (Next file conventions)
src/lib/site.ts             SINGLE SOURCE for bank account (1000706157364), phones, emails, socials, site URL
src/lib/honeypot.ts         spam honeypot field ("website"); forms render <Honeypot>, APIs return ok without saving
src/app/(admin)/admin/      /admin = password dashboard (SubmissionsAdminDashboard) — the ONLY admin UI.
                            (Legacy Supabase-Auth pages /admin/posts, /admin/registrations, /auth/login were removed:
                            their tables never existed. There is no Supabase Auth, proxy or middleware anymore.)
src/app/api/                form endpoints + /api/admin/* (read-only, cookie-protected)
src/lib/admin-auth.ts       admin password check + HMAC-signed httpOnly session cookie + requireAdmin()
src/lib/supabase/           service.ts (cached service-role client, server-only), resolve-supabase-route.ts (throws if
                            unconfigured), storage-upload.ts (type/size validation), storage-signed-url.ts
src/i18n/                   config.ts (locales, RTL, Accept-Language matching, format()), dictionaries.ts (loaders),
                            server.ts getI18n() for server components, client.tsx useI18n() for client components,
                            dictionaries/{en,ar,am,zh,es,fr,hi,bn}.ts — en.ts is the source of truth (type Dictionary)
src/components/marketing/   hero (slideshow), stats (counters), programmes-grid, events-highlight, event-gallery, steps, cta-band
src/components/forms/       membership/contact/graduation/exhibition forms (client) + Field
src/components/shared/      navbar, footer, page-header, section-heading, accent (Accent/ArrowForward/ArrowBack),
                            language-switcher, theme-toggle, social-links, back-to-top
src/components/motion/      motion-provider (reveal / tilt / parallax / reading progress)
src/components/{admin,ui}
scripts/*.sql               Supabase schema (run manually in SQL editor)
```

## File uploads (direct to Supabase — Vercel limits request bodies to 4.5 MB)
1. Browser → `POST /api/uploads {kind, contentType, size, turnstileToken}` → Turnstile + type/size check →
   `{signedUrl, path, ticket}` (ticket = HMAC(kind:path:exp), 1 h, keyed by ADMIN_SESSION_SECRET).
2. Browser `PUT`s the file to `signedUrl` (no API key needed).
3. Form endpoint (`/api/graduation`, `/api/exhibition`, JSON) verifies ticket + `storage.info()` size, then inserts.
- Buckets enforce `file_size_limit` + `allowed_mime_types` (receipts 10 MB img/pdf; mvp-demos 30 MB +mp4/webm/zip),
  set via the storage API on 2026-11-01. Keep `src/lib/uploads.ts` UPLOAD_KINDS in sync.
- Turnstile tokens are single-use: the upload step consumes it; the ticket proves it for the final submit.
- Older rows store full storage URLs, newer ones paths → always normalise with `extractStorageObjectPath`.

## Daily job `/api/cron/daily` (vercel.json, 03:00 UTC)
Keep-alive query + retention (`src/lib/retention.ts`; must match Privacy Policy text) + orphan upload cleanup.
Expired files: file deleted and column set to `"expired"` (columns are NOT NULL). `?dryRun=1` reports only.

## Admin
`/api/admin/records/[type]` (membership | contact | graduation | exhibition | exhibition-guests): GET list (signed
file URLs), DELETE `?id=` (row + file). Dashboard has Export CSV (UTF-8 BOM, formula-injection safe) and two-step delete.

## Data flow
| Form | Endpoint | Table / storage |
|---|---|---|
| Membership | `POST /api/submissions` `{type:"membership-application"}` | `membership` |
| Contact | `POST /api/contact` (JSON) | `contact_messages` |
| Graduation | `POST /api/graduation` (JSON + receipt path/ticket, receipt required) | `graduation_registrations`, bucket `receipts` |
| Exhibition – exhibitor | `POST /api/exhibition` (JSON + mvp path/ticket) | `exhibition_registrations`, bucket `mvp-demos` |
| Exhibition – guest/company | `POST /api/submissions` `{type:"exhibition-guest-company"}` | `exhibition_guest_registrations` (created by scripts/005) |

Uploads store the **object path** (not a public URL). `/api/admin/{graduation,exhibition}` convert paths to 1-hour signed URLs; the dashboard refetches to refresh them.

## Admin auth model
- `/admin` dashboard: `POST /api/admin/session {password}` → httpOnly, SameSite=strict cookie `hira_admin_session` = `<exp>.<hmac>` (8h). `GET` checks, `DELETE` logs out. Every `/api/admin/*` GET starts with `requireAdmin()` — **add it to any new admin route**.
- Legacy `/admin/posts` and `/admin/registrations` use Supabase Auth + `admins` table RLS.

## Internationalisation (8 languages)
- Locales: en, ar (RTL), am, zh, es, fr, hi, bn — the 7 most-spoken languages worldwide + Amharic. Admin area is English only.
- Locale = `NEXT_LOCALE` cookie (set by LanguageSwitcher → `router.refresh()`), else browser Accept-Language, else en.
  Root layout sets `<html lang dir>`; because it reads cookies, pages render dynamically.
- **Every user-facing string lives in the dictionaries.** Add a key to `en.ts` first; TypeScript then fails until all 7
  other files have it. `*text*` marks an accent phrase (rendered by `<Accent>`); keep `{year}` / `{n}` placeholders.
- Translations were written by Claude — have native speakers review, especially religious terms and ar/am.
- RTL: use logical utilities (`ms-/me-/ps-/pe-/start-/end-`, `text-start`), arrows via `ArrowForward`/`ArrowBack`
  (auto-flip). Phone/email inputs use `dir="ltr"`. Letter-spacing is disabled for non-Latin scripts in CSS.
- Fonts: Geist (Latin) + Noto Sans Arabic/Ethiopic/Devanagari/Bengali (unicode-range, not preloaded); Chinese uses
  system CJK fonts. Instrument Serif italic is used for accent phrases in en/es/fr only.

## Information architecture & motion (inspired by islamic-relief.org + webbuilderagency.com)
- Navbar: formal top bar (motto/phone/email/location) + transparent over photo headers, glass after scroll; xl+ desktop links,
  full-screen mobile menu. Public pages MUST start with a photo header (`Hero` or `PageHeader`) because the navbar is
  white-on-photo at the top. Admin/auth layouts add `pt-[72px]` and get a solid navbar.
- Every inner page uses `PageHeader` (photo, Back button, breadcrumbs, eyebrow, title). Keep adding back links on new pages.
- Section headers: `SectionHeading` with zero-padded index ("01"), eyebrow, accent title.
- Motion attributes (handled globally by MotionProvider; disabled under prefers-reduced-motion):
  `data-reveal` (+ `--reveal-delay`), `data-tilt` (put on an inner element; ±1 sets direction), `data-parallax="0.2"`.
  `.enter` (+ `--enter-delay`) for above-the-fold entrance. `motion-ready` is set pre-paint by an inline script.
- Photos in public/images are WebP, ≤2000px (whole folder ≈1.6 MB). Convert new photos the same way:
  `magick in.png -resize '2000x2000>' -strip -quality 80 out.webp`. Use `imagePosition`/`objectPosition` to keep faces
  in frame for portrait photos (e.g. graduationSisters.webp). next/image serves AVIF/WebP variants.
- Favicons are the Hira emblem; unused template dependencies were removed (keep package.json lean).
- next.config.mjs sets security headers, disables x-powered-by, long cache for /images.
- API routes enforce zod max lengths; /api/submissions caps body at 50 KB.

## Design system — glassmorphism (src/app/globals.css)
- Two deliberately distinct themes, both defined as CSS variables:
  - **Light "Daylight"** (`:root`): warm ivory base, gold/sky/peach glows, frosted white glass, navy text + navy primary buttons.
  - **Dark "Midnight"** (`.dark`): deep navy base, indigo/teal/gold glows, smoky translucent glass, gold primary buttons.
- `<div className="aurora" />` in `app/layout.tsx` is the fixed, animated glow backdrop that glass blurs against (motion disabled under `prefers-reduced-motion`). **Sections must stay transparent** — don't add `bg-background`/`bg-muted` to page sections or it hides the backdrop.
- Utilities (`@utility`): `glass` (cards, panels), `glass-strong` (navbar, footer, toasts, CTA), `glass-subtle` (outline/secondary buttons, chips), `text-gold` (gold text that stays readable in light mode — use instead of `text-accent`), `text-gradient-gold` (headline highlight).
- Glass utilities set background/border-color/shadow/blur only; pair with `border` and a `rounded-*` class.
- Tokens `--card`, `--muted`, `--secondary`, `--border`, `--input` are translucent; `--popover` is semi-opaque and dropdowns/selects add `backdrop-blur-xl`.
- shadcn primitives already restyled: Card (glass, rounded-2xl), Button (primary glow shadow, glass outline/secondary), Input/Textarea/Select (translucent + blur), Toast (glass-strong).
- `@supports not (backdrop-filter)` fallback makes surfaces near-opaque.
- Theme toggle uses `resolvedTheme` (works when theme is "system").
- Photo headers use `.photo-overlay` with per-theme tints (light = warm golden hour, dark = indigo night) and
  `glass-photo` for chips/cards on photos. Buttons are pills; `variant="hero"` (white) and `"photo"` are for photos.

## Supabase security model (IMPORTANT)
- All DB/storage access is server-side with `SUPABASE_SERVICE_ROLE_KEY`. The anon key is unused by the app and must have
  **no** policies: RLS on, zero policies on form tables, buckets `receipts` / `mvp-demos` private with no
  storage.objects policies. `scripts/005_guest_table_and_security.sql` enforces this (found 2026-11-01: an old anon
  SELECT policy let anyone download payment receipts).
  **Applied to the live project on 2026-11-01 and verified** (anon: tables [], insert 401, bucket list [], uncached
  object download 400). Note: Supabase's CDN can briefly serve an already-cached object; it expires per its cache-control.
- Verify after changes: with the anon key, `GET /rest/v1/<table>` must return [] and
  `POST /storage/v1/object/list/receipts` must return [] or an error.
- Graduation `payment_receipt_url` is NOT NULL → receipt upload is required (form + API).
- API errors never return raw DB messages to visitors (logged server-side); upload validation messages are returned.
- Validation uses **zod v4** (`z.email()`, `z.flattenError(err)`); unused react-hook-form/@hookform/@supabase/ssr removed.

## Conventions / gotchas
- Tailwind v4: theme tokens live in `src/app/globals.css` (`@theme inline`, oklch CSS vars, `@custom-variant dark`). There is no `tailwind.config.js`. Animations come from `tw-animate-css`. Don't downgrade to v3 (it silently drops `bg-primary`, `text-muted-foreground`, etc. — this happened once in commit 3b6706e).
- Fonts: Geist via `next/font` CSS variables on `<html>`, mapped to `--font-sans`/`--font-mono` in `@theme`.
- Asset paths are **case-sensitive** on Linux/Vercel (`/images/religiousStudies.png`, not `religiousstudies`).
- Dark mode default via `next-themes` (`attribute="class"`).
- `images.unoptimized: true`; plain `<img>` in events page triggers lint warnings only.
- API routes validate with zod (v3) and trim strings before insert.

## Known open issues / TODO
- No Terms of Service page (Privacy Policy exists at /privacy).
- No Facebook page link (removed `#` placeholder) — add to `site.socials` + social-links.tsx when one exists.
- Bank name / account holder not shown (only the number was provided).
- No rate limiting / captcha on public form endpoints (README mentions Upstash but it isn't implemented).
- `contact_messages`, `graduation_registrations`, `exhibition_registrations` have no CREATE script (they exist in the
  live project; schemas are documented in the header comments of their API routes).
