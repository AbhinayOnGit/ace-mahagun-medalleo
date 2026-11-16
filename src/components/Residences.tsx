"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Maximize2 } from "lucide-react";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";
import { EnquireButton } from "./EnquiryProvider";
import { masterPlan, residences } from "@/content/project";

const interiors = [
  { src: "/images/interiors/living-room.webp", label: "Living" },
  { src: "/images/interiors/dining.webp", label: "Dining" },
  { src: "/images/interiors/master-bedroom.webp", label: "Bedroom" },
  { src: "/images/interiors/kitchen.webp", label: "Kitchen" },
  { src: "/images/interiors/balcony.webp", label: "Balcony & light" },
  { src: "/images/interiors/grand-entrance.webp", label: "Entrance" },
];

const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

export default function Residences() {
  const collections = useMemo(() => Array.from(new Set(residences.map((r) => r.collection))), []);
  const [col, setCol] = useState(collections[0]);
  const units = residences.filter((r) => r.collection === col);
  const [unitId, setUnitId] = useState(units[0].id);
  const unit = residences.find((r) => r.id === unitId) ?? units[0];
  const [lb, setLb] = useState<number | null>(null);
  const [unitArea, setUnitArea] = useState<"sqft" | "sqm">("sqft");

  const planItems = [
    ...residences.map((r) => ({ src: r.plan, alt: `${r.collection} ${r.type}${r.variant ? ` ${r.variant}` : ""} floor plan — wings ${r.wings}`, caption: `${r.collection} · ${r.type}${r.variant ? ` · ${r.variant}` : ""} · Wings ${r.wings} · Super area ${fmt(r.areas[0].sqft)} sq ft` })),
    { src: masterPlan, alt: "Tower and unit master plan", caption: "Tower & unit plan — artistic impression, not to scale" },
  ];

  const selectCollection = (c: string) => {
    setCol(c);
    setUnitId(residences.find((r) => r.collection === c)!.id);
  };

  return (
    <section id="residences" aria-labelledby="res-title" className="bg-stone/40 py-24 sm:py-36">
      <div className="container-lux">
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4 text-gold"><span className="font-serif text-base italic normal-case tracking-normal">02</span> Architecture &amp; Residences</p>
            <h2 id="res-title" className="display mt-6 text-[clamp(2.4rem,5vw,4.6rem)]">
              The grandeur of space. <em className="text-forest">The elegance of design.</em>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-[1.85] text-charcoal/70 lg:col-span-4 lg:col-start-9 lg:self-end">
            Neo-classical Art Deco façades give way to homes planned for generous proportion, cross-ventilation and natural light —
            from 3 BHK palace residences to full-floor homes in the Iconic Tower.
          </p>
        </Reveal>

        {/* Interiors film-strip */}
        <Reveal className="mt-16">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]" tabIndex={0} aria-label="Representative interiors (scrollable)">
            {interiors.map((im, i) => (
              <figure key={im.src} className={`group relative shrink-0 snap-start ${i % 3 === 0 ? "w-[82vw] sm:w-[52vw] lg:w-[40vw]" : "w-[64vw] sm:w-[34vw] lg:w-[24vw]"}`}>
                <div className="h-[52vh] max-h-[560px] min-h-[340px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.src} alt={`${im.label} — representative interior, ACE Mahagun Medalleo`} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105" />
                </div>
                <figcaption className="mt-3 flex items-baseline justify-between">
                  <span className="font-serif text-xl">{im.label}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal/40">Representative</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>

        {/* Collection summary */}
        <Reveal className="mt-20">
          <dl className="grid grid-cols-2 border-y border-charcoal/15 lg:grid-cols-4">
            {collections.map((c, i) => {
              const rs = residences.filter((r) => r.collection === c);
              const s = rs.map((r) => r.areas[0].sqft);
              const lo = Math.min(...s), hi = Math.max(...s);
              return (
                <button key={c} onClick={() => { selectCollection(c); document.getElementById("floor-plans")?.scrollIntoView({ behavior: "smooth" }); }}
                  className={`group px-1 py-8 text-left transition-colors hover:bg-ivory/60 sm:px-6 ${i % 2 ? "border-l border-charcoal/15 pl-4" : ""} ${i > 1 ? "border-t border-charcoal/15 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-6" : ""}`}>
                  <dt className="eyebrow text-gold">{Array.from(new Set(rs.map((r) => r.type))).join(" / ")}</dt>
                  <dd className="mt-3 font-serif text-2xl leading-tight sm:text-[1.7rem]">{c}</dd>
                  <dd className="mt-2 text-xs text-charcoal/55 tabular-nums">{fmt(lo)}{hi !== lo ? `–${fmt(hi)}` : ""} sq ft super area</dd>
                  <dd className="eyebrow mt-4 text-[10px] text-charcoal/40 transition-colors group-hover:text-charcoal">View plans →</dd>
                </button>
              );
            })}
          </dl>
        </Reveal>

        {/* Floor plan viewer */}
        <div className="mt-20 pt-4" id="floor-plans">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-gold">Floor Plan Viewer</p>
              <h3 className="mt-4 font-serif text-4xl sm:text-5xl">Choose your residence</h3>
            </div>
            <div role="tablist" aria-label="Residence collections" className="flex flex-wrap gap-x-6 gap-y-2">
              {collections.map((c) => (
                <button key={c} role="tab" aria-selected={c === col} onClick={() => selectCollection(c)} data-testid={`tab-${c}`}
                  className={`eyebrow border-b pb-2 transition-colors ${c === col ? "border-gold text-charcoal" : "border-transparent text-charcoal/45 hover:text-charcoal"}`}>
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Unit type">
                {units.map((u) => (
                  <button key={u.id} role="radio" aria-checked={u.id === unit.id} onClick={() => setUnitId(u.id)}
                    className={`border px-4 py-3 text-left text-sm transition-colors ${u.id === unit.id ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/20 hover:border-charcoal"}`}>
                    <span className="block font-medium">{u.type}{u.variant ? ` · ${u.variant}` : ""}</span>
                    <span className="block text-xs opacity-60">{fmt(u.areas[0].sqft)} sq ft super</span>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={unit.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="mt-8">
                  <p className="font-serif text-3xl">{unit.collection}</p>
                  <p className="mt-1 text-sm text-charcoal/60">{unit.type}{unit.variant ? ` · ${unit.variant}` : ""} · Wings {unit.wings}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="eyebrow text-charcoal/50">Areas</span>
                    <div className="flex text-[11px]" role="group" aria-label="Units">
                      {(["sqft", "sqm"] as const).map((u) => (
                        <button key={u} onClick={() => setUnitArea(u)} aria-pressed={unitArea === u} className={`px-2 py-1 ${unitArea === u ? "text-charcoal underline underline-offset-4" : "text-charcoal/40"}`}>{u === "sqft" ? "sq ft" : "sq m"}</button>
                      ))}
                    </div>
                  </div>
                  <table className="mt-3 w-full text-sm" data-testid="area-table">
                    <tbody>
                      {unit.areas.map((a) => (
                        <tr key={a.label} className="border-b border-charcoal/10">
                          <th scope="row" className="py-3 text-left font-normal text-charcoal/65">{a.label}</th>
                          <td className="py-3 text-right font-serif text-xl tabular-nums">{fmt(unitArea === "sqft" ? a.sqft : a.sqm)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {unit.note && <p className="mt-3 text-xs text-charcoal/50">{unit.note}</p>}
                  <p className="mt-4 text-[11px] leading-relaxed text-charcoal/45">Areas as published in the developer&apos;s official brochure. Pricing and availability shared on request.</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <EnquireButton kind="Price Details" source="floor-plan" className="btn btn-dark">Request Price Details</EnquireButton>
                    <EnquireButton kind="Brochure" source="floor-plan" className="btn btn-ghost-dark">Download Brochure</EnquireButton>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-8">
              <button
                onClick={() => setLb(residences.findIndex((r) => r.id === unit.id))}
                className="group relative block w-full overflow-hidden bg-[#1c1c1c]"
                aria-label={`Enlarge floor plan: ${unit.collection} ${unit.type}`}
                data-testid="floorplan-open"
              >
                <AnimatePresence mode="wait">
                  { }
                  <motion.img key={unit.plan} src={unit.plan} alt={`${unit.collection} ${unit.type} floor plan`} loading="lazy"
                    className="aspect-[2516/1790] w-full object-contain"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} />
                </AnimatePresence>
                <span className="absolute right-4 top-4 inline-flex items-center gap-2 bg-ivory/90 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-charcoal opacity-90 transition group-hover:bg-gold">
                  <Maximize2 className="size-3.5" /> Enlarge
                </span>
              </button>
              <div className="mt-3 flex items-center justify-between text-[11px] text-charcoal/45">
                <span>Floor plan from the official brochure · not to scale</span>
                <button className="link-underline uppercase tracking-[0.2em] text-charcoal" onClick={() => setLb(planItems.length - 1)}>View master plan</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Lightbox items={planItems} index={lb} onIndex={setLb} onClose={() => setLb(null)} zoomable testId="plan-lightbox" />
    </section>
  );
}
