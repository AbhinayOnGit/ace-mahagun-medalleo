"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { EnquireButton } from "./EnquiryProvider";
import { telLink, whatsappLink, waMessages } from "@/lib/config";

export default function FloatingActions() {
  const [show, setShow] = useState(false);
  const wa = whatsappLink(waMessages.general);
  const tel = telLink();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {wa && (
        <a href={wa} target="_blank" rel="noopener" aria-label="Enquire on WhatsApp" data-testid="float-whatsapp"
          className={`fixed bottom-24 right-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#1f8f4e] text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,.5)] transition-all duration-500 hover:scale-105 sm:bottom-8 sm:right-8 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
          <WhatsAppIcon className="size-6" />
        </a>
      )}
      {/* Sticky mobile enquiry bar */}
      <div className={`fixed inset-x-0 bottom-0 z-40 flex border-t border-ivory/10 bg-ink/95 backdrop-blur-md transition-transform duration-500 sm:hidden ${show ? "translate-y-0" : "translate-y-full"}`} data-testid="mobile-bar">
        {tel && (
          <a href={tel} className="flex flex-1 items-center justify-center gap-2 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ivory" aria-label="Call property advisor">
            <Phone className="size-4" /> Call
          </a>
        )}
        <EnquireButton source="mobile-bar" className="flex flex-[2] items-center justify-center bg-gold py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">Enquire Now</EnquireButton>
      </div>
    </>
  );
}
