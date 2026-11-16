# Stitch "ACE Medalleo Luxury Portal" — integration notes

Source: `stitch_ace_medalleo_luxury_portal.zip` (Google Stitch export, Nov 2026).
Branch: `stitch-integration` — **preview only; not merged to `main`, not live.**

## What was integrated

| Stitch concept | Result in this repo | Status |
|---|---|---|
| Financial Estimator & Schedule | `src/components/EmiEstimator.tsx`, placed after Residences (`#emi`) | Built, tested |
| Residence configurator / floor-plan schematics | Already covered by the existing floor-plan viewer, which uses the real brochure plans and areas | Kept existing |
| "Reserve Your Private Sanctuary" form | Already covered by the existing `EnquiryForm` → `/api/enquiry` → Supabase (test mode on previews) | Kept existing |
| Cream / bronze colour scheme (`DESIGN.md`) | The estimator uses the Stitch surface `#f4ede2` and bronze `#735b2e` accent; the rest of the site keeps its current tokens | Partial, by design |

## What was deliberately NOT carried over (and why)

| Stitch content | Reason |
|---|---|
| Prices ₹3.65 Cr / ₹5.15 Cr, ₹15 L booking token, 8.40 % rate, CLP 10/80/10 and 25:25:25:25 plans | Not published by the developer (NOT VERIFIED). The estimator needs the visitor's own quoted price and rate. |
| Lender names (HDFC, ICICI, SBI, Kotak) as "pre-approved" | No source; implies tie-ups |
| Tower names Athena / Aurum / Vista, "Level 24", 3,550 sq ft "Sky Penthouse", 480 sq ft balcony | Contradict the brochure's collections and areas |
| "Under 51 families/acre", "Earthquake Zone V", "85 % open parkland", "22 kW EV", limousine pickup, "72-hour inventory hold", "100 % escrow" | Unverified marketing claims |
| `concierge@acemedalleo.com`, "© Afflux Media & ACE Group" | Unverified contact; unknown third-party credit |
| 360° walkthrough / 3D virtual tour (Three.js r125) | Built on AI-generated renders, not real site or show-flat captures. Needs real 360° assets and permission. |
| AI renders (exterior, penthouse, pool/forest, clubhouse) and the Stitch logo | AI-generated images can't be shown as the project; would mislead under the UP RERA advertising rules. The site keeps its existing brochure-sourced images. |
| Tailwind CDN and remote `lh3.googleusercontent.com` image URLs | Not suitable for production; the repo already ships local, optimised `.webp` assets. |

## Testing (local, production build)

- `next build` ✅ · `eslint` ✅
- Playwright: 51 passed, 1 failed, 2 skipped across desktop, tablet and mobile, with test-only env (mock Supabase, dummy WhatsApp number).
  - New test `EMI estimator: blank until inputs, computes standard EMI` passes on all three viewports (₹1 Cr, 20 % down, 9 %, 20 yrs → ₹71,978/month).
  - The one failure is `[mobile] @local enquiry submission…`. It **also fails on the unchanged `main` code** when run after the desktop and tablet runs, and passes when run alone. It's a pre-existing test-isolation issue with the local rate limit, not a regression.

## Pending (owner inputs)

- Advertiser name / agent RERA number, phone, WhatsApp (env vars) — unchanged
- Real 360° / virtual-tour media plus ACE permission, if a tour is wanted
- Official price list, if price ranges are ever to be shown
