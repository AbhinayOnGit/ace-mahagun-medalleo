# QA Report — 16 Nov 2026

**Result: 49 passed · 0 failed · 2 skipped (by design)** — Playwright 1.65, Chromium, production build (`next build && next start`).
Viewports: Desktop 1440×900 · Tablet 820×1180 (touch) · Mobile Pixel 7.
Backend: real migration on PGlite (Postgres 17, WASM) behind a PostgREST-compatible test double, executed as `anon`. No live database used.

| # | Area | Test | D | T | M |
|---|---|---|---|---|---|
| 1 | Load / SEO | 200, title, description, canonical, OG, single H1, JSON-LD (ApartmentComplex + FAQPage), **zero console errors** | ✓ | ✓ | ✓ |
| 2 | Images | Every image loads (no broken), every `<img>` has alt | ✓ | ✓ | ✓ |
| 3 | Links | All in-page anchors resolve; /privacy, /terms, robots.txt, sitemap.xml, og.jpg return 200 | ✓ | ✓ | ✓ |
| 4 | Navigation | Sticky header background on scroll; section links (desktop) / hamburger menu (tablet, mobile) | ✓ | ✓ | ✓ |
| 5 | Hero CTAs | Brochure modal opens pre-set to "Brochure"; Esc closes; Explore scrolls to Residences | ✓ | ✓ | ✓ |
| 6 | WhatsApp / call | wa.me links pre-filled (hero, contact, floating); tel: link | ✓ | ✓ | ✓ |
| 7 | Floor-plan viewer | Collection tabs, unit switch, sq ft ↔ sq m, zoom lightbox 150%, keyboard nav | ✓ | ✓ | ✓ |
| 8 | Gallery | Show all, category filter, lightbox next/close | ✓ | ✓ | ✓ |
| 9 | Location / map | Distance tabs; Google map loads only on request | ✓ | ✓ | ✓ |
| 10 | FAQ | Accordion expands | ✓ | ✓ | ✓ |
| 11 | Form validation | Required fields, Indian mobile, email, consent; focus moves to first error | ✓ | ✓ | ✓ |
| 12 | **Lead storage** | Submission stored with correct fields, `is_test=true`, status `Test`; repeat from modal → "already have your enquiry", 1 row only | ✓ | ✓ | ✓ |
| 13 | API hardening | Server rejects non-Indian mobile (422), no consent (422), malformed JSON (400); honeypot silently dropped | ✓ | ✓ | ✓ |
| 14 | Rate limit | 429 after limit per IP | ✓ | – | – |
| 15 | Reduced motion | Content visible with `prefers-reduced-motion` | ✓ | ✓ | ✓ |
| 16 | Accessibility | Landmarks, labelled controls, named buttons/links, heading order, skip link | ✓ | ✓ | ✓ |
| 17 | Performance (lab, local) | LCP 0.26–0.33 s · CLS ≤ 0.003 · JS 233 KB | ✓ | ✓ | ✓ |

### Database security checks (direct)
idempotent replay → `duplicate` · same mobile+type within 10 min → `duplicate` · invalid mobile → check-constraint error ·
no consent → `consent_required` · `anon` SELECT on `leads` → **permission denied**.

### Defects found and fixed during QA
1. **Mobile field truncated "+91 98162 90661"** (maxLength 14) → valid numbers rejected. Fixed (17).
2. Per-IP limit made configurable (`ENQUIRY_RATE_LIMIT`); prefers Vercel's `x-real-ip`.
3. Floor-plan images had white print margins → trimmed.
4. Lint: removed a setState-in-effect; aria attribute on radio input.

### Not yet tested (needs infrastructure/approval)
- Against a live Supabase project and a Vercel preview URL (`BASE_URL=… npx playwright test --grep-invert @local`).
- Real-device Safari/iOS; field Core Web Vitals over a real network.
