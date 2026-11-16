import Reveal from "./Reveal";
import { EnquireButton } from "./EnquiryProvider";
import EnquiryForm from "./EnquiryForm";
import { DecoMark, WhatsAppIcon } from "./icons";
import { Wordmark } from "./Nav";
import { disclaimer, faqs, project } from "@/content/project";
import { siteConfig, telLink, whatsappLink, waMessages } from "@/lib/config";
import { Phone, Mail } from "lucide-react";

export function BrochureCta() {
  return (
    <section aria-labelledby="bro-title" className="relative overflow-hidden bg-charcoal text-ivory">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[380px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/plans/masterplan.webp" alt="Tower and unit master plan — official brochure" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <Reveal className="container-lux flex flex-col justify-center py-20 lg:px-20">
          <p className="eyebrow text-gold">The Definitive Blueprint</p>
          <h2 id="bro-title" className="display mt-5 text-[clamp(2.2rem,4vw,3.8rem)]">Floor plans, master plan &amp; the complete brochure.</h2>
          <p className="mt-6 max-w-md text-[15px] leading-[1.85] text-ivory/70">
            Receive the developer&apos;s brochure, a walkthrough of each residence type and current price details from our property advisor.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <EnquireButton kind="Brochure" source="brochure-cta" className="btn btn-gold" data-testid="cta-brochure">Download Brochure</EnquireButton>
            <a href="#floor-plans" className="btn btn-ghost-light">Explore Floor Plans</a>
            <EnquireButton kind="Price Details" source="brochure-cta" className="btn btn-ghost-light">Request Price Details</EnquireButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-stone/40 py-24 sm:py-32">
      <div className="container-lux grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow flex items-center gap-4 text-gold"><span className="font-serif text-base italic normal-case tracking-normal">06</span> About the Project</p>
          <h2 id="about-title" className="display mt-6 text-[clamp(2.2rem,4.4vw,4rem)]">Makers of <em className="text-forest">masterpieces.</em></h2>
        </Reveal>
        <Reveal delay={0.1} className="space-y-5 text-[15px] leading-[1.85] text-charcoal/75 lg:col-span-6 lg:col-start-7">
          <p>
            ACE Mahagun Medalleo is developed on land allotted by the New Okhla Industrial Development Authority to Mahagun Infratech
            Private Limited. ACE Group serves as Development Manager, responsible for overseeing the planning, coordination and
            execution of the project.
          </p>
          <p>
            ACE Group is a Noida-based developer with more than 15 years in residential and commercial real estate. The project&apos;s
            architecture is crafted by Hafeez Contractor together with global design experts.
          </p>
          <dl className="grid grid-cols-2 gap-6 border-t border-charcoal/15 pt-8 text-sm">
            <div><dt className="eyebrow text-charcoal/50">Development Manager</dt><dd className="mt-2 font-serif text-xl">ACE Group</dd></div>
            <div><dt className="eyebrow text-charcoal/50">Land Allottee</dt><dd className="mt-2 font-serif text-xl">Mahagun Infratech Pvt. Ltd.</dd></div>
            <div><dt className="eyebrow text-charcoal/50">Project Launch</dt><dd className="mt-2 font-serif text-xl">{project.legal.launchDate}</dd></div>
            <div><dt className="eyebrow text-charcoal/50">UP RERA</dt><dd className="mt-2 font-serif text-xl">{project.rera.number}</dd></div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="bg-ivory py-24 sm:py-32">
      <div className="container-lux grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow text-gold">Questions</p>
          <h2 id="faq-title" className="display mt-5 text-[clamp(2.2rem,4vw,3.6rem)]">Frequently asked.</h2>
        </Reveal>
        <div className="lg:col-span-8" data-testid="faq">
          {faqs.map((f, i) => (
            <details key={f.q} className="group border-t border-charcoal/15 last:border-b" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                <span className="font-serif text-2xl leading-snug">{f.q}</span>
                <span className="relative size-4 shrink-0" aria-hidden>
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-charcoal" />
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-charcoal transition-transform duration-500 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-2xl pb-7 text-[15px] leading-[1.85] text-charcoal/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const wa = whatsappLink(waMessages.contact);
  const tel = telLink();
  return (
    <section id="contact" aria-labelledby="contact-title" className="grain relative overflow-hidden bg-ink text-ivory">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/amenities/infinity-pool.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-25" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/60" />
      <div className="container-lux relative grid gap-16 py-24 sm:py-36 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <DecoMark className="h-6 w-12 text-gold" />
          <h2 id="contact-title" className="display mt-8 text-[clamp(2.6rem,5.5vw,5rem)]">Your Next Chapter <em className="text-gold-soft">Begins Here.</em></h2>
          <p className="mt-6 max-w-md text-[15px] leading-[1.85] text-ivory/70">Discover the lifestyle, experience the address and connect with our property advisor.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <EnquireButton kind="Price Details" source="final-cta" className="btn btn-gold" data-testid="final-enquire">Enquire Now</EnquireButton>
            <EnquireButton kind="Callback" source="final-cta" className="btn btn-ghost-light">Request Callback</EnquireButton>
            <EnquireButton kind="Site Visit" source="final-cta" className="btn btn-ghost-light" data-testid="final-sitevisit">Schedule Site Visit</EnquireButton>
          </div>
          <div className="mt-12 space-y-3 text-sm">
            {wa && <a href={wa} target="_blank" rel="noopener" className="flex items-center gap-3 text-ivory/80 hover:text-gold" data-testid="contact-whatsapp"><WhatsAppIcon className="size-4" /> Chat on WhatsApp</a>}
            {tel && <a href={tel} className="flex items-center gap-3 text-ivory/80 hover:text-gold" data-testid="contact-call"><Phone className="size-4" /> {siteConfig.phone}</a>}
            {siteConfig.email && <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3 text-ivory/80 hover:text-gold"><Mail className="size-4" /> {siteConfig.email}</a>}
          </div>
        </Reveal>
        <Reveal delay={0.15} className="border border-ivory/10 bg-ink/60 p-6 backdrop-blur-sm sm:p-10 lg:col-span-6 lg:col-start-7">
          <p className="eyebrow text-gold">Private enquiry</p>
          <p className="mb-8 mt-3 font-serif text-3xl">Share your details</p>
          <EnquiryForm formLocation="contact" tone="dark" defaultType="Site Visit" />
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  const tel = telLink();
  return (
    <footer className="bg-ink pb-28 pt-20 text-ivory/70 sm:pb-12">
      <div className="container-lux">
        <div className="grid gap-12 border-b border-ivory/10 pb-14 md:grid-cols-12">
          <div className="text-ivory md:col-span-4">
            <Wordmark />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/55">{project.location.plot}</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-3 text-sm md:col-span-3">
            {["Overview", "Residences", "Amenities", "Gallery", "Location", "About", "Contact"].map((l) => (
              <a key={l} href={`/#${l.toLowerCase()}`} className="hover:text-gold">{l}</a>
            ))}
          </nav>
          <div className="space-y-3 text-sm md:col-span-3">
            <p className="eyebrow text-ivory/40">Contact</p>
            {tel && <a href={tel} className="block hover:text-gold">{siteConfig.phone}</a>}
            {siteConfig.email && <a href={`mailto:${siteConfig.email}`} className="block hover:text-gold">{siteConfig.email}</a>}
            {siteConfig.advertiserName && <p>Marketed by {siteConfig.advertiserName}{siteConfig.agentRera ? ` · Agent RERA: ${siteConfig.agentRera}` : ""}</p>}
          </div>
          <div className="space-y-2 text-sm md:col-span-2">
            <p className="eyebrow text-ivory/40">UP RERA</p>
            <p className="font-medium text-ivory">{project.rera.number}</p>
            <a href={project.rera.website} target="_blank" rel="noopener" className="block text-xs hover:text-gold">up-rera.in/projects ↗</a>
          </div>
        </div>
        <p className="mt-10 text-[11px] leading-relaxed text-ivory/40">
          <strong className="font-semibold text-ivory/55">Disclaimer:</strong> {disclaimer} Project collection account: {project.legal.collectionAccount}.
          {!siteConfig.advertiserName && " This is a marketing website; it is not the official website of the developer. Official project information is available at www.acegroupindia.com."}
        </p>
        <div className="mt-8 flex flex-wrap justify-between gap-4 text-xs text-ivory/40">
          <p>© ACE Mahagun Medalleo marketing website</p>
          <div className="flex gap-6"><a href="/privacy" className="hover:text-gold">Privacy Policy</a><a href="/terms" className="hover:text-gold">Terms &amp; Conditions</a></div>
        </div>
      </div>
    </footer>
  );
}
