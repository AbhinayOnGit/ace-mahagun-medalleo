"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { EnquireButton } from "./EnquiryProvider";

const links = [
  { href: "#overview", label: "Overview" },
  { href: "#residences", label: "Residences" },
  { href: "#amenities", label: "Amenities" },
  { href: "#tour", label: "Tour" },
  { href: "#gallery", label: "Gallery" },
  { href: "#location", label: "Location" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="eyebrow text-[9px] tracking-[0.42em] opacity-70">ACE Mahagun</span>
      <span className="mt-1 font-serif text-[1.65rem] font-light tracking-[0.18em]">MEDALLEO</span>
    </span>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => { const el = document.querySelector(l.href); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,padding,border-color] duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${
        scrolled ? "border-b border-ivory/10 bg-ink/85 py-3 backdrop-blur-md" : "border-b border-transparent bg-transparent py-6"
      }`}
    >
      <nav aria-label="Primary" className="container-lux flex items-center justify-between text-ivory">
        <a href="#top" aria-label="ACE Mahagun Medalleo — back to top" className="text-ivory">
          <Wordmark />
        </a>
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={`eyebrow link-underline pb-1 transition-colors ${active === l.href ? "text-gold" : "text-ivory/80 hover:text-ivory"}`}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <EnquireButton source="nav" className="btn btn-gold hidden min-h-11 sm:inline-flex" data-testid="nav-enquire">Enquire Now</EnquireButton>
          <button className="inline-flex size-11 items-center justify-center lg:hidden" aria-label="Open menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(true)}>
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-ink text-ivory"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="container-lux flex items-center justify-between py-6">
              <Wordmark />
              <button aria-label="Close menu" className="inline-flex size-11 items-center justify-center" onClick={() => setOpen(false)}>
                <X className="size-6" />
              </button>
            </div>
            <ul className="container-lux mt-6 flex flex-1 flex-col gap-1">
              {links.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.1, duration: 0.5 }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 border-b border-ivory/10 py-4 font-serif text-4xl font-light">
                    <span className="eyebrow text-gold">0{i + 1}</span>{l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="container-lux pb-10">
              <EnquireButton source="mobile-menu" className="btn btn-gold w-full" onClick={() => setOpen(false)}>Enquire Now</EnquireButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
