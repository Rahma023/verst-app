-- ============================================================
-- Podcast: weekly episodes + a subscriber list (just emails for
-- now; once Resend is wired in Phase 8 we'll send each new
-- episode to the list).
--
-- chapters and transcript are stored as JSONB so we don't need a
-- separate table per chapter / per line:
--   chapters   = [{ at_seconds: 0, label: "Why we're here" }, ...]
--   transcript = [{ at: "00:00", speaker: "ASHA", text: "..." }, ...]
--
-- Public read of published episodes; tutors + admins manage.
-- Anyone can subscribe (anon ok). Admins read the subscriber list.
-- Safe to re-run.
-- ============================================================

-- ---------- episodes ----------
create table if not exists public.podcast_episodes (
  id                uuid primary key default gen_random_uuid(),
  episode_number    int not null unique check (episode_number > 0),
  series            text null,
  title             text not null check (char_length(title) between 4 and 240),
  description       text null,
  host_name         text not null default 'Asha Kimani',
  guest_name        text not null,
  guest_role        text null,
  guest_org         text null,
  guest_quote       text null,
  audio_url         text null,
  duration_seconds  int  not null default 0 check (duration_seconds >= 0),
  chapters          jsonb not null default '[]'::jsonb,
  transcript        jsonb not null default '[]'::jsonb,
  cover_url         text null,
  published_at      date not null default current_date,
  is_published      boolean not null default true,
  view_count        integer not null default 0,
  created_by        uuid null references auth.users(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists podcast_episodes_published_at_idx on public.podcast_episodes(published_at desc);
create index if not exists podcast_episodes_series_idx on public.podcast_episodes(series);

alter table public.podcast_episodes enable row level security;

drop policy if exists "podcast public read" on public.podcast_episodes;
create policy "podcast public read"
  on public.podcast_episodes for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "podcast tutor admin all" on public.podcast_episodes;
create policy "podcast tutor admin all"
  on public.podcast_episodes for all
  to authenticated
  using (public.is_admin() or public.is_tutor())
  with check (public.is_admin() or public.is_tutor());

-- ---------- subscribers ----------
create table if not exists public.podcast_subscribers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid null references auth.users(id) on delete set null,
  email       text not null unique check (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  full_name   text null,
  created_at  timestamptz not null default now()
);

alter table public.podcast_subscribers enable row level security;

drop policy if exists "podcast_sub anyone insert" on public.podcast_subscribers;
create policy "podcast_sub anyone insert"
  on public.podcast_subscribers for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

drop policy if exists "podcast_sub own read" on public.podcast_subscribers;
create policy "podcast_sub own read"
  on public.podcast_subscribers for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "podcast_sub admin all" on public.podcast_subscribers;
create policy "podcast_sub admin all"
  on public.podcast_subscribers for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- view-count RPC ----------
create or replace function public.increment_episode_view(p_episode_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.podcast_episodes
    set view_count = view_count + 1
    where id = p_episode_id;
$$;
grant execute on function public.increment_episode_view(uuid) to anon, authenticated;
