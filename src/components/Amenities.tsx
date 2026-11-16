"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "./Reveal";
import { amenityRealms, signatureAmenities } from "@/content/project";

export default function Amenities() {
  const [realm, setRealm] = useState(0);
  const r = amenityRealms[realm];
  const [feature, setFeature] = useState(0);

  return (
    <section id="amenities" aria-labelledby="amen-title" className="relative overflow-hidden bg-forest text-ivory">
      {/* Signature amenities — editorial hover list with sticky image */}
      <div className="container-lux py-24 sm:py-36">
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4 text-gold"><span className="font-serif text-base italic normal-case tracking-normal">03</span> Signature Amenities</p>
            <h2 id="amen-title" className="display mt-6 text-[clamp(2.4rem,5vw,4.6rem)]">
              A life curated across <em className="text-gold-soft">two realms of sophistication.</em>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-[1.85] text-ivory/70 lg:col-span-4 lg:col-start-9 lg:self-end">
            Landscape and clubhouse, sport and stillness — an ensemble of experiences composed for life&apos;s true joys.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <ul className="lg:col-span-5" aria-label="Signature amenities">
            {signatureAmenities.map((a, i) => (
              <li key={a.title} className="border-t border-ivory/15 last:border-b">
                <button
                  className="group flex w-full items-baseline gap-6 py-6 text-left"
                  onMouseEnter={() => setFeature(i)} onFocus={() => setFeature(i)} onClick={() => setFeature(i)}
                  aria-pressed={feature === i}
                >
                  <span className={`font-serif text-sm italic transition-colors ${feature === i ? "text-gold" : "text-ivory/40"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className={`block font-serif text-[1.9rem] leading-tight transition-colors duration-500 ${feature === i ? "text-ivory" : "text-ivory/55 group-hover:text-ivory/85"}`}>{a.title}</span>
                    <span className={`grid transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${feature === i ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <span className="overflow-hidden text-sm leading-relaxed text-ivory/65">{a.body}</span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="relative lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden lg:sticky lg:top-28">
              <AnimatePresence mode="popLayout">
                { }
                <motion.img key={signatureAmenities[feature].image} src={signatureAmenities[feature].image}
                  alt={`${signatureAmenities[feature].title} — artistic impression`} loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
              </AnimatePresence>
              <span className="absolute bottom-3 right-4 text-[10px] uppercase tracking-[0.2em] text-ivory/70">Artistic impression</span>
            </div>
          </div>
        </div>
      </div>

      {/* Three realms — complete amenity list */}
      <div className="bg-ink py-24 sm:py-32">
        <div className="container-lux">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <h3 className="font-serif text-4xl sm:text-5xl">The complete ensemble</h3>
            <div role="tablist" aria-label="Amenity realms" className="flex gap-6">
              {amenityRealms.map((x, i) => (
                <button key={x.id} role="tab" aria-selected={i === realm} onClick={() => setRealm(i)}
                  className={`eyebrow border-b pb-2 transition-colors ${i === realm ? "border-gold text-ivory" : "border-transparent text-ivory/45 hover:text-ivory"}`}>
                  {x.title}
                </button>
              ))}
            </div>
          </Reveal>
          <AnimatePresence mode="wait">
            <motion.div key={r.id} role="tabpanel" className="mt-12 grid gap-10 lg:grid-cols-12"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <div className="relative aspect-[16/10] overflow-hidden lg:col-span-7">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image} alt={`${r.title} amenities — artistic impression`} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="lg:col-span-5">
                <p className="eyebrow text-gold">{r.eyebrow}</p>
                <p className="mt-4 font-serif text-2xl leading-snug text-ivory/90">{r.intro}</p>
                <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2">
                  {r.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 border-b border-ivory/10 py-3.5 text-sm text-ivory/80">
                      <span className="size-1 rotate-45 bg-gold" aria-hidden /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
