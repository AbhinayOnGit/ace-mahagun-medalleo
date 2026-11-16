"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Play, Plus, RotateCcw, View } from "lucide-react";
import Reveal from "./Reveal";
import { tour360TestPattern, tours360, walkthrough, type Tour360 } from "@/content/project";
import { PanoViewer } from "@/lib/pano";

const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

/** Real tours if supplied; otherwise a labelled test pattern on non-production builds only. */
const tours: Tour360[] = tours360.length ? tours360 : isProduction ? [] : [tour360TestPattern];

function WalkthroughVideo() {
  const [play, setPlay] = useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${walkthrough.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  return (
    <figure className="m-0">
      <div className="relative aspect-video w-full overflow-hidden bg-ink">
        {play ? (
          <iframe
            src={src}
            title={walkthrough.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            data-testid="walkthrough-iframe"
          />
        ) : (
          <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 h-full w-full" aria-label="Play the official walkthrough video" data-testid="walkthrough-play">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={walkthrough.poster} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
            <span className="absolute left-1/2 top-1/2 inline-flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/60 bg-ink/40 text-ivory backdrop-blur transition-colors group-hover:bg-gold group-hover:text-ink">
              <Play className="ml-1 size-7" aria-hidden />
            </span>
            <span className="eyebrow absolute bottom-5 left-5 text-ivory">Watch the walkthrough</span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 text-[11px] text-charcoal/50">
        <span>Official ACE walkthrough film · plays from YouTube (privacy-enhanced mode)</span>
        <a href={walkthrough.source} target="_blank" rel="noopener" className="link-underline uppercase tracking-[0.2em] text-charcoal">Source: ACE Group</a>
      </figcaption>
    </figure>
  );
}

function Viewer360() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<PanoViewer | null>(null);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error" | "unsupported">("idle");
  const [idx, setIdx] = useState(0);
  const tour = tours[idx];
  const isTest = tour.id === tour360TestPattern.id;

  const show = (t: Tour360) => {
    const v = viewerRef.current;
    if (!v) return;
    setState("loading");
    v.load(t.src).then(() => setState("ready")).catch(() => setState("error"));
  };

  const start = () => {
    if (!canvasRef.current) return;
    setStarted(true);
    if (!PanoViewer.supported()) return setState("unsupported");
    try {
      viewerRef.current = new PanoViewer(canvasRef.current);
    } catch {
      return setState("unsupported");
    }
    show(tour);
    canvasRef.current.focus();
  };

  const pick = (i: number) => {
    setIdx(i);
    show(tours[i]);
  };

  useEffect(() => () => viewerRef.current?.destroy(), []);

  const ctl = "inline-flex size-10 items-center justify-center bg-ivory/90 text-charcoal transition-colors hover:bg-gold";

  return (
    <figure className="m-0" data-testid="tour360">
      <div className="relative aspect-video w-full overflow-hidden bg-ink">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="application"
          aria-roledescription="360-degree photo viewer"
          aria-label={`${tour.title}. Drag, or use arrow keys to look around; plus and minus to zoom.`}
          className={`absolute inset-0 h-full w-full touch-none ${started ? "cursor-grab active:cursor-grabbing" : "pointer-events-none opacity-0"}`}
          data-testid="tour360-canvas"
          data-state={state}
        />
        {!started && (
          <button type="button" onClick={start} className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-ivory" data-testid="tour360-start">
            <span className="inline-flex size-20 items-center justify-center rounded-full border border-ivory/60 transition-colors group-hover:bg-gold group-hover:text-ink">
              <View className="size-7" aria-hidden />
            </span>
            <span className="eyebrow">Explore in 360°</span>
          </button>
        )}
        {started && state === "loading" && <p className="absolute inset-0 flex items-center justify-center text-sm text-ivory/70" role="status">Loading 360° view…</p>}
        {(state === "unsupported" || state === "error") && (
          <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-ivory/80" role="alert">
            {state === "unsupported" ? "Your browser can't show 360° views (WebGL is unavailable)." : "This 360° view couldn't be loaded. Please try again later."}
          </p>
        )}
        {isTest && (
          <span className="absolute left-4 top-4 bg-[#7a1f0e] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory" data-testid="tour360-test-badge">
            Test pattern · preview only
          </span>
        )}
        {started && state === "ready" && (
          <div className="absolute bottom-4 right-4 flex gap-1.5">
            <button type="button" className={ctl} aria-label="Zoom in" onClick={() => viewerRef.current?.zoom(-8)}><Plus className="size-4" aria-hidden /></button>
            <button type="button" className={ctl} aria-label="Zoom out" onClick={() => viewerRef.current?.zoom(8)}><Minus className="size-4" aria-hidden /></button>
            <button type="button" className={ctl} aria-label="Reset view" onClick={() => { const v = viewerRef.current; if (v) { v.yaw = 0; v.pitch = 0; v.fov = 75; } }}><RotateCcw className="size-4" aria-hidden /></button>
          </div>
        )}
      </div>
      {tours.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="360° scenes">
          {tours.map((t, i) => (
            <button key={t.id} type="button" role="radio" aria-checked={i === idx} onClick={() => pick(i)}
              className={`border px-4 py-2.5 text-sm transition-colors ${i === idx ? "border-charcoal bg-charcoal text-ivory" : "border-charcoal/20 hover:border-charcoal"}`}>
              {t.title}
            </button>
          ))}
        </div>
      )}
      <figcaption className="mt-3 text-[11px] text-charcoal/50">{tour.note ?? `${tour.title} · 360° photo`}</figcaption>
    </figure>
  );
}

export default function VirtualTour() {
  return (
    <section id="tour" aria-labelledby="tour-title" className="bg-ivory py-24 sm:py-36" data-testid="tour-section">
      <div className="container-lux">
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold">Virtual Tour</p>
            <h2 id="tour-title" className="display mt-6 text-[clamp(2.4rem,5vw,4.6rem)]">
              Walk through <em className="text-forest">Medalleo.</em>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-[1.85] text-charcoal/70 lg:col-span-4 lg:col-start-9 lg:self-end">
            Watch the developer&apos;s official walkthrough film{tours.length ? ", or look around in 360°" : ""}. Visuals are artistic
            impressions; actual specifications may differ.
          </p>
        </Reveal>
        <div className={`mt-14 grid gap-10 ${tours.length ? "lg:grid-cols-2" : ""}`}>
          <Reveal><WalkthroughVideo /></Reveal>
          {tours.length > 0 && <Reveal delay={0.1}><Viewer360 /></Reveal>}
        </div>
      </div>
    </section>
  );
}
