-- ============================================================
-- Webinars: scheduled live sessions + replays.
-- Plus webinar_registrations so people who hit "Register" on an
-- upcoming session land in a list we can email once Resend is
-- wired in Phase 8.
--
-- Public read of published webinars; tutors + admins manage.
-- Anyone (anon ok) can register; admins read the registration list.
-- Safe to re-run.
-- ============================================================

-- ---------- webinars ----------
create table if not exists public.webinars (
  id                uuid primary key default gen_random_uuid(),
  title             text not null check (char_length(title) between 6 and 240),
  description       text null,
  topic             text not null check (topic in (
    'Carbon','Finance','Policy','MRV','Africa','General'
  )),
  speaker_name      text not null,
  speaker_role      text null,
  speaker_org       text null,
  starts_at         timestamptz not null,
  duration_minutes  int  not null default 60 check (duration_minutes between 5 and 480),
  status            text not null default 'upcoming' check (status in (
    'upcoming','live','replay','cancelled'
  )),
  video_url         text null,
  registration_url  text null,
  attendees_count   integer not null default 0,
  visual_variant    text not null default 'orbit' check (visual_variant in (
    'orbit','wave','stack','leaf','map','grid'
  )),
  is_published      boolean not null default true,
  created_by        uuid null references auth.users(id) on delete set null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists webinars_starts_at_idx on public.webinars(starts_at desc);
create index if not exists webinars_status_idx   on public.webinars(status);
create index if not exists webinars_topic_idx    on public.webinars(topic);

alter table public.webinars enable row level security;

drop policy if exists "webinars public read" on public.webinars;
create policy "webinars public read"
  on public.webinars for select
  to anon, authenticated
  using (is_published = true);

drop policy if exists "webinars tutor admin all" on public.webinars;
create policy "webinars tutor admin all"
  on public.webinars for all
  to authenticated
  using (public.is_admin() or public.is_tutor())
  with check (public.is_admin() or public.is_tutor());

-- ---------- webinar_registrations ----------
create table if not exists public.webinar_registrations (
  id              uuid primary key default gen_random_uuid(),
  webinar_id      uuid not null references public.webinars(id) on delete cascade,
  user_id         uuid null references auth.users(id) on delete set null,
  email           text not null check (email ~* '^[^@]+@[^@]+\.[^@]+$'),
  full_name       text null,
  created_at      timestamptz not null default now(),
  unique (webinar_id, email)
);

create index if not exists webinar_registrations_webinar_idx on public.webinar_registrations(webinar_id);

alter table public.webinar_registrations enable row level security;

-- Anyone may register (anon or signed-in)
drop policy if exists "webinar_registrations anyone insert" on public.webinar_registrations;
create policy "webinar_registrations anyone insert"
  on public.webinar_registrations for insert
  to anon, authenticated
  with check (
    user_id is null or user_id = auth.uid()
  );

-- Signed-in users read their own registrations
drop policy if exists "webinar_registrations own read" on public.webinar_registrations;
create policy "webinar_registrations own read"
  on public.webinar_registrations for select
  to authenticated
  using (user_id = auth.uid());

-- Admin manages everything
drop policy if exists "webinar_registrations admin all" on public.webinar_registrations;
create policy "webinar_registrations admin all"
  on public.webinar_registrations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- attendees_count helper RPC ----------
create or replace function public.increment_webinar_attendees(p_webinar_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.webinars
    set attendees_count = attendees_count + 1
    where id = p_webinar_id;
$$;
grant execute on function public.increment_webinar_attendees(uuid) to anon, authenticated;
