"use client";

import { useId, useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import Reveal from "./Reveal";
import { EnquireButton } from "./EnquiryProvider";

/**
 * Home-loan EMI estimator (adapted from the Stitch "Financial Estimator" concept).
 *
 * Deliberately ships with NO project price, booking amount, payment plan,
 * interest rate or lender names — none of these are published by the developer.
 * The visitor enters the price quoted to them and their bank's rate; until both
 * are entered the outputs stay blank. All results are illustrative.
 */

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function computeEmi(principal: number, annualRatePct: number, years: number) {
  const n = Math.round(years * 12);
  if (!(principal > 0) || !(n > 0) || !(annualRatePct >= 0)) return null;
  const r = annualRatePct / 12 / 100;
  const emi = r === 0 ? principal / n : (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  const total = emi * n;
  return { emi, total, interest: total - principal, months: n };
}

export default function EmiEstimator() {
  const uid = useId();
  const [priceText, setPriceText] = useState("");
  const [rateText, setRateText] = useState("");
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(20);

  const price = Number(priceText.replace(/[^\d]/g, "")) || 0;
  const rate = rateText.trim() === "" ? NaN : Number(rateText);
  const rateValid = Number.isFinite(rate) && rate >= 0 && rate <= 25;
  const down = (price * downPct) / 100;
  const loan = price - down;
  const res = useMemo(() => (price > 0 && rateValid ? computeEmi(loan, rate, years) : null), [price, rateValid, loan, rate, years]);

  const id = (s: string) => `${uid}-${s}`;
  const label = "eyebrow text-charcoal/60";

  return (
    <section id="emi" aria-labelledby="emi-title" className="bg-[#f4ede2] py-24 sm:py-32" data-testid="emi-section">
      <div className="container-lux">
        <Reveal className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-gold">Plan Your Purchase</p>
            <h2 id="emi-title" className="display mt-6 text-[clamp(2.2rem,4.6vw,4.2rem)]">
              Home-loan <em className="text-forest">EMI estimator.</em>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-[1.85] text-charcoal/70 lg:col-span-4 lg:col-start-9 lg:self-end">
            Enter the price quoted to you and your lender&apos;s interest rate to see an indicative monthly outlay.
            Pricing for ACE Mahagun Medalleo is shared on request.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* Inputs */}
          <div className="border border-charcoal/10 bg-ivory p-6 sm:p-10 lg:col-span-7">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <label htmlFor={id("price")} className={label}>Quoted property price (₹)</label>
                <input id={id("price")} inputMode="numeric" autoComplete="off" placeholder="Enter quoted price"
                  className="field font-serif text-2xl tabular-nums placeholder:font-sans placeholder:text-base placeholder:text-charcoal/40"
                  value={price ? price.toLocaleString("en-IN") : priceText}
                  onChange={(e) => setPriceText(e.target.value.replace(/[^\d]/g, "").slice(0, 12))}
                  data-testid="emi-price" />
              </div>
              <div>
                <label htmlFor={id("rate")} className={label}>Interest rate (% p.a.)</label>
                <input id={id("rate")} inputMode="decimal" autoComplete="off" placeholder="Your lender's rate"
                  className="field font-serif text-2xl tabular-nums placeholder:font-sans placeholder:text-base placeholder:text-charcoal/40"
                  value={rateText} onChange={(e) => setRateText(e.target.value.replace(/[^\d.]/g, "").slice(0, 5))}
                  aria-invalid={rateText !== "" && !rateValid} aria-describedby={id("rate-hint")}
                  data-testid="emi-rate" />
                <p id={id("rate-hint")} className={`mt-1.5 text-xs ${rateText !== "" && !rateValid ? "text-[#c2410c]" : "text-charcoal/45"}`}>
                  {rateText !== "" && !rateValid ? "Enter a rate between 0 and 25%." : "Use the rate your bank has offered you."}
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-10">
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={id("down")} className={label}>Down payment</label>
                  <span className="font-serif text-xl tabular-nums">{downPct}%{price ? ` · ${inr(down)}` : ""}</span>
                </div>
                <input id={id("down")} type="range" min={10} max={60} step={5} value={downPct}
                  onChange={(e) => setDownPct(Number(e.target.value))} className="mt-4 w-full accent-[#735b2e]"
                  aria-valuetext={`${downPct} percent`} data-testid="emi-down" />
                <div className="mt-1 flex justify-between text-[11px] text-charcoal/45"><span>10%</span><span>60%</span></div>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor={id("tenure")} className={label}>Loan tenure</label>
                  <span className="font-serif text-xl tabular-nums">{years} years</span>
                </div>
                <input id={id("tenure")} type="range" min={5} max={30} step={1} value={years}
                  onChange={(e) => setYears(Number(e.target.value))} className="mt-4 w-full accent-[#735b2e]"
                  aria-valuetext={`${years} years`} data-testid="emi-tenure" />
                <div className="mt-1 flex justify-between text-[11px] text-charcoal/45"><span>5 yrs</span><span>30 yrs</span></div>
              </div>
            </div>
          </div>

          {/* Output */}
          <div className="flex flex-col justify-between bg-ink p-6 text-ivory sm:p-10 lg:col-span-5" aria-live="polite" data-testid="emi-output">
            <div>
              <p className="eyebrow flex items-center gap-2 text-gold"><Calculator className="size-3.5" aria-hidden /> Estimated monthly EMI</p>
              <p className="mt-5 font-serif text-[clamp(2.6rem,5vw,4rem)] leading-none tabular-nums" data-testid="emi-value">
                {res ? inr(res.emi) : "—"}<span className="ml-2 font-sans text-sm text-ivory/50">{res ? "/ month" : ""}</span>
              </p>
              {!res && <p className="mt-4 text-sm text-ivory/55">Enter a quoted price and interest rate to calculate.</p>}
              <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-ivory/15 pt-6 text-sm">
                <div><dt className="eyebrow text-ivory/50">Loan amount</dt><dd className="mt-2 font-serif text-xl tabular-nums">{price ? inr(loan) : "—"}</dd></div>
                <div><dt className="eyebrow text-ivory/50">Total interest</dt><dd className="mt-2 font-serif text-xl tabular-nums">{res ? inr(res.interest) : "—"}</dd></div>
                <div><dt className="eyebrow text-ivory/50">Total payable</dt><dd className="mt-2 font-serif text-xl tabular-nums">{res ? inr(res.total) : "—"}</dd></div>
                <div><dt className="eyebrow text-ivory/50">Instalments</dt><dd className="mt-2 font-serif text-xl tabular-nums">{res ? res.months : "—"}</dd></div>
              </dl>
            </div>
            <div className="mt-10">
              <p className="text-[11px] leading-relaxed text-ivory/45">
                Illustrative only — not an offer, quotation or loan sanction. Excludes stamp duty, registration, GST,
                maintenance and other charges. Actual EMI depends on your lender&apos;s terms and eligibility.
              </p>
              <EnquireButton kind="Price Details" source="emi" className="btn btn-gold mt-6 w-full">Request Price Details</EnquireButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
