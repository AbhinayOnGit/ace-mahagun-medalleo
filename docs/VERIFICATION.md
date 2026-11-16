# Project Facts — Verification Register

Researched 16 Nov 2026. Primary sources: official brochure PDF (Apr 2026) from acegroupindia.com, ACE project page,
ACE-branded microsite (acemedalleomahagun.com). Data lives in `src/content/project.ts`.

## VERIFIED (official developer material) — shown on site
| Fact | Value | Source |
|---|---|---|
| Location | Plot GH-01/A (Alpha), Sector 107, Noida | Brochure disclaimer |
| Configurations | 3 & 4 BHK | ACE project page |
| Land area | Approx. 10 acres | ACE project page |
| UP RERA | UPRERAPRJ125561 | ACE page, brochure |
| Architect | Hafeez Contractor & global design experts | Brochure hallmarks |
| Certification | IGBC Gold Certified | ACE project page (hallmark) |
| Development Manager / land allottee | ACE / Mahagun Infratech Pvt. Ltd. | Brochure disclaimer |
| Launch date / building plan | 23.11.2022 / permit 2022/01/31/6228 dt 09.09.2022 | Brochure disclaimer |
| Unit areas (8 unit types) | Super / built-up / carpet / balcony | Brochure floor-plan tables |
| Amenities (3 realms) | Landscape, Clubhouse, Iconic Tower lists | Brochure |
| Distances | 22 destinations with km / min | Brochure location map ("Map not to scale") |

## INFERRED / NOT VERIFIED — deliberately NOT shown
| Item | What was found | Action needed |
|---|---|---|
| Land area 9.88 acres | 40,000 sq m plot in third-party RERA summaries (≈ 9.88 ac) | Confirm on up-rera.in, then update `landArea` |
| Possession date | Third-party sites cite Dec 2027 / Sep 2029 (RERA completion) — inconsistent | Confirm with developer / UP RERA |
| Towers / floors / units | Third-party: 6–8 towers, 686–936 units; a third-party-hosted brochure mentions "2 blocks of G+4 and 6 blocks of S+28" | Confirm with developer |
| Prices | Third-party listings quote ₹2.5–10 Cr | Not used. Price on request only |
| Sapphire/Garnet Type-II (wings 21, 22, 25, 26) balcony area | Brochure table shows 567.37 sq m / 52.71 sq ft (appears swapped/incorrect) | Balcony row omitted; ask ACE for corrected figure |
| Iconic Tower "full-floor" | Brochure hallmark says "Exclusive Full-Floor Apartment" but shows Unit 1 & Unit 2 plans | Copy says "full-floor apartments in the Iconic Tower" per brochure; confirm wording |

## Asset authorisation (OUTSTANDING)
All renders, interiors, floor plans and maps are taken from ACE's publicly published brochure and website.
**Written authorisation from ACE Group to use them on this marketing site has not been confirmed.**
Stock lifestyle photos in the brochure (people, trains, doctors) were deliberately excluded.

## Advertiser compliance (OUTSTANDING)
- Advertiser legal name and UP RERA agent registration number (`NEXT_PUBLIC_ADVERTISER_NAME`, `NEXT_PUBLIC_AGENT_RERA_NUMBER`).
- Approved WhatsApp / phone numbers (buttons stay hidden until set).
- Privacy Policy / Terms placeholders in `src/app/privacy` and `src/app/terms`.
