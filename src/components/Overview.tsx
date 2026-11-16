import Reveal, { ParallaxImage } from "./Reveal";
import { DecoMark } from "./icons";
import { hallmarks, project } from "@/content/project";

export function Overview() {
  return (
    <section id="overview" className="relative bg-ivory py-24 sm:py-36" aria-labelledby="overview-title">
      <div className="container-lux grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5 lg:pt-10">
          <Reveal>
            <p className="eyebrow flex items-center gap-4 text-bronze"><span className="font-serif text-base italic tracking-normal normal-case">01</span> The Residence</p>
            <h2 id="overview-title" className="display mt-6 text-[clamp(2.4rem,5vw,4.6rem)]">
              More Than a Residence. <em className="text-forest">A Distinctive Way of Living.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 space-y-5 text-[15px] leading-[1.85] text-charcoal/75">
              <p>
                Set across approximately ten acres in Sector 107, ACE Mahagun Medalleo is envisioned as an ultra-luxury, low-density
                community — an Art Deco address shaped with Hafeez Contractor and global design experts.
              </p>
              <p>
                Residences are planned around space, natural light and ventilation. Around them unfold resort-style landscapes —
                a dense forest trail, a celebration lawn, pools and pavilions — and two exclusive clubhouses dedicated to wellness,
                sport and quiet indulgence.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.25}>
            <a href="#residences" className="eyebrow link-underline mt-10 inline-block pb-1 text-charcoal">Discover the residences →</a>
          </Reveal>
        </div>

        <div className="relative lg:col-span-7">
          <Reveal y={40}>
            <ParallaxImage src="/images/amenities/towers-dusk.webp" alt="ACE Mahagun Medalleo towers at dusk — architectural render" className="aspect-[4/5] sm:aspect-[5/4]" labelCorner="tl" />
          </Reveal>
          <Reveal delay={0.2} className="relative -mt-24 ml-auto w-[62%] border-[10px] border-ivory sm:-mt-36 sm:w-[48%]">
            <ParallaxImage src="/images/amenities/pool-arches.webp" alt="Arched colonnade and pool — clubhouse render" className="aspect-[4/3]" strength={4} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function AtAGlance() {
  const facts = [
    { k: "Location", v: project.location.display, sub: "Plot GH-01/A (Alpha)" },
    { k: "Land Area", v: project.landArea.display, sub: "Low-density community" },
    { k: "Residences", v: project.configurations.display, sub: "Incl. Iconic Tower homes" },
    { k: "UP RERA", v: project.rera.number, sub: "up-rera.in/projects", mono: true },
  ];
  return (
    <section aria-labelledby="glance-title" className="relative overflow-hidden bg-charcoal py-20 text-ivory sm:py-28">
      <div className="container-lux">
        <Reveal className="flex flex-col items-center text-center">
          <DecoMark className="h-6 w-12 text-gold" />
          <h2 id="glance-title" className="eyebrow mt-5 text-ivory/60">Project at a Glance</h2>
        </Reveal>
        <dl className="mt-14 grid grid-cols-1 border-y border-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={f.k} delay={i * 0.08} className={`px-2 py-10 sm:px-8 ${i > 0 ? "border-t border-ivory/10 sm:border-t-0" : ""} ${i % 2 === 1 ? "sm:border-l sm:border-ivory/10" : ""} ${i > 1 ? "sm:border-t lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-ivory/10" : ""}`}>
              <dt className="eyebrow text-gold">{f.k}</dt>
              <dd className={`mt-4 ${f.mono ? "font-sans text-xl font-medium tracking-wide sm:text-[1.35rem]" : "font-serif text-3xl font-light"}`}>{f.v}</dd>
              <dd className="mt-2 text-xs text-ivory/65">{f.sub}</dd>
            </Reveal>
          ))}
        </dl>
        <div className="mt-10 grid gap-6 text-center text-xs text-ivory/65 sm:grid-cols-2">
          <p>Architecture · <span className="text-ivory/80">{project.architect.display}</span></p>
          <p>Sustainability · <span className="text-ivory/80">{project.certification.display}</span></p>
        </div>
      </div>
    </section>
  );
}

export function Hallmarks() {
  return (
    <section aria-labelledby="hallmarks-title" className="bg-ivory py-24 sm:py-32">
      <div className="container-lux">
        <Reveal className="grid gap-6 lg:grid-cols-12">
          <h2 id="hallmarks-title" className="display text-[clamp(2.2rem,4.2vw,3.8rem)] lg:col-span-6">
            Signature hallmarks <em className="text-forest">for sublime living.</em>
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-charcoal/65 lg:col-span-5 lg:col-start-8 lg:self-end">
            Eight defining ideas, as set out by the developer — from full-floor residences in the Iconic Tower to hospitality-led services.
          </p>
        </Reveal>
        <ol className="mt-16 grid grid-cols-2 border-t border-charcoal/15 lg:grid-cols-4">
          {hallmarks.map((h, i) => (
            <Reveal as="li" key={h.title} delay={(i % 4) * 0.07}
              className="group relative border-b border-charcoal/15 py-8 pr-4 sm:py-10 sm:pr-10 lg:border-r lg:px-8 lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(4n+1)]:pl-0">
              <span className="font-serif text-sm italic text-bronze">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 font-serif text-xl leading-tight sm:text-2xl transition-colors duration-500 group-hover:text-forest">{h.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">{h.body}</p>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-700 group-hover:w-full" />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
