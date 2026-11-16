-- ACE Mahagun Medalleo — lead capture schema
-- Security model:
--   * public.leads has RLS enabled and NO policies for anon/authenticated,
--     so the browser/publishable key can never read or write the table directly.
--   * The only write path is public.submit_lead(), a SECURITY DEFINER function
--     that validates input, de-duplicates, and inserts. EXECUTE is granted to anon
--     so the server route can call it with the publishable key (no service-role
--     secret needs to live in the web app).
--   * Sales/CRM staff read leads via the Supabase dashboard or an authenticated
--     role you add later.


create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  customer_name    text not null check (char_length(customer_name) between 2 and 80),
  mobile           text not null check (mobile ~ '^[6-9][0-9]{9}$'),
  email            text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  project_name     text not null default 'ACE Mahagun Medalleo',
  configuration    text not null check (configuration in ('3 BHK','4 BHK','Not Sure')),
  enquiry_type     text not null check (enquiry_type in ('Brochure','Price Details','Site Visit','Callback')),
  preferred_time   text,
  lead_source      text not null default 'Website',
  utm_medium       text,
  utm_campaign     text,
  form_location    text,
  landing_page_url text,
  lead_status      text not null default 'New'
                   check (lead_status in ('New','Contacted','Qualified','Site Visit Scheduled','Closed','Invalid','Test')),
  consent_status   boolean not null check (consent_status = true),
  consent_text     text not null,
  consent_at       timestamptz not null default now(),
  idempotency_key  uuid not null unique,
  is_test          boolean not null default false
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_mobile_idx on public.leads (mobile, enquiry_type, created_at desc);

alter table public.leads enable row level security;
revoke all on table public.leads from anon, authenticated;

create or replace function public.submit_lead(
  p_name text,
  p_mobile text,
  p_email text,
  p_configuration text,
  p_enquiry_type text,
  p_preferred_time text,
  p_lead_source text,
  p_utm_medium text,
  p_utm_campaign text,
  p_form_location text,
  p_landing_page_url text,
  p_consent boolean,
  p_consent_text text,
  p_idempotency_key uuid,
  p_is_test boolean default false
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_existing uuid;
  v_id uuid;
begin
  if p_consent is distinct from true then
    raise exception 'consent_required' using errcode = '22023';
  end if;

  -- Idempotent replay (double click / network retry)
  select id into v_existing from public.leads where idempotency_key = p_idempotency_key;
  if v_existing is not null then
    return jsonb_build_object('status', 'duplicate', 'id', v_existing);
  end if;

  -- Same mobile + enquiry type within 10 minutes = duplicate
  select id into v_existing from public.leads
   where mobile = p_mobile and enquiry_type = p_enquiry_type
     and created_at > now() - interval '10 minutes'
   order by created_at desc limit 1;
  if v_existing is not null then
    return jsonb_build_object('status', 'duplicate', 'id', v_existing);
  end if;

  insert into public.leads (
    customer_name, mobile, email, configuration, enquiry_type, preferred_time,
    lead_source, utm_medium, utm_campaign, form_location, landing_page_url,
    consent_status, consent_text, idempotency_key, is_test, lead_status
  ) values (
    left(trim(p_name), 80), p_mobile, nullif(lower(trim(p_email)), ''), p_configuration, p_enquiry_type,
    nullif(p_preferred_time, ''), coalesce(nullif(left(p_lead_source, 100), ''), 'Website'),
    left(p_utm_medium, 100), left(p_utm_campaign, 150), left(p_form_location, 40), left(p_landing_page_url, 500),
    true, p_consent_text, p_idempotency_key, coalesce(p_is_test, false),
    case when coalesce(p_is_test, false) then 'Test' else 'New' end
  ) returning id into v_id;

  return jsonb_build_object('status', 'created', 'id', v_id);
end;
$$;

revoke all on function public.submit_lead(text,text,text,text,text,text,text,text,text,text,text,boolean,text,uuid,boolean) from public;
grant execute on function public.submit_lead(text,text,text,text,text,text,text,text,text,text,text,boolean,text,uuid,boolean) to anon;
