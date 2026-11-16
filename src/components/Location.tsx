"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import Reveal from "./Reveal";
import Lightbox from "./Lightbox";
import { connectivity, project } from "@/content/project";

export default function Location() {
  const [group, setGroup] = useState(0);
  const [mapOn, setMapOn] = useState(false);
  const [lb, setLb] = useState<number | null>(null);
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(project.location.mapQuery)}&z=14&output=embed`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.location.mapQuery)}`;

  return (
    <section id="location" aria-labelledby="loc-title" className="bg-ivory py-24 sm:py-36">
      <div className="container-lux">
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4 text-bronze"><span className="font-serif text-base italic normal-case tracking-normal">05</span> Location &amp; Connectivity</p>
            <h2 id="loc-title" className="display mt-6 text-[clamp(2.4rem,5vw,4.6rem)]">Connected to Everything <em className="text-forest">That Matters.</em></h2>
          </div>
          <div className="text-[15px] leading-[1.85] text-charcoal/70 lg:col-span-4 lg:col-start-9 lg:self-end">
            <p>Centrally placed in Sector 107 with roads on two sides of the plot, the address sits minutes from the Noida–Greater Noida Expressway, the Aqua Line metro and the city&apos;s schools, hospitals and business districts.</p>
            <p className="mt-4 flex items-start gap-2 text-sm text-charcoal/80"><MapPin className="mt-1 size-4 shrink-0 text-gold" aria-hidden /> {project.location.plot}</p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          {/* Distances */}
          <div className="lg:col-span-5">
            <div role="tablist" aria-label="Nearby categories" className="flex flex-wrap gap-2">
              {connectivity.map((g, i) => (
                <button key={g.group} role="tab" aria-selected={i === group} onClick={() => setGroup(i)}
                  className={`border px-3.5 py-2 text-xs transition-colors ${i === group ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/20 text-charcoal/70 hover:border-charcoal"}`}>{g.group}</button>
              ))}
            </div>
            <div role="tabpanel">
<ul className="mt-8" data-testid="distance-list">
              {connectivity[group].items.map((it) => (
                <li key={it.name} className="flex items-baseline justify-between gap-6 border-b border-charcoal/10 py-4">
                  <span className="text-[15px]">{it.name}</span>
                  <span className="shrink-0 font-serif text-xl tabular-nums text-forest">{it.value}</span>
                </li>
              ))}
            </ul>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-charcoal/70">Approximate distances and drive times as published in the developer&apos;s official brochure; actual times vary with traffic.</p>
          </div>

          {/* Maps */}
          <div className="grid gap-4 lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden bg-stone" data-testid="map-container">
              {mapOn ? (
                <iframe title="Map — ACE Mahagun Medalleo, Sector 107, Noida" src={embed} className="absolute inset-0 h-full w-full border-0 grayscale-[0.4]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
              ) : (
                <>
                  <button onClick={() => setLb(0)} className="absolute inset-0" aria-label="Enlarge connectivity map">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/location-map.webp" alt="Connectivity map from the official brochure" loading="lazy" className="h-full w-full object-cover object-[60%_center]" />
                  </button>
                  <button onClick={() => setMapOn(true)} data-testid="load-map"
                    className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory transition hover:bg-gold hover:text-ink">
                    <MapPin className="size-4" /> Load interactive map
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-xs text-charcoal/70">Interactive map loads Google Maps (third-party) on request.</span>
              <a href={directions} target="_blank" rel="noopener" className="link-underline eyebrow text-charcoal">Get directions ↗</a>
            </div>
          </div>
        </div>
      </div>
      <Lightbox items={[{ src: "/images/location-map.webp", alt: "Connectivity map — ACE Mahagun Medalleo, Sector 107 Noida", caption: "Connectivity map from the official brochure · not to scale" }]}
        index={lb} onIndex={setLb} onClose={() => setLb(null)} zoomable testId="map-lightbox" />
    </section>
  );
}
