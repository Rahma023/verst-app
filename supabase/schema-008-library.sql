-- ============================================================
-- Library: a public catalogue of methodology PDFs, datasets,
-- templates and briefs. Each row can point to either a Supabase
-- Storage file OR an external URL (so we can list third-party
-- docs without re-hosting them).
--
-- Public read for is_published rows; tutors + admins can manage.
-- Safe to re-run.
-- ============================================================

create table if not exists public.library_resources (
  id                uuid primary key default gen_random_uuid(),
  title             text not null check (char_length(title) between 3 and 240),
  description       text null,
  category          text not null check (category in (
    'Methodology','Dataset','Template','Brief','Reference'
  )),
  topic             text null,
  file_type         text not null check (file_type in ('PDF','XLSX','DOCX','ZIP','LINK')),
  file_size_bytes   bigint null,
  file_path         text null,
  external_url      text null,
  published_at      date not null default current_date,
  created_by        uuid null references auth.users(id) on delete set null,
  is_published      boolean not null default true,
  download_count    integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint library_must_have_source check (
    file_path is not null or external_url is not null
  )
);

create index if not exists library_resources_category_idx on public.library_resources(category);
create index if not exists library_resources_published_at_idx on public.library_resources(published_at desc);

alter table public.library_resources enable row level security;

-- Public read of published rows
drop policy if exists "library public read" on public.library_resources;
create policy "library public read"
  on public.library_resources for select
  to anon, authenticated
  using (is_published = true);

-- Tutors and admins manage everything (including unpublished drafts)
drop policy if exists "library tutor admin all" on public.library_resources;
create policy "library tutor admin all"
  on public.library_resources for all
  to authenticated
  using (public.is_admin() or public.is_tutor())
  with check (public.is_admin() or public.is_tutor());

-- Cheap download counter, public-callable
create or replace function public.increment_library_download(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.library_resources
    set download_count = download_count + 1
    where id = p_id;
$$;
grant execute on function public.increment_library_download(uuid) to anon, authenticated;
