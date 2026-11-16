import { NextResponse } from "next/server";
import { CONSENT_TEXT, leadSchema, normaliseIndianMobile } from "@/lib/lead-schema";

/**
 * POST /api/enquiry
 * Server-side validation → Supabase RPC `submit_lead` (SECURITY DEFINER).
 * Uses only the publishable key; the leads table itself is not exposed.
 */

// Best-effort per-instance rate limiting (serverless instances are ephemeral;
// the database-level de-duplication is the authoritative guard).
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = Number(process.env.ENQUIRY_RATE_LIMIT || 5);

function rateLimited(key: string) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(key, list);
  return list.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      if (!fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    // Honeypot hit: pretend success so bots learn nothing.
    if (fieldErrors.company) return NextResponse.json({ ok: true, status: "created" });
    return NextResponse.json({ ok: false, error: "validation", fieldErrors }, { status: 422 });
  }

  const d = parsed.data;
  const mobile = normaliseIndianMobile(d.mobile)!;
  const ip = req.headers.get("x-real-ip") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(`${ip}`)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.error("[enquiry] Supabase is not configured");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/rpc/submit_lead`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        p_name: d.name,
        p_mobile: mobile,
        p_email: d.email || "",
        p_configuration: d.configuration,
        p_enquiry_type: d.enquiryType,
        p_preferred_time: d.contactTime || "",
        p_lead_source: d.utmSource || "Website",
        p_utm_medium: d.utmMedium ?? null,
        p_utm_campaign: d.utmCampaign ?? null,
        p_form_location: d.formLocation ?? null,
        p_landing_page_url: d.landingUrl ?? null,
        p_consent: true,
        p_consent_text: CONSENT_TEXT,
        p_idempotency_key: d.idempotencyKey,
        p_is_test: process.env.LEAD_TEST_MODE === "true",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[enquiry] RPC failed", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ ok: false, error: "storage_failed" }, { status: 502 });
    }
    const result = (await res.json()) as { status: "created" | "duplicate"; id: string };
    return NextResponse.json({ ok: true, status: result.status });
  } catch (err) {
    console.error("[enquiry] RPC error", err);
    return NextResponse.json({ ok: false, error: "storage_failed" }, { status: 502 });
  }
}
