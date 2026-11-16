"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import EnquiryForm from "./EnquiryForm";
import type { ENQUIRY_TYPES } from "@/lib/lead-schema";
import ImpressionTag from "./ImpressionTag";

type EnquiryType = (typeof ENQUIRY_TYPES)[number];
type Ctx = { open: (type?: EnquiryType, source?: string) => void };
const EnquiryCtx = createContext<Ctx>({ open: () => {} });
export const useEnquiry = () => useContext(EnquiryCtx);

const HEADINGS: Record<EnquiryType, [string, string]> = {
  Brochure: ["Request the brochure", "Receive the complete residence collection, master plan and specifications."],
  "Price Details": ["Request price details", "Our advisor will share current pricing and availability for your preferred residence."],
  "Site Visit": ["Schedule a site visit", "Experience the address in person. We'll confirm a slot that suits you."],
  Callback: ["Request a callback", "Share your details and a property advisor will call you back."],
};

export default function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ open: boolean; type: EnquiryType; source: string; nonce: number }>({
    open: false, type: "Callback", source: "modal", nonce: 0,
  });
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const open = useCallback((type: EnquiryType = "Callback", source = "modal") => {
    lastFocus.current = document.activeElement as HTMLElement;
    setState((s) => ({ open: true, type, source, nonce: s.nonce + 1 }));
  }, []);
  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
    requestAnimationFrame(() => lastFocus.current?.focus());
  }, []);

  useEffect(() => {
    if (!state.open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => dialogRef.current?.querySelector<HTMLElement>("input:not([tabindex='-1'])")?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialogRef.current) {
        const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("a,button,input:not([tabindex='-1']),select,textarea")).filter((el) => !el.hasAttribute("disabled"));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, [state.open, close]);

  const [h, sub] = HEADINGS[state.type];

  return (
    <EnquiryCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {state.open && (
          <motion.div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button aria-label="Close enquiry form" className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={close} />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="enquiry-title"
              data-testid="enquiry-modal"
              className="relative grid max-h-[94dvh] w-full max-w-4xl overflow-y-auto bg-ivory sm:grid-cols-[0.8fr_1.2fr]"
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative hidden overflow-hidden bg-charcoal sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/amenities/towers-dusk.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
                <ImpressionTag corner="tr" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-ivory">
                  <p className="eyebrow text-gold">ACE Mahagun Medalleo</p>
                  <p className="mt-3 font-serif text-2xl leading-tight">Sector 107, Noida</p>
                  <p className="mt-2 text-xs text-ivory/60">UP RERA: UPRERAPRJ125561</p>
                </div>
              </div>
              <div className="p-6 sm:p-10">
                <button onClick={close} aria-label="Close" className="absolute right-4 top-4 inline-flex size-10 items-center justify-center text-charcoal/70 hover:text-charcoal">
                  <X className="size-5" />
                </button>
                <p className="eyebrow text-gold">Private enquiry</p>
                <h2 id="enquiry-title" className="mt-3 text-4xl">{h}</h2>
                <p className="mt-2 mb-8 text-sm text-charcoal/65">{sub}</p>
                <EnquiryForm key={state.nonce} defaultType={state.type} formLocation={state.source} onDone={close} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EnquiryCtx.Provider>
  );
}

export function EnquireButton({
  kind = "Callback", source = "cta", className = "btn btn-gold", children, onClick, ...rest
}: { kind?: EnquiryType; source?: string; className?: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { open } = useEnquiry();
  return (
    <button type="button" className={className} {...rest} onClick={(e) => { onClick?.(e); open(kind, source); }}>
      {children}
    </button>
  );
}
