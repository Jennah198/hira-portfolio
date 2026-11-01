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

-- No public policies: the website inserts with the service-role key (RLS bypassed).
-- Do not grant anon INSERT/SELECT — it would let anyone read or bypass the site's validation.
