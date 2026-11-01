-- Storage buckets for uploads. Both are PRIVATE: the website uploads with the service-role key
-- and the admin dashboard shows files through short-lived signed URLs.
-- Do NOT add anon/public policies on storage.objects for these buckets — receipts contain
-- personal payment data. (See 005_guest_table_and_security.sql, which removes old ones.)

insert into storage.buckets (id, name, public)
values
  ('receipts', 'receipts', false),
  ('mvp-demos', 'mvp-demos', false)
on conflict (id) do update set public = false;
