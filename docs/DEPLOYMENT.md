# Deployment

## 1. Supabase (lead database)

1. Create a **dedicated** Supabase project (e.g. `ace-medalleo-leads`, region `ap-south-1` Mumbai). Do not reuse a production database.
2. Apply `supabase/migrations/20261116000000_leads.sql` (SQL editor, `supabase db push`, or the Supabase MCP `apply_migration`).
3. Run the security advisor (Dashboard → Advisors). Expected: `leads` has RLS enabled with no anon policies; `submit_lead` is `SECURITY DEFINER` with a pinned `search_path`.
4. Copy the **Project URL** and **publishable key** (`sb_publishable_…`). The service-role key is not used.
5. View leads in Table Editor → `leads`. Filter `is_test = false` for real enquiries.

### Security model
| Actor | Can do |
|---|---|
| Browser | Nothing direct — it only calls `/api/enquiry` |
| `/api/enquiry` (publishable key, role `anon`) | `EXECUTE submit_lead()` only |
| `anon` on `public.leads` | No SELECT/INSERT/UPDATE/DELETE (verified by test) |
| Dashboard / future CRM role | Read & manage leads |

## 2. Vercel

Set these in Project → Settings → Environment Variables (**Preview** first):

| Variable | Preview | Production |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | preview URL | final domain |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | approved number or empty | approved number |
| `NEXT_PUBLIC_CONTACT_PHONE` | approved number or empty | approved number |
| `NEXT_PUBLIC_ADVERTISER_NAME`, `NEXT_PUBLIC_AGENT_RERA_NUMBER` | as approved | required if agent |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | test project | production project |
| `LEAD_TEST_MODE` | `true` | `false` (after approval) |
| `ALLOW_INDEXING` | `false` | `true` (after approval) |

`NEXT_PUBLIC_*` values are inlined at build time — redeploy after changing them.

Framework preset: Next.js · Build: `next build` · Node 22.x.

## 3. Go-live checklist (requires owner approval)
- [ ] Image/brochure usage authorised by ACE Group (see VERIFICATION.md)
- [ ] Advertiser name + UP RERA agent registration filled
- [ ] Contact numbers approved
- [ ] Privacy/Terms placeholders completed and legally reviewed
- [ ] `LEAD_TEST_MODE=false`, `ALLOW_INDEXING=true`, custom domain attached
- [ ] Test leads deleted: `delete from leads where is_test;`
- [ ] Optional: CRM (e.g. LeadSquared) forwarding — only with consent wording that names the CRM processor
