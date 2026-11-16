# Stitch "ACE Medalleo Luxury Portal" — integration notes

Source: `stitch_ace_medalleo_luxury_portal.zip` (Google Stitch export, Nov 2026).
Branch: `stitch-integration` — **preview only; not merged to `main`, not live.**

## What was integrated

| Stitch concept | Result in this repo | Status |
|---|---|---|
| Financial Estimator & Schedule | `src/components/EmiEstimator.tsx`, placed after Residences (`#emi`) | Built, tested |
| Residence configurator / floor-plan schematics | Already covered by the existing floor-plan viewer, which uses the real brochure plans and areas | Kept existing |
| "Reserve Your Private Sanctuary" form | Already covered by the existing `EnquiryForm` → `/api/enquiry` → Supabase (test mode on previews) | Kept existing |
| 360° walkthrough / 3D virtual tour | `src/components/VirtualTour.tsx` (`#tour`, after Amenities): (a) ACE's **official walkthrough film** (YouTube `6ATAQnA3edY`, the same embed ACE uses on acegroupindia.com and acemedalleomahagun.com), loaded only on click via youtube-nocookie; (b) a dependency-free **360° photo viewer** (`src/lib/pano.ts`, WebGL) for equirectangular photos listed in `tours360` in `project.ts` | Built, tested |
| Cream / bronze colour scheme (`DESIGN.md`) | The estimator uses the Stitch surface `#f4ede2` and bronze `#735b2e` accent; the rest of the site keeps its current tokens | Partial, by design |

## What was deliberately NOT carried over (and why)

| Stitch content | Reason |
|---|---|
| Prices ₹3.65 Cr / ₹5.15 Cr, ₹15 L booking token, 8.40 % rate, CLP 10/80/10 and 25:25:25:25 plans | Not published by the developer (NOT VERIFIED). The estimator needs the visitor's own quoted price and rate. |
| Lender names (HDFC, ICICI, SBI, Kotak) as "pre-approved" | No source; implies tie-ups |
| Tower names Athena / Aurum / Vista, "Level 24", 3,550 sq ft "Sky Penthouse", 480 sq ft balcony | Contradict the brochure's collections and areas |
| "Under 51 families/acre", "Earthquake Zone V", "85 % open parkland", "22 kW EV", limousine pickup, "72-hour inventory hold", "100 % escrow" | Unverified marketing claims |
| `concierge@acemedalleo.com`, "© Afflux Media & ACE Group" | Unverified contact; unknown third-party credit |
| Stitch 3D tour scene (Three.js r125) and AI "360°" gallery | The 3D scene is generic box massing with invented hotspot claims; the "360°" page is a pan over AI images. A relabelled 3D concept appears **only** in the private preview artifact, marked "Concept demo – not the actual project". |
| AI renders (exterior, penthouse, pool/forest, clubhouse) and the Stitch logo | AI-generated images can't be shown as the project; would mislead under the UP RERA advertising rules. The site keeps its existing brochure-sourced images. |
| Tailwind CDN and remote `lh3.googleusercontent.com` image URLs | Not suitable for production; the repo already ships local, optimised `.webp` assets. |

## Testing (local, production build)

- `next build` ✅ · `eslint` ✅
- Playwright: 54 passed, 1 failed, 2 skipped across desktop, tablet and mobile, with test-only env (mock Supabase, dummy WhatsApp number).
  - New test `EMI estimator: blank until inputs, computes standard EMI` passes on all three viewports (₹1 Cr, 20 % down, 9 %, 20 yrs → ₹71,978/month).
  - New test `virtual tour: walkthrough loads on click; 360° viewer renders` passes on all three viewports.
  - The one failure is `@local enquiry submission…` on whichever viewport runs after the local rate limit fills (mobile or tablet). It **also fails on the unchanged `main` code**, and passes when run alone. It's a pre-existing test-isolation issue with the local rate limit, not a regression.

## 360° viewer behaviour

- `tours360` is **empty** until real 360° photos (2:1 equirectangular JPG/WebP in `public/tours/`) are supplied with permission.
- While empty: hidden on production (`NEXT_PUBLIC_VERCEL_ENV=production`); on previews and local builds it shows `public/tours/test-pattern.webp`, badged "Test pattern · preview only".
- Drag / arrow keys to look, +/− and wheel to zoom, reset button; auto-rotate is off under reduced motion; WebGL-unavailable fallback message.

## Pending (owner inputs)

- Written OK from ACE to re-embed the walkthrough film (the embed is public on ACE's own sites; re-use permission is not yet on record)
- Real 360° photos of the site / sample flat

- Advertiser name / agent RERA number, phone, WhatsApp (env vars) — unchanged
- Official price list, if price ranges are ever to be shown
