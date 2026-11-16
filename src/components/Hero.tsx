"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { EnquireButton } from "./EnquiryProvider";
import { whatsappLink, waMessages } from "@/lib/config";
import { WhatsAppIcon } from "./icons";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const wa = whatsappLink(waMessages.hero);

  const line = (text: string, d: number) => (
    <span className="block overflow-hidden pb-[0.08em]">
      <span className="hero-rise block" style={{ animationDelay: `${d}s` }}>
        {text}
      </span>
    </span>
  );

  return (
    <section id="top" ref={ref} className="grain relative min-h-[100svh] overflow-hidden bg-ink text-white" aria-label="ACE Mahagun Medalleo">
      <motion.div style={{ y }} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero.webp" alt="ACE Mahagun Medalleo — architectural render of the towers, Sector 107, Noida"
          className="hero-img h-full w-full object-cover object-[60%_center]" fetchPriority="high" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/45 to-ink/95 sm:via-ink/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent" />

      <motion.div style={{ opacity: fade }} className="container-lux relative flex min-h-[100svh] flex-col justify-end pb-24 pt-32 [text-shadow:0_1px_14px_rgb(0_0_0/0.55)] sm:pb-28">
        <p className="hero-fade eyebrow flex items-center gap-4 text-gold" style={{ animationDelay: "0.2s" }}>
          <span className="h-px w-10 bg-gold" /> <span className="hidden sm:inline">ACE Mahagun Medalleo · </span>Sector 107, Noida
        </p>
        <h1 className="display mt-6 max-w-5xl text-[clamp(2.9rem,8vw,7.5rem)] text-white">
          {line("A New Perspective", 0.35)}
          {line("on Elevated Living.", 0.5)}
        </h1>
        <div className="hero-lift mt-8 grid max-w-5xl gap-8 md:grid-cols-[1.2fr_1fr] md:items-end" style={{ animationDelay: "0.5s" }}>
          <p className="max-w-xl text-[15px] leading-relaxed text-white sm:text-base">
            Discover an extraordinary residential address where contemporary architecture, thoughtful landscapes and refined living come together in Sector 107, Noida.
          </p>
          <dl className="flex gap-8 text-sm md:justify-end">
            <div><dt className="eyebrow text-white/85">Residences</dt><dd className="mt-2 font-serif text-2xl">3 &amp; 4 BHK</dd></div>
            <div><dt className="eyebrow text-white/85">Land</dt><dd className="mt-2 font-serif text-2xl">~10 Acres</dd></div>
          </dl>
        </div>
        <div className="hero-lift mt-10 flex flex-wrap gap-3" style={{ animationDelay: "0.65s" }}>
          <a href="#residences" className="btn btn-gold" data-testid="hero-explore">Explore Residences</a>
          <EnquireButton kind="Brochure" source="hero" className="btn btn-ghost-light" data-testid="hero-brochure">Request a Brochure</EnquireButton>
          {wa && (
            <a href={wa} target="_blank" rel="noopener" className="btn btn-ghost-light" data-testid="hero-whatsapp" aria-label="Enquire on WhatsApp">
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
          )}
        </div>
      </motion.div>

      <a href="#overview" aria-label="Scroll to overview" className="absolute bottom-8 right-[clamp(1.25rem,4vw,3.5rem)] hidden items-center gap-3 text-ivory/70 hover:text-gold sm:flex">
        <span className="eyebrow">Scroll</span>
        <span className="scroll-cue relative h-12 w-px overflow-hidden bg-ivory/25" />
        <ArrowDown className="sr-only" />
      </a>
      <p className="absolute bottom-3 left-[clamp(1.25rem,4vw,3.5rem)] bg-ink/50 px-2 py-1 text-xs uppercase tracking-[0.16em] text-ivory/90" data-testid="impression-tag">Artist&apos;s impression · UP RERA: UPRERAPRJ125561</p>
    </section>
  );
}
