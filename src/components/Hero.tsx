"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { EnquireButton } from "./EnquiryProvider";
import { whatsappLink, waMessages } from "@/lib/config";
import { WhatsAppIcon } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const wa = whatsappLink(waMessages.hero);

  const line = (text: string, d: number) => (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.3, delay: d, ease }}>
        {text}
      </motion.span>
    </span>
  );

  return (
    <section id="top" ref={ref} className="grain relative h-[100svh] min-h-[640px] overflow-hidden bg-ink text-ivory" aria-label="ACE Mahagun Medalleo">
      <motion.div style={{ y }} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero.webp" alt="ACE Mahagun Medalleo — architectural render of the towers, Sector 107, Noida"
          className="hero-img h-full w-full object-cover object-[60%_center]" fetchPriority="high" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/20 to-ink/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent" />

      <motion.div style={{ opacity: fade }} className="container-lux relative flex h-full flex-col justify-end pb-24 sm:pb-28">
        <motion.p className="eyebrow flex items-center gap-4 text-gold" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
          <span className="h-px w-10 bg-gold" /> <span className="hidden sm:inline">ACE Mahagun Medalleo · </span>Sector 107, Noida
        </motion.p>
        <h1 className="display mt-6 max-w-5xl text-[clamp(2.9rem,8vw,7.5rem)]">
          {line("A New Perspective", 0.35)}
          {line("on Elevated Living.", 0.5)}
        </h1>
        <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.9, ease }}
          className="mt-8 grid max-w-5xl gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <p className="max-w-xl text-[15px] leading-relaxed text-ivory/80 sm:text-base">
            Discover an extraordinary residential address where contemporary architecture, thoughtful landscapes and refined living come together in Sector 107, Noida.
          </p>
          <dl className="flex gap-8 text-sm md:justify-end">
            <div><dt className="eyebrow text-ivory/50">Residences</dt><dd className="mt-2 font-serif text-2xl">3 &amp; 4 BHK</dd></div>
            <div><dt className="eyebrow text-ivory/50">Land</dt><dd className="mt-2 font-serif text-2xl">~10 Acres</dd></div>
          </dl>
        </motion.div>
        <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 1.1, ease }} className="mt-10 flex flex-wrap gap-3">
          <a href="#residences" className="btn btn-gold" data-testid="hero-explore">Explore Residences</a>
          <EnquireButton kind="Brochure" source="hero" className="btn btn-ghost-light" data-testid="hero-brochure">Request a Brochure</EnquireButton>
          {wa && (
            <a href={wa} target="_blank" rel="noopener" className="btn btn-ghost-light" data-testid="hero-whatsapp" aria-label="Enquire on WhatsApp">
              <WhatsAppIcon className="size-4" /> WhatsApp
            </a>
          )}
        </motion.div>
      </motion.div>

      <a href="#overview" aria-label="Scroll to overview" className="absolute bottom-8 right-[clamp(1.25rem,4vw,3.5rem)] hidden items-center gap-3 text-ivory/70 hover:text-gold sm:flex">
        <span className="eyebrow">Scroll</span>
        <span className="scroll-cue relative h-12 w-px overflow-hidden bg-ivory/25" />
        <ArrowDown className="sr-only" />
      </a>
      <p className="absolute bottom-3 left-[clamp(1.25rem,4vw,3.5rem)] text-[10px] text-ivory/40">Artistic impression · UP RERA: UPRERAPRJ125561</p>
    </section>
  );
}
