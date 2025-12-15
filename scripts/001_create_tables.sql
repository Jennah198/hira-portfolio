-- Create posts table for "What's New" section
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create registrations table for all three types
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('graduation', 'exhibition', 'membership')),
  full_name text not null,
  email text not null,
  phone text,
  university text,
  department text,
  area_of_interest text,
  message text,
  created_at timestamp with time zone default now()
);

-- Create admins table (references auth.users)
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS on all tables
alter table public.posts enable row level security;
alter table public.registrations enable row level security;
alter table public.admins enable row level security;

-- Posts policies: Public read, admin write
create policy "posts_select_all"
  on public.posts for select
  using (true);

create policy "posts_insert_admin"
  on public.posts for insert
  with check (exists (select 1 from public.admins where id = auth.uid()));

create policy "posts_update_admin"
  on public.posts for update
  using (exists (select 1 from public.admins where id = auth.uid()));

create policy "posts_delete_admin"
  on public.posts for delete
  using (exists (select 1 from public.admins where id = auth.uid()));

-- Registrations policies: Anyone can insert, only admins can view
create policy "registrations_insert_all"
  on public.registrations for insert
  with check (true);

create policy "registrations_select_admin"
  on public.registrations for select
  using (exists (select 1 from public.admins where id = auth.uid()));

create policy "registrations_delete_admin"
  on public.registrations for delete
  using (exists (select 1 from public.admins where id = auth.uid()));

-- Admins policies: Only admins can view
create policy "admins_select_admin"
  on public.admins for select
  using (exists (select 1 from public.admins where id = auth.uid()));
