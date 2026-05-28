-- ============================================================
-- VERST CARBON ACADEMY — Supabase Storage buckets + RLS, v1
--
-- Run after schema-001 + seed-002-admin-user.sql.
-- Safe to re-run.
--
-- Stance:
--   * Buckets are PUBLIC (anyone can fetch via the public URL).
--   * Writes (upload / overwrite / delete) restricted via RLS:
--       - lesson/resource buckets: admins only (public.is_admin())
--       - avatars bucket: each user manages their own folder
-- ============================================================

-- ---------- Create buckets ----------
insert into storage.buckets (id, name, public)
values
  ('lesson-slides',  'lesson-slides',  true),
  ('lesson-audio',   'lesson-audio',   true),
  ('lesson-avatars', 'lesson-avatars', true),
  ('resources',      'resources',      true),
  ('avatars',        'avatars',        true)
on conflict (id) do nothing;

-- ---------- RLS policies on storage.objects ----------

-- Admins manage all lesson + resource content.
drop policy if exists "admins manage lesson content" on storage.objects;
create policy "admins manage lesson content"
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id in ('lesson-slides', 'lesson-audio', 'lesson-avatars', 'resources')
    and public.is_admin()
  )
  with check (
    bucket_id in ('lesson-slides', 'lesson-audio', 'lesson-avatars', 'resources')
    and public.is_admin()
  );

-- Authenticated users manage their own avatar (path prefix = uid).
drop policy if exists "users manage own avatar" on storage.objects;
create policy "users manage own avatar"
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------- Verification ----------
select id, name, public from storage.buckets order by id;
