-- Optional: storage buckets + object policies. Run in Supabase SQL Editor once.
-- Creating buckets in Dashboard → Storage is usually easier than raw SQL.

insert into storage.buckets (id, name, public)
values
  ('receipts', 'receipts', true),
  ('mvp-demos', 'mvp-demos', true)
on conflict (id) do nothing;

drop policy if exists "receipts_insert_anon" on storage.objects;
drop policy if exists "receipts_select_public" on storage.objects;
drop policy if exists "mvp_demos_insert_anon" on storage.objects;
drop policy if exists "mvp_demos_select_public" on storage.objects;

create policy "receipts_insert_anon"
  on storage.objects for insert to anon
  with check (bucket_id = 'receipts');

create policy "receipts_select_public"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'receipts');

create policy "mvp_demos_insert_anon"
  on storage.objects for insert to anon
  with check (bucket_id = 'mvp-demos');

create policy "mvp_demos_select_public"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'mvp-demos');
