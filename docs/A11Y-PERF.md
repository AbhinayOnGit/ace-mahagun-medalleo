# Accessibility & performance pass — 16 Nov 2026

Measured on a local production build (`NEXT_PUBLIC_VERCEL_ENV=production`), Lighthouse 12 + axe-core 4.
The live site sits behind Vercel login protection, so it was not measured directly.

## Results

Lighthouse, simulated mobile, **median of 3 alternating runs** (this machine's CPU makes single runs vary ±5 points):

| | Before (`main` @ 9444861) | After |
|---|---|---|
| Performance | 67 (66 / 67 / 72) | 72 (70 / 76 / 72) |
| Accessibility | 88 | **100** |
| Best practices | 96 | 100 |
| LCP | 6.5 s | 5.7 s |
| TBT | 352 ms | 294 ms |
| CLS | 0.004 | 0.013 |

Desktop: performance 94 → 95, accessibility 88 → 100, LCP 1.6 s (unchanged).
axe (WCAG 2.1 A/AA, whole page with reduced motion so scroll-reveal content is checked): **0 violations** on desktop and mobile. Before: 4 rules / 22+ nodes. Lighthouse alone under-reported this, because it skips content still hidden by scroll-reveal.

SEO shows 69 only because of `noindex` (`ALLOW_INDEXING=false`), which is intentional while the site is private.

## Changes

- **Hero text paints before JS:** entrance animations moved from Motion (opacity 0 until hydration) to CSS keyframes. The LCP paragraph now only moves, so it's never invisible. Reduced motion is still respected via the global rule.
- **Inline CSS** (`experimental.inlineCss`): removes the render-blocking stylesheet request. This suits a landing page whose visitors are mostly first-time ad clicks.
- **Hero image** re-encoded at WebP q68: 335 KB → 270 KB, visually identical.
- **Contrast:** grey text floors raised (`charcoal/40–60 → /70`, `ivory/40–50 → /65`). Gold text on light sections now uses the new `--color-bronze #735b2e` (≥ 5:1, from the Stitch palette). Gold on the green Amenities section uses `gold-soft` (≈ 4.9:1).
- **Legibility:** no text below 12 px (`text-[10px]/[11px] → text-xs`, `.eyebrow` 11 → 12 px).
- **Semantics:** the residence summary is no longer an invalid `<dl>` of buttons; the distance list has a proper `tabpanel` wrapper; accessible names now match visible text (logo link, gallery tiles, walkthrough button).
- **Nav:** the full link row shows from 1280 px (`xl`), with the menu button below that, so 12 px labels and the new Tour link don't wrap.
- **Labels:** every render now carries a visible "Artist's impression" tag (`ImpressionTag`). This covers the hero, overview, interiors, amenities, gallery tiles, the walkthrough poster, the enquiry modal, the contact background and the master plan ("not to scale").

## Not changed (and why)

- **Responsive `srcset` for hero/overview images:** these use `object-cover` in tall mobile boxes, so phones actually need close to the full image height. Lighthouse's "properly size images" saving overstates it here, and smaller files would look soft.
- **Remaining TBT (~0.3 s):** comes mostly from the Motion animation library and React hydration. Reducing it further means removing scroll animations, which is a design decision.

## Tests added

- `axe: no WCAG 2.1 A/AA violations across the whole page` (all three viewports)
- `every render carries a visible 'Artist's impression' label`
- The enquiry-submission test now uses its own client IP per run, so the per-IP rate limit no longer makes the suite flaky.

Suite: **61 passed, 0 failed, 2 skipped** (skips are by design: run-once API tests).
