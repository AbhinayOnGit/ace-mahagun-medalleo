/**
 * ACE Mahagun Medalleo — single source of truth for all project facts.
 *
 * Every fact carries a `status`:
 *   VERIFIED      — taken from an official developer source (see `sources`).
 *   NOT_VERIFIED  — editable placeholder; never rendered as fact.
 *
 * Update facts here; components read from this file only.
 * Last researched: 16 Nov 2026.
 */

export type Status = "VERIFIED" | "NOT_VERIFIED";

export const sources = {
  brochure: {
    label: "Official ACE Mahagun Medalleo brochure (PDF, Apr 2026)",
    url: "https://acegroupindia.com/pdf/brochure/ACE-Mahagun-Medalleo-Brochure.pdf",
  },
  developerPage: {
    label: "ACE Group — project page",
    url: "https://acegroupindia.com/ace-mahagun-medalleo.php",
  },
  microsite: {
    label: "ACE-branded project microsite",
    url: "https://acemedalleomahagun.com/",
  },
  rera: { label: "UP RERA", url: "https://www.up-rera.in/projects" },
} as const;

export const project = {
  name: "ACE Mahagun Medalleo",
  shortName: "Medalleo",
  tagline: "The Art Deco Crown of Noida", // brochure, VERIFIED
  location: {
    sector: "Sector 107",
    city: "Noida",
    state: "Uttar Pradesh",
    display: "Sector 107, Noida",
    // Plot address as published in the official disclaimer
    plot: "Plot No. GH-01/A (Alpha), Sector 107, Noida, Gautam Buddh Nagar, Uttar Pradesh 201304",
    mapQuery: "Mahagun Medalleo, Sector 107, Noida, Uttar Pradesh",
    status: "VERIFIED" as Status,
  },
  landArea: {
    display: "Approx. 10 acres",
    note: "Developer states approx. 10 acres. A 9.88-acre (40,000 sq m) figure appears in third-party RERA summaries and must be confirmed on up-rera.in before use.",
    status: "VERIFIED" as Status,
  },
  configurations: { display: "3 & 4 BHK Residences", status: "VERIFIED" as Status },
  rera: {
    number: "UPRERAPRJ125561",
    website: "https://www.up-rera.in/projects",
    status: "VERIFIED" as Status,
  },
  architect: { display: "Hafeez Contractor & global design experts", status: "VERIFIED" as Status },
  certification: { display: "IGBC Gold Certified", status: "VERIFIED" as Status },
  legal: {
    developmentManager: "ACE (Development Manager — planning, coordination and execution)",
    landAllottee:
      "Mahagun Infratech Private Limited, vide lease deed dated 08.10.2021 with the New Okhla Industrial Development Authority",
    launchDate: "23.11.2022",
    buildingPlan: "Permit no. 2022/01/31/6228 dated 09.09.2022",
    collectionAccount:
      "M/s Mahagun Infratech Private Limited Collection Account for Mahagun Medalleo — A/c 777705432189",
    status: "VERIFIED" as Status,
  },
  // Deliberately NOT published — placeholders until officially confirmed
  pending: {
    price: { display: "Price on request", status: "NOT_VERIFIED" as Status },
    possession: { display: "To be confirmed", status: "NOT_VERIFIED" as Status },
    towersAndFloors: { display: "To be confirmed", status: "NOT_VERIFIED" as Status },
    inventory: { display: "Subject to availability", status: "NOT_VERIFIED" as Status },
  },
} as const;

export const hallmarks = [
  { title: "Bespoke Residences", body: "Exclusive full-floor apartments in the Iconic Tower." },
  { title: "Art Deco Grandeur", body: "A timeless architectural expression." },
  { title: "Curated Design Collaborations", body: "Crafted by Hafeez Contractor and global design experts." },
  { title: "Two Exclusive Clubhouses", body: "A grand clubhouse experience in two realms." },
  { title: "Resort-Style Landscapes", body: "Indulgences set amidst greens and serene open spaces." },
  { title: "World-Class Hospitality", body: "Dedicated concierge and luxury-led services." },
  { title: "Gold Certified Living", body: "Sustainability with EV charging and eco-conscious features." },
  { title: "Prime Connectivity", body: "A seamless gateway to every corner of the city." },
] as const; // Source: brochure "Signature Hallmarks" — VERIFIED

export type Residence = {
  id: string;
  collection: string;
  type: "3 BHK" | "4 BHK";
  variant?: string;
  wings: string;
  plan: string;
  areas: { label: string; sqm: number; sqft: number }[];
  note?: string;
};

/** Areas transcribed from the official brochure floor-plan tables. VERIFIED (brochure). */
export const residences: Residence[] = [
  {
    id: "gp-3bhk-2575",
    collection: "Gold / Platinum Palace",
    type: "3 BHK",
    wings: "28, 31, 32 & 35",
    plan: "/images/plans/gold-platinum-3bhk-a.webp",
    areas: [
      { label: "Super area", sqm: 239.22, sqft: 2575 },
      { label: "Built-up area", sqm: 171.61, sqft: 1847.21 },
      { label: "Carpet area", sqm: 124.99, sqft: 1345.39 },
      { label: "Balcony area", sqm: 38.43, sqft: 413.66 },
    ],
  },
  {
    id: "gp-3bhk-2500",
    collection: "Gold / Platinum Palace",
    type: "3 BHK",
    wings: "29, 30, 33 & 34",
    plan: "/images/plans/gold-platinum-3bhk-b.webp",
    areas: [
      { label: "Super area", sqm: 232.25, sqft: 2500 },
      { label: "Built-up area", sqm: 166.08, sqft: 1787.68 },
      { label: "Carpet area", sqm: 122.04, sqft: 1313.63 },
      { label: "Balcony area", sqm: 37.02, sqft: 398.48 },
    ],
  },
  {
    id: "diamond-4bhk-3000",
    collection: "Diamond Palace",
    type: "4 BHK",
    variant: "Type I",
    wings: "11 & 15",
    plan: "/images/plans/diamond-4bhk-a.webp",
    areas: [
      { label: "Super area", sqm: 278.7, sqft: 3000 },
      { label: "Built-up area", sqm: 216.84, sqft: 2334.06 },
      { label: "Carpet area", sqm: 156.63, sqft: 1685.96 },
      { label: "Balcony area", sqm: 50.55, sqft: 544.12 },
    ],
  },
  {
    id: "diamond-4bhk-2970",
    collection: "Diamond Palace",
    type: "4 BHK",
    variant: "Type I",
    wings: "12 & 14",
    plan: "/images/plans/diamond-4bhk-b.webp",
    areas: [
      { label: "Super area", sqm: 275.92, sqft: 2970 },
      { label: "Built-up area", sqm: 214.1, sqft: 2304.57 },
      { label: "Carpet area", sqm: 155.9, sqft: 1678.1 },
      { label: "Balcony area", sqm: 49.61, sqft: 534.1 },
    ],
  },
  {
    id: "sg-4bhk-3720",
    collection: "Sapphire / Garnet Palace",
    type: "4 BHK",
    variant: "Type II",
    wings: "20, 23, 24 & 27",
    plan: "/images/plans/sapphire-garnet-4bhk-a.webp",
    areas: [
      { label: "Super area", sqm: 345.59, sqft: 3720 },
      { label: "Built-up area", sqm: 273.91, sqft: 2948.36 },
      { label: "Carpet area", sqm: 204.54, sqft: 2201.66 },
      { label: "Balcony area", sqm: 60.93, sqft: 655.85 },
    ],
  },
  {
    id: "sg-4bhk-3550",
    collection: "Sapphire / Garnet Palace",
    type: "4 BHK",
    variant: "Type II",
    wings: "21, 22, 25 & 26",
    plan: "/images/plans/sapphire-garnet-4bhk-b.webp",
    areas: [
      { label: "Super area", sqm: 329.8, sqft: 3550 },
      { label: "Built-up area", sqm: 260.39, sqft: 2802.83 },
      { label: "Carpet area", sqm: 200.66, sqft: 2159.9 },
    ],
    note: "Balcony area omitted: the brochure table shows inconsistent values for this unit (pending developer clarification).",
  },
  {
    id: "iconic-unit-1",
    collection: "Iconic Tower",
    type: "4 BHK",
    variant: "Unit 1",
    wings: "16 & 19",
    plan: "/images/plans/iconic-unit-1.webp",
    areas: [
      { label: "Super area", sqm: 443.6, sqft: 4775 },
      { label: "Built-up area", sqm: 336.43, sqft: 3621 },
      { label: "Carpet area", sqm: 232.25, sqft: 2500 },
      { label: "Balcony area", sqm: 91.54, sqft: 985 },
    ],
  },
  {
    id: "iconic-unit-2",
    collection: "Iconic Tower",
    type: "4 BHK",
    variant: "Unit 2",
    wings: "17 & 18",
    plan: "/images/plans/iconic-unit-2.webp",
    areas: [
      { label: "Super area", sqm: 431.99, sqft: 4650 },
      { label: "Built-up area", sqm: 326.09, sqft: 3510 },
      { label: "Carpet area", sqm: 231.39, sqft: 2490 },
      { label: "Balcony area", sqm: 84.95, sqft: 915 },
    ],
  },
];

export const masterPlan = "/images/plans/masterplan.webp";

/** Amenity groups exactly as listed in the official brochure. VERIFIED. */
export const amenityRealms = [
  {
    id: "landscape",
    title: "Landscape",
    eyebrow: "Realm I",
    intro: "Resort-style landscapes, composed around a dense forest trail and a celebration lawn.",
    items: ["Dense Forest Trail", "Celebration Lawn", "Swimming Pool with Deck", "Relaxing Cabana", "Kids Pool & Play Area", "Relaxing Pavilion"],
    image: "/images/amenities/forest-trail.webp",
  },
  {
    id: "clubhouse",
    title: "Clubhouse",
    eyebrow: "Realm II",
    intro: "Two exclusive clubhouses for wellness, sport and quiet indulgence.",
    items: ["Grand Arrival Lobby", "Rejuvenating Spa", "All-Weather Swimming Pool", "State-of-the-Art Gym", "Sports Arena", "Gaming Zone", "Squash Court"],
    image: "/images/amenities/arrival-lobby.webp",
  },
  {
    id: "iconic",
    title: "Iconic Tower",
    eyebrow: "Realm III",
    intro: "A confluence of privileges — on the terrace and at ground level.",
    items: ["Infinity Swimming Pool", "Recreational Lounge & Sit-out Area", "Barbeque Area", "Waiting Lounge", "Cigar Lounge", "Mini Theatre", "Café & Dining"],
    image: "/images/amenities/infinity-pool.webp",
  },
] as const;

export const signatureAmenities = [
  { title: "Dense Forest Trail", image: "/images/amenities/forest-trail.webp", body: "A shaded walk through layered planting — the quiet heart of the landscape." },
  { title: "All-Weather Swimming Pool", image: "/images/amenities/pool-deck.webp", body: "Swim through every season, with a deck made for long afternoons." },
  { title: "Grand Arrival Lobby", image: "/images/amenities/arrival-lobby.webp", body: "An arrival that sets the tone: double-height volume and crafted detail." },
  { title: "Two Exclusive Clubhouses", image: "/images/amenities/iconic-club.webp", body: "Spa, gym, squash and a sports arena, held within two private clubs." },
  { title: "Infinity Swimming Pool", image: "/images/amenities/infinity-pool.webp", body: "A terrace pool for the Iconic Tower, set against the Noida skyline." },
  { title: "Mini Theatre", image: "/images/amenities/mini-theatre.webp", body: "A private screening room, one of the Iconic Tower's ground-level privileges." },
] as const;

export type GalleryItem = { src: string; alt: string; w: number; h: number; category: "Architecture" | "Landscape" | "Clubhouse" | "Interiors" };

export const gallery: GalleryItem[] = [
  { src: "/images/amenities/towers-dusk.webp", alt: "ACE Mahagun Medalleo towers at dusk — architectural render", w: 1800, h: 1012, category: "Architecture" },
  { src: "/images/gallery/drop-off.webp", alt: "Drop-off and arrival court — architectural render", w: 1400, h: 788, category: "Architecture" },
  { src: "/images/amenities/forest-trail.webp", alt: "Dense forest trail — landscape render", w: 1290, h: 1636, category: "Landscape" },
  { src: "/images/amenities/infinity-pool.webp", alt: "Iconic Tower terrace infinity pool — render", w: 1800, h: 1012, category: "Clubhouse" },
  { src: "/images/interiors/living-room.webp", alt: "Sample apartment living room — representative interior", w: 1700, h: 1134, category: "Interiors" },
  { src: "/images/gallery/pool-front.webp", alt: "Pool front view — render", w: 1400, h: 788, category: "Landscape" },
  { src: "/images/amenities/cabana.webp", alt: "Relaxing cabana by the water — landscape render", w: 1717, h: 1551, category: "Landscape" },
  { src: "/images/interiors/master-bedroom.webp", alt: "Sample apartment bedroom — representative interior", w: 1800, h: 1199, category: "Interiors" },
  { src: "/images/amenities/arrival-lobby.webp", alt: "Grand arrival club lobby — render", w: 1748, h: 1683, category: "Clubhouse" },
  { src: "/images/gallery/bamboo-forest.webp", alt: "Bamboo forest walk — landscape render", w: 1400, h: 788, category: "Landscape" },
  { src: "/images/interiors/kitchen.webp", alt: "Sample apartment kitchen — representative interior", w: 1551, h: 1034, category: "Interiors" },
  { src: "/images/amenities/celebration-lawn.webp", alt: "Celebration lawn — landscape render", w: 1794, h: 1009, category: "Landscape" },
  { src: "/images/amenities/pavilion.webp", alt: "Relaxing pavilion — landscape render", w: 1643, h: 1364, category: "Landscape" },
  { src: "/images/amenities/gym.webp", alt: "State-of-the-art gymnasium — render", w: 1760, h: 1203, category: "Clubhouse" },
  { src: "/images/interiors/living-foyer.webp", alt: "Living room foyer — representative interior", w: 1548, h: 1032, category: "Interiors" },
  { src: "/images/gallery/terrace-seating.webp", alt: "Terrace seating — render", w: 1400, h: 788, category: "Clubhouse" },
  { src: "/images/amenities/cafe-dining.webp", alt: "Café and dining — render", w: 1589, h: 1192, category: "Clubhouse" },
  { src: "/images/amenities/kids-pool-play.webp", alt: "Kids pool and play area — render", w: 1800, h: 1013, category: "Landscape" },
  { src: "/images/interiors/balcony.webp", alt: "Balcony with green outlook — representative interior", w: 1800, h: 1199, category: "Interiors" },
  { src: "/images/amenities/mini-theatre.webp", alt: "Mini theatre — render", w: 1761, h: 1321, category: "Clubhouse" },
];

/** Distances from the official brochure location map (approximate, "Map not to scale"). VERIFIED (brochure). */
export const connectivity = [
  {
    group: "Roads & Expressways",
    items: [
      { name: "Noida–Greater Noida Expressway", value: "3 km · 8 min" },
      { name: "FNG Expressway", value: "9 km · 10 min" },
      { name: "DND Flyover", value: "11 km · 15 min" },
      { name: "Yamuna Expressway", value: "20 km · 30 min" },
    ],
  },
  {
    group: "Metro",
    items: [
      { name: "Sector 76 Metro (Aqua Line)", value: "3.1 km · 6 min" },
      { name: "Sector 101 Metro (Aqua Line)", value: "3.4 km · 7 min" },
      { name: "Sector 52 Metro (Blue Line)", value: "5.1 km · 10 min" },
    ],
  },
  {
    group: "Schools & Universities",
    items: [
      { name: "Pathways School", value: "1.6 km · 6 min" },
      { name: "Lotus Valley School", value: "4.7 km · 12 min" },
      { name: "Step By Step School", value: "5.8 km · 15 min" },
      { name: "Amity University", value: "6 km · 14 min" },
      { name: "Shiv Nadar School", value: "9.4 km · 21 min" },
    ],
  },
  {
    group: "Healthcare",
    items: [
      { name: "Yatharth Super Speciality Hospital", value: "~9 min" },
      { name: "Max Hospital", value: "6.6 km · 16 min" },
      { name: "Kailash Hospital", value: "7.4 km · 16 min" },
      { name: "Apollo Hospital", value: "8.3 km · 20 min" },
      { name: "Fortis Hospital", value: "8.4 km · 17 min" },
    ],
  },
  {
    group: "Retail, Leisure & Business",
    items: [
      { name: "Starling Mall", value: "~5 min" },
      { name: "Infosys (IT corridor)", value: "~15 min" },
      { name: "Sandal Suites, Sector 135", value: "7.2 km · 15 min" },
      { name: "Radisson Blu MBD, Sector 18", value: "8.5 km · 20 min" },
      { name: "DLF Mall of India", value: "8.7 km · 16 min" },
    ],
  },
  {
    group: "Airports",
    items: [
      { name: "IGI Airport", value: "34 km · 1 h 8 min" },
      { name: "Noida International Airport", value: "60 km · 1 h" },
    ],
  },
] as const;

export const faqs = [
  {
    q: "Where is ACE Mahagun Medalleo located?",
    a: "ACE Mahagun Medalleo is located at Plot No. GH-01/A (Alpha), Sector 107, Noida, Uttar Pradesh. The developer's brochure places it about 3 km (8 min) from the Noida–Greater Noida Expressway and about 3.1–3.4 km from the Sector 76 and Sector 101 Aqua Line metro stations.",
  },
  {
    q: "Which configurations are available?",
    a: "The project offers 3 BHK and 4 BHK residences. The official brochure lists 3 BHK homes in the Gold / Platinum Palace (2,500 and 2,575 sq ft super area), 4 BHK homes in the Diamond Palace and Sapphire / Garnet Palace (2,970 to 3,720 sq ft super area), and 4 BHK Iconic Tower residences (4,650 and 4,775 sq ft super area). Current availability is shared on enquiry.",
  },
  {
    q: "What is the project's RERA registration number?",
    a: "The UP RERA registration number is UPRERAPRJ125561. You can verify project details on the UP RERA website at www.up-rera.in/projects.",
  },
  {
    q: "What amenities are available?",
    a: "Amenities listed by the developer include a dense forest trail, celebration lawn, swimming pool with deck, cabana and pavilion, kids pool and play area, two exclusive clubhouses with a grand arrival lobby, spa, all-weather swimming pool, gym, sports arena, gaming zone and squash court, plus Iconic Tower privileges such as a terrace infinity pool, cigar lounge, mini theatre and café.",
  },
  {
    q: "How can I request floor plans?",
    a: "Floor plans for every residence type are shown in the Residences section above. For a detailed plan pack and current pricing, submit the enquiry form and choose 'Brochure' or 'Price Details' — our property advisor will share them with you.",
  },
  {
    q: "How can I schedule a site visit?",
    a: "Choose 'Schedule Site Visit' in the enquiry form with your preferred contact time, and our advisor will call to confirm a convenient slot.",
  },
] as const;

export const disclaimer =
  "ACE is the Development Manager responsible for overseeing the planning, coordination and execution of the project. All information, images, specifications, amenities and floor plans shown on this website are representational and illustrative, are based on the developer's published material, and do not constitute a legal offering. The project on completion may differ from the artistic impressions shown. Areas are as published by the developer and are subject to change; 1 sq m = 10.764 sq ft. Distances are approximate. The project land is allotted by the New Okhla Industrial Development Authority to Mahagun Infratech Private Limited at Plot No. GH-01/A (Alpha), Sector 107, Noida vide lease deed dated 08.10.2021. Project launch date: 23.11.2022. Building plan approved vide permit no. 2022/01/31/6228 dated 09.09.2022. Please verify all project details on the UP RERA website (www.up-rera.in/projects) before making any decision.";

/**
 * Official walkthrough film — the same YouTube video ACE embeds on
 * acegroupindia.com/ace-mahagun-medalleo-walkthrough.php and acemedalleomahagun.com
 * (checked 16 Nov 2026). VERIFIED as ACE's own embed; written permission to
 * re-embed on this advertiser site is still PENDING.
 */
export const walkthrough = {
  youtubeId: "6ATAQnA3edY",
  title: "ACE Mahagun Medalleo — official walkthrough",
  source: "https://acegroupindia.com/ace-mahagun-medalleo-walkthrough.php",
  poster: "/images/amenities/towers-dusk.webp",
  status: "VERIFIED" as Status,
} as const;

/**
 * 360° photo tours (equirectangular, 2:1 JPG/WebP in /public/tours).
 * EMPTY until real site / sample-flat 360° photos are supplied with permission.
 * With no real tours, the 360° viewer is hidden in production and shows a
 * labelled test pattern on previews only.
 */
export type Tour360 = { id: string; title: string; src: string; note?: string };
export const tours360: Tour360[] = [];

export const tour360TestPattern: Tour360 = {
  id: "test-pattern",
  title: "Test pattern",
  src: "/tours/test-pattern.webp",
  note: "Preview only — not a project photo. Replace with real 360° captures.",
};
