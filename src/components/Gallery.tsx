"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";
import { gallery } from "@/content/project";

const cats = ["All", "Architecture", "Landscape", "Clubhouse", "Interiors"] as const;

export default function Gallery() {
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const [idx, setIdx] = useState<number | null>(null);
  const [all, setAll] = useState(false);
  const LIMIT = 10;
  const items = cat === "All" ? gallery : gallery.filter((g) => g.category === cat);
  const lbItems = items.map((g) => ({ src: g.src, alt: g.alt, caption: `${g.alt} · Artistic impression` }));

  return (
    <section id="gallery" aria-labelledby="gal-title" className="bg-ivory py-24 sm:py-36">
      <div className="container-lux">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow flex items-center gap-4 text-gold"><span className="font-serif text-base italic normal-case tracking-normal">04</span> Gallery</p>
            <h2 id="gal-title" className="display mt-6 text-[clamp(2.4rem,5vw,4.6rem)]">For those who live <em className="text-forest">beyond the ordinary.</em></h2>
          </div>
          <div role="tablist" aria-label="Filter gallery" className="flex flex-wrap gap-x-6 gap-y-2">
            {cats.map((c) => (
              <button key={c} role="tab" aria-selected={c === cat} onClick={() => setCat(c)}
                className={`eyebrow border-b pb-2 transition-colors ${c === cat ? "border-gold text-charcoal" : "border-transparent text-charcoal/45 hover:text-charcoal"}`}>{c}</button>
            ))}
          </div>
        </Reveal>

        {/* Lead image */}
        {cat === "All" && (
          <Reveal className="mt-14">
            <button className="group relative block w-full overflow-hidden" onClick={() => setIdx(0)} aria-label={`Open image: ${items[0].alt}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={items[0].src} alt={items[0].alt} loading="lazy" className="aspect-[21/9] w-full object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.03]" />
            </button>
          </Reveal>
        )}

        <motion.ul layout className="mt-3 columns-2 gap-3 sm:mt-4 sm:gap-4 lg:columns-3" data-testid="gallery-grid">
          {items.map((g, i) => (cat === "All" && i === 0) || (!all && i >= LIMIT) ? null : ((
            <motion.li layout key={g.src} className="mb-3 break-inside-avoid sm:mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <button className="group relative block w-full overflow-hidden" onClick={() => setIdx(i)} aria-label={`Open image: ${g.alt}`} data-testid="gallery-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} width={g.w} height={g.h} loading="lazy" decoding="async"
                  className="h-auto w-full transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]" />
                <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="text-left">
                    <span className="eyebrow block text-gold">{g.category}</span>
                    <span className="mt-1 block font-serif text-lg text-ivory">{g.alt.split(" — ")[0]}</span>
                  </span>
                </span>
              </button>
            </motion.li>
          )))}
        </motion.ul>
        {items.length > LIMIT && (
          <div className="mt-8 flex justify-center">
            <button onClick={() => setAll((a) => !a)} className="btn btn-ghost-dark" data-testid="gallery-toggle" aria-expanded={all}>
              {all ? "Show fewer" : `View all ${items.length} images`}
            </button>
          </div>
        )}
        <p className="mt-6 text-[11px] text-charcoal/45">All images are artistic impressions and representative interiors from the developer&apos;s published material.</p>
      </div>
      <Lightbox items={lbItems} index={idx} onIndex={setIdx} onClose={() => setIdx(null)} testId="gallery-lightbox" />
    </section>
  );
}
