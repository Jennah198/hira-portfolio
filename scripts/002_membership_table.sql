-- Optional: apply if your Supabase table does not yet match these columns.
-- Table name: public.membership

create table if not exists public.membership (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  student_id text not null,
  program text not null,
  year text not null,
  area_of_interest text,
  motivation text not null,
  created_at timestamp with time zone default now()
);

alter table public.membership enable row level security;

-- Public applications: allow inserts without auth (anonymous or web client).
drop policy if exists "membership_insert_public" on public.membership;
create policy "membership_insert_public"
  on public.membership for insert
  with check (true);

-- Optionally restrict selects to admins only (adjust to your admins table/auth).
-- drop policy if exists "membership_select_admin" on public.membership;
-- create policy "membership_select_admin"
--   on public.membership for select
--   using (exists (select 1 from public.admins where id = auth.uid()));
