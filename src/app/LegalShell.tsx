import Link from "next/link";

export default function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-ivory">
      <header className="bg-ink py-6 text-ivory">
        <div className="container-lux flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-[0.18em]">MEDALLEO</Link>
          <Link href="/" className="eyebrow text-gold">← Back to site</Link>
        </div>
      </header>
      <article className="container-lux max-w-3xl py-20 text-[15px] leading-[1.85] text-charcoal/80 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-charcoal [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
        <h1 className="display text-5xl text-charcoal">{title}</h1>
        <p className="text-xs text-charcoal/50">Last updated: 16 November 2026</p>
        {children}
      </article>
    </main>
  );
}
