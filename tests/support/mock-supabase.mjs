// Local test double for Supabase's REST RPC endpoint, backed by PGlite (real Postgres in WASM).
// Applies the real migration, then serves POST /rest/v1/rpc/submit_lead executing as the `anon` role,
// so RLS and grants are exercised exactly as in Supabase. Test use only.
import { PGlite } from "@electric-sql/pglite";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const PORT = Number(process.env.MOCK_SUPABASE_PORT || 54321);
const db = new PGlite();
await db.exec(`create role anon nologin; create role authenticated nologin; grant usage on schema public to anon, authenticated;`); // mirrors Supabase defaults
await db.exec(readFileSync(new URL("../../supabase/migrations/20261116000000_leads.sql", import.meta.url), "utf8"));

const ARGS = ["p_name","p_mobile","p_email","p_configuration","p_enquiry_type","p_preferred_time","p_lead_source","p_utm_medium","p_utm_campaign","p_form_location","p_landing_page_url","p_consent","p_consent_text","p_idempotency_key","p_is_test"];

createServer(async (req, res) => {
  const send = (code, body) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };
  let raw = ""; for await (const c of req) raw += c;
  try {
    if (req.method === "POST" && req.url === "/rest/v1/rpc/submit_lead") {
      const b = JSON.parse(raw || "{}");
      await db.exec("set role anon");
      try {
        const r = await db.query(`select public.submit_lead(${ARGS.map((_, i) => `$${i + 1}`).join(",")}) as r`, ARGS.map((a) => b[a] ?? null));
        return send(200, r.rows[0].r);
      } finally { await db.exec("reset role"); }
    }
    if (req.method === "GET" && req.url === "/rest/v1/leads") { // simulate anon reading the table
      await db.exec("set role anon");
      try { const r = await db.query("select * from public.leads"); return send(200, r.rows); }
      finally { await db.exec("reset role"); }
    }
    if (req.method === "GET" && req.url === "/__admin/leads") { // test-only inspection as owner
      const r = await db.query("select customer_name, mobile, email, configuration, enquiry_type, preferred_time, lead_source, form_location, lead_status, consent_status, is_test from public.leads order by created_at");
      return send(200, r.rows);
    }
    send(404, { message: "not found" });
  } catch (e) { send(400, { message: String(e.message || e) }); }
}).listen(PORT, () => console.log(`mock-supabase ready on ${PORT}`));
