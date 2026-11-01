-- =============================================================================
-- Run ONCE in Supabase → SQL Editor → New query → Run. Safe to re-run.
--
-- 1. Creates the table for Annual Exhibition guest / company-owner registrations.
-- 2. SECURITY: removes public (anon) access to storage and tables.
--    The website only talks to Supabase from the server with the service-role key,
--    so the public anon key needs NO permissions. Before this script, anyone with the
--    anon key (it is public by design) could list and download payment receipts.
-- =============================================================================

-- 1) Guest / company registrations ------------------------------------------
create table if not exists public.exhibition_guest_registrations (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  owner_full_name text not null,
  email text,
  phone_number text not null,
  business_type text not null,
  area_of_interest text not null,
  created_at timestamp with time zone not null default now()
);
create index if not exists exhibition_guest_registrations_created_at_idx
  on public.exhibition_guest_registrations (created_at desc);

-- 2a) Keep RLS on for every form table (service role bypasses RLS) ----------
alter table public.membership                     enable row level security;
alter table public.contact_messages               enable row level security;
alter table public.graduation_registrations       enable row level security;
alter table public.exhibition_registrations       enable row level security;
alter table public.exhibition_guest_registrations enable row level security;

-- 2b) Drop every policy on these tables (anon inserts let bots skip the
--     website's validation/spam checks; nothing public should read them) ----
do $$
declare p record;
begin
  for p in
    select schemaname, tablename, policyname from pg_policies
    where schemaname = 'public'
      and tablename in ('membership','contact_messages','graduation_registrations',
                        'exhibition_registrations','exhibition_guest_registrations')
  loop
    execute format('drop policy if exists %I on %I.%I', p.policyname, p.schemaname, p.tablename);
  end loop;
end $$;

-- 2c) Storage: buckets private + drop public policies for them --------------
update storage.buckets set public = false where id in ('receipts', 'mvp-demos');

do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and (qual ilike '%receipts%' or qual ilike '%mvp-demos%'
           or with_check ilike '%receipts%' or with_check ilike '%mvp-demos%')
  loop
    execute format('drop policy if exists %I on storage.objects', p.policyname);
  end loop;
end $$;

-- Refresh the API schema cache so the new table is usable immediately.
notify pgrst, 'reload schema';

-- Check: should list no policies for these tables / buckets.
select schemaname, tablename, policyname from pg_policies
where (schemaname = 'public' and tablename like any (array['membership','contact_messages','%registrations']))
   or (schemaname = 'storage' and (qual ilike '%receipts%' or qual ilike '%mvp-demos%'));
