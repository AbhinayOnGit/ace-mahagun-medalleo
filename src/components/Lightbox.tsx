"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";

export type LightboxItem = { src: string; alt: string; caption?: string };

type Props = {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
  zoomable?: boolean;
  testId?: string;
};

export default function Lightbox({ items, index, onClose, onIndex, zoomable = false, testId = "lightbox" }: Props) {
  const [zoom, setZoom] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);
  const isOpen = index !== null;
  const n = items.length;

  const go = useCallback((d: number) => {
    if (index === null) return;
    setZoom(1);
    onIndex((index + d + n) % n);
  }, [index, n, onIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (zoomable && (e.key === "+" || e.key === "=")) setZoom((z) => Math.min(3, z + 0.5));
      if (zoomable && e.key === "-") setZoom((z) => Math.max(1, z - 0.5));
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); prevFocus?.focus(); };
  }, [isOpen, go, onClose, zoomable]);

  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div role="dialog" aria-modal="true" aria-label={item.alt} data-testid={testId}
          className="fixed inset-0 z-[110] flex flex-col bg-ink/97 text-ivory"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <div className="flex items-center justify-between px-4 py-3 sm:px-8">
            <p className="eyebrow text-ivory/60" aria-live="polite">{String(index! + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</p>
            <div className="flex items-center gap-1">
              {zoomable && (
                <>
                  <button aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z - 0.5))} className="inline-flex size-11 items-center justify-center hover:text-gold"><Minus className="size-5" /></button>
                  <span className="w-12 text-center text-xs tabular-nums text-ivory/60">{Math.round(zoom * 100)}%</span>
                  <button aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(3, z + 0.5))} className="inline-flex size-11 items-center justify-center hover:text-gold"><Plus className="size-5" /></button>
                </>
              )}
              <button ref={closeRef} aria-label="Close" onClick={onClose} className="inline-flex size-11 items-center justify-center hover:text-gold" data-testid={`${testId}-close`}><X className="size-6" /></button>
            </div>
          </div>
          <div
            className={`relative flex-1 ${zoom > 1 ? "overflow-auto" : "overflow-hidden"}`}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current === null || zoom > 1) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div key={item.src} className="flex min-h-full items-center justify-center p-2 sm:p-8"
                style={{ width: `${zoom * 100}%`, height: zoom > 1 ? `${zoom * 100}%` : "100%" }}
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} className="max-h-full max-w-full object-contain select-none" draggable={false}
                  style={zoom > 1 ? { maxHeight: "none", maxWidth: "none", width: "100%" } : undefined} />
              </motion.div>
            </AnimatePresence>
            {n > 1 && (
              <>
                <button aria-label="Previous image" onClick={() => go(-1)} className="fixed left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center border border-ivory/20 bg-ink/40 hover:border-gold hover:text-gold sm:left-6"><ChevronLeft className="size-5" /></button>
                <button aria-label="Next image" onClick={() => go(1)} className="fixed right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center border border-ivory/20 bg-ink/40 hover:border-gold hover:text-gold sm:right-6" data-testid={`${testId}-next`}><ChevronRight className="size-5" /></button>
              </>
            )}
          </div>
          {item.caption && <p className="px-4 pb-5 text-center text-sm text-ivory/70 sm:px-8">{item.caption}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
