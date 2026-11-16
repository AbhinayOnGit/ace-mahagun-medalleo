"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import {
  CONFIGURATIONS,
  CONSENT_TEXT,
  CONTACT_TIMES,
  ENQUIRY_TYPES,
  leadSchema,
} from "@/lib/lead-schema";
import { siteConfig, whatsappLink, waMessages } from "@/lib/config";

type EnquiryType = (typeof ENQUIRY_TYPES)[number];
type Props = {
  defaultType?: EnquiryType;
  formLocation: string;
  tone?: "light" | "dark";
  onDone?: () => void;
};

const newKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (+c ^ (Math.random() * 16) >> (+c / 4)).toString(16),
      );

const ERROR_COPY: Record<string, string> = {
  rate_limited: "You've sent several enquiries in a short time. Please try again in a few minutes.",
  not_configured: "Online enquiries are temporarily unavailable. Please try again shortly.",
  storage_failed: "We couldn't save your enquiry just now. Please try again.",
  network: "Network issue — please check your connection and try again.",
};

export default function EnquiryForm({ defaultType = "Callback", formLocation, tone = "light", onDone }: Props) {
  const uid = useId();
  const [values, setValues] = useState({
    name: "",
    mobile: "",
    email: "",
    configuration: "" as string,
    enquiryType: defaultType as string,
    contactTime: "",
    consent: false,
    company: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState<"created" | "duplicate">("created");
  const keyRef = useRef<string>("");
  const firstErrorRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    keyRef.current = newKey();
  }, []);

  const dark = tone === "dark";
  const fieldCls = `field ${dark ? "field-dark text-ivory placeholder:text-ivory/40" : "placeholder:text-charcoal/40"}`;
  const labelCls = `eyebrow ${dark ? "text-ivory/60" : "text-charcoal/70"}`;
  const id = (n: string) => `${uid}-${n}`;

  const set = (k: keyof typeof values, v: string | boolean) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const utm = useMemo(() => {
    if (typeof window === "undefined") return {};
    const p = new URLSearchParams(window.location.search);
    return {
      utmSource: p.get("utm_source") ?? undefined,
      utmMedium: p.get("utm_medium") ?? undefined,
      utmCampaign: p.get("utm_campaign") ?? undefined,
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return; // duplicate submission guard
    setFormError("");
    const payload = {
      ...values,
      consent: values.consent as true,
      idempotencyKey: keyRef.current || newKey(),
      landingUrl: window.location.href.slice(0, 500),
      formLocation,
      ...utm,
    };
    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) {
        const k = String(i.path[0]);
        if (!fe[k]) fe[k] = i.message;
      }
      setErrors(fe);
      requestAnimationFrame(() => {
        firstErrorRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }
    setState("submitting");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setResult(json.status === "duplicate" ? "duplicate" : "created");
        setState("success");
        return;
      }
      if (json.fieldErrors) setErrors(json.fieldErrors);
      setFormError(ERROR_COPY[json.error] ?? "Please review the highlighted fields.");
      setState("error");
    } catch {
      setFormError(ERROR_COPY.network);
      setState("error");
    }
  }

  if (state === "success") {
    const wa = whatsappLink(waMessages.general);
    return (
      <div role="status" aria-live="polite" className="py-6" data-testid="enquiry-success">
        <span className={`inline-flex size-12 items-center justify-center rounded-full border ${dark ? "border-gold text-gold" : "border-forest text-forest"}`}>
          <Check className="size-5" aria-hidden />
        </span>
        <h3 className={`mt-6 text-3xl ${dark ? "text-ivory" : "text-charcoal"}`}>Thank you, {values.name.split(" ")[0]}.</h3>
        <p className={`mt-3 max-w-md text-sm leading-relaxed ${dark ? "text-ivory/70" : "text-charcoal/70"}`}>
          {result === "duplicate"
            ? "We already have your recent enquiry on record — our property advisor will be in touch shortly."
            : `Your ${values.enquiryType.toLowerCase()} request has been received. Our property advisor will contact you on +91 ${values.mobile.replace(/\D/g, "").slice(-10)}${values.contactTime ? ` (${values.contactTime.toLowerCase()})` : ""}.`}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {values.enquiryType === "Brochure" && siteConfig.brochureUrl && (
            <a className="btn btn-gold" href={siteConfig.brochureUrl} target="_blank" rel="noopener">Open Brochure</a>
          )}
          {wa && <a className={`btn ${dark ? "btn-ghost-light" : "btn-ghost-dark"}`} href={wa} target="_blank" rel="noopener">Continue on WhatsApp</a>}
          {onDone && <button type="button" onClick={onDone} className={`btn ${dark ? "btn-ghost-light" : "btn-ghost-dark"}`}>Close</button>}
        </div>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={id(`${k}-err`)} className="mt-1.5 text-xs text-[#c2410c]" role="alert">{errors[k]}</p>
    ) : null;

  return (
    <form ref={firstErrorRef} onSubmit={onSubmit} noValidate className="grid gap-x-8 gap-y-6 sm:grid-cols-2" data-testid={`enquiry-form-${formLocation}`}>
      {/* honeypot */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={id("company")}>Company</label>
        <input id={id("company")} tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => set("company", e.target.value)} />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={id("name")} className={labelCls}>Full name *</label>
        <input id={id("name")} name="name" autoComplete="name" className={fieldCls} value={values.name}
          onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? id("name-err") : undefined} />
        {err("name")}
      </div>

      <div>
        <label htmlFor={id("mobile")} className={labelCls}>Mobile number *</label>
        <div className="flex items-end gap-2">
          <span className={`pb-[0.6rem] text-base ${dark ? "text-ivory/60" : "text-charcoal/70"}`}>+91</span>
          <input id={id("mobile")} name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={17}
            placeholder="98XXX XXXXX" className={fieldCls} value={values.mobile}
            onChange={(e) => set("mobile", e.target.value.replace(/[^\d+\s-]/g, ""))}
            aria-invalid={!!errors.mobile} aria-describedby={errors.mobile ? id("mobile-err") : undefined} />
        </div>
        {err("mobile")}
      </div>

      <div>
        <label htmlFor={id("email")} className={labelCls}>Email <span className="normal-case tracking-normal">(optional)</span></label>
        <input id={id("email")} name="email" type="email" inputMode="email" autoComplete="email" className={fieldCls} value={values.email}
          onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? id("email-err") : undefined} />
        {err("email")}
      </div>

      <fieldset className="sm:col-span-2" aria-invalid={!!errors.configuration}>
        <legend className={labelCls}>Configuration *</legend>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
          {CONFIGURATIONS.map((c) => {
            const on = values.configuration === c;
            return (
              <label key={c} className={`cursor-pointer border px-4 py-2.5 text-sm transition-colors ${on ? "border-gold bg-gold text-ink" : dark ? "border-ivory/25 text-ivory/80 hover:border-gold" : "border-charcoal/20 text-charcoal/80 hover:border-gold"}`}>
                <input type="radio" name={id("configuration")} value={c} checked={on} onChange={() => set("configuration", c)} className="sr-only" />
                {c}
              </label>
            );
          })}
        </div>
        {err("configuration")}
      </fieldset>

      <div>
        <label htmlFor={id("type")} className={labelCls}>Enquiry type *</label>
        <select id={id("type")} name="enquiryType" className={`${fieldCls} appearance-none`} value={values.enquiryType}
          onChange={(e) => set("enquiryType", e.target.value)} aria-invalid={!!errors.enquiryType}>
          {ENQUIRY_TYPES.map((t) => (
            <option key={t} value={t} className="text-charcoal">{t === "Site Visit" ? "Schedule Site Visit" : t === "Callback" ? "Request Callback" : t}</option>
          ))}
        </select>
        {err("enquiryType")}
      </div>

      <div>
        <label htmlFor={id("time")} className={labelCls}>Preferred time <span className="normal-case tracking-normal">(optional)</span></label>
        <select id={id("time")} name="contactTime" className={`${fieldCls} appearance-none`} value={values.contactTime}
          onChange={(e) => set("contactTime", e.target.value)}>
          <option value="" className="text-charcoal">Any time</option>
          {CONTACT_TIMES.filter((t) => t !== "Anytime").map((t) => (
            <option key={t} value={t} className="text-charcoal">{t}</option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className={`flex cursor-pointer items-start gap-3 text-xs leading-relaxed ${dark ? "text-ivory/65" : "text-charcoal/65"}`}>
          <input type="checkbox" name="consent" checked={values.consent} onChange={(e) => set("consent", e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[#B89B68]" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? id("consent-err") : undefined} />
          <span>
            {CONSENT_TEXT.replace(" I have read the Privacy Policy.", "")} I have read the{" "}
            <a href="/privacy" className="underline underline-offset-2 hover:text-gold">Privacy Policy</a>.
          </span>
        </label>
        {err("consent")}
      </div>

      {formError && (
        <p className="sm:col-span-2 border-l-2 border-[#c2410c] pl-3 text-sm text-[#c2410c]" role="alert" data-testid="form-error">{formError}</p>
      )}

      <div className="sm:col-span-2 flex flex-wrap items-center gap-5">
        <button type="submit" disabled={state === "submitting"} className={`btn ${dark ? "btn-gold" : "btn-dark"} min-w-52 disabled:opacity-60`} data-testid="enquiry-submit">
          {state === "submitting" ? (<><Loader2 className="size-4 animate-spin" aria-hidden /> Sending…</>) : "Submit Enquiry"}
        </button>
        <p className={`text-xs ${dark ? "text-ivory/65" : "text-charcoal/70"}`}>We never share your details with third parties.</p>
      </div>
    </form>
  );
}
