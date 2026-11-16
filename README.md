# ACE Mahagun Medalleo — Luxury Landing Page

A bespoke, lead-generating landing page for **ACE Mahagun Medalleo, Sector 107, Noida** (UP RERA: UPRERAPRJ125561).

- **Stack:** Next.js 16 (App Router, Cache Components) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lucide · Zod
- **Backend:** Supabase Postgres via a single `SECURITY DEFINER` RPC (`submit_lead`) — the web app only holds the publishable key.
- **Fonts:** Cormorant Garamond + Manrope, self-hosted via Fontsource (no Google Fonts request).

## Quick start

```bash
npm install
cp .env.example .env.local      # fill values (see below)
npm run dev                      # http://localhost:3000
```

## Project structure

```
src/
  app/
    page.tsx              # section composition + JSON-LD
    layout.tsx            # metadata, OG, fonts
    api/enquiry/route.ts  # server-side validation → Supabase RPC
    privacy/ terms/       # legal templates (fill placeholders)
    sitemap.ts robots.ts  # robots blocks indexing except approved production
  components/             # Nav, Hero, Overview, Residences (floor-plan viewer), Amenities,
                          # Gallery, Location, Closing (CTA/FAQ/About/Footer), EnquiryForm/Provider, Lightbox
  content/project.ts      # ★ single source of truth for every project fact (with VERIFIED/NOT_VERIFIED status)
  lib/config.ts           # env-driven contact config (WhatsApp/phone never hard-coded)
  lib/lead-schema.ts      # Zod schema shared by client + server; Indian mobile normalisation
supabase/migrations/      # leads table, RLS, submit_lead()
tests/                    # Playwright E2E + PGlite-backed Supabase test double
docs/                     # deployment, verification items, QA report, SEO checklist
public/images/            # optimised WebP assets from the developer's published material
```

## Updating project content

Edit **`src/content/project.ts`** only — prices, possession, towers etc. live under `project.pending` and are
never rendered as facts. See `docs/VERIFICATION.md` for open items.

## Lead pipeline

`EnquiryForm` → `POST /api/enquiry` → Zod validation, honeypot, per-IP rate limit → `rpc/submit_lead`
(Postgres validates again, de-duplicates by idempotency key and by mobile+type within 10 min, stores consent text & time).

## Testing

```bash
npm run build && npm run test:e2e
```
Runs desktop / tablet / mobile projects against a production build. Lead tests use
`tests/support/mock-supabase.mjs` — real Postgres (PGlite/WASM) with the real migration, executed as the
`anon` role so RLS and grants are exercised. No live database is touched.

Against a deployed preview: `BASE_URL=https://<preview-url> npx playwright test --grep-invert @local`

See `docs/DEPLOYMENT.md` for Supabase + Vercel setup.
