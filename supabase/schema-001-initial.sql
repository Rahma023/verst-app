-- ============================================================
-- VERST CARBON ACADEMY — initial schema, v1 (2026-05-25)
--
-- One transaction; safe to re-run (uses IF EXISTS / OR REPLACE).
-- Run this in Supabase Dashboard -> SQL Editor.
--
-- Tables created:
--   profiles          (1:1 with auth.users — name, role, org, country)
--   modules           (the 9 program modules)
--   lessons           (28 lessons total, FK to modules)
--   lesson_assets     (slide decks, voice-over, avatar video, resources)
--   enrolments        (which learner is on which module)
--   lesson_progress   (per-learner per-lesson playback position + completion)
--   quiz_questions    (5 questions per module bank)
--   quiz_attempts     (each scored quiz attempt)
--   certificates      (issued on quiz pass + full progress)
--
-- RLS is enabled on every public table. Default stance: anonymous users
-- can read published catalogue (modules/lessons/lesson_assets) but
-- nothing else. Authenticated users see their own rows in user-scoped
-- tables. Admins (profiles.role = 'admin') see and manage everything.
-- ============================================================

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table if not exists public.profiles (
  user_id           uuid        primary key references auth.users(id) on delete cascade,
  full_name         text,
  role              text        not null check (role in ('learner','tutor','admin')) default 'learner',
  organization      text,
  country           text,
  years_experience  int,
  job_role          text,
  bio               text,
  avatar_url        text,
  promo_opt_in      boolean     not null default false,
  signup_role       text,
  signup_goal       text,
  signup_hear       text,
  created_at        timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles readable to all" on public.profiles;
create policy "profiles readable to all"
  on public.profiles for select using (true);

drop policy if exists "users update their own profile" on public.profiles;
create policy "users update their own profile"
  on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create a profile row whenever a new auth.users row appears.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin helper — used in RLS policies below.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- 2. MODULES (the program catalogue)
-- ============================================================
create table if not exists public.modules (
  id                text        primary key,                                -- 'm1', 'a1'
  code              text        not null,                                   -- 'I', 'II', 'A.1'
  section           text        not null check (section in ('A','B')),
  title             text        not null,
  subtitle          text        not null,
  category          text        not null,
  duration          text        not null,
  level             text        not null check (level in ('Beginner','Intermediate','Advanced')),
  certifies         boolean     not null default true,
  price_text        text        not null default 'Free',
  visual            text        not null default 'orbit',
  glass_icon        text        not null default 'leaf',
  lesson_count      int         not null default 0,
  order_index       int         not null default 0,
  status            text        not null check (status in ('live','in-production','recording','planned')) default 'planned',
  instructor_name   text,
  instructor_role   text,
  published         boolean     not null default true,
  created_at        timestamptz not null default now()
);

alter table public.modules enable row level security;

drop policy if exists "anyone reads published modules" on public.modules;
create policy "anyone reads published modules"
  on public.modules for select using (published = true);

drop policy if exists "admins manage modules" on public.modules;
create policy "admins manage modules"
  on public.modules for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- 3. LESSONS
-- ============================================================
create table if not exists public.lessons (
  id              text        primary key,                                  -- '1.1', 'A.2.3'
  module_id       text        not null references public.modules(id) on delete cascade,
  code            text        not null,
  title           text        not null,
  duration        text        not null,
  order_index     int         not null default 0,
  state           text        not null check (state in ('content','qa','planned')) default 'planned',
  transcript_text text,
  created_at      timestamptz not null default now()
);

create index if not exists lessons_module_id_idx on public.lessons(module_id);

alter table public.lessons enable row level security;

drop policy if exists "anyone reads lessons of published modules" on public.lessons;
create policy "anyone reads lessons of published modules"
  on public.lessons for select
  using (
    exists (select 1 from public.modules m where m.id = lessons.module_id and m.published = true)
  );

drop policy if exists "admins manage lessons" on public.lessons;
create policy "admins manage lessons"
  on public.lessons for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- 4. LESSON ASSETS (slide deck, voice-over MP3, avatar video, resource)
-- ============================================================
create table if not exists public.lesson_assets (
  id          uuid        primary key default gen_random_uuid(),
  lesson_id   text        not null references public.lessons(id) on delete cascade,
  type        text        not null check (type in ('slide_deck','voice_over','avatar_video','resource')),
  file_url    text        not null,
  filename    text,
  size_bytes  bigint,
  uploaded_by uuid        references auth.users(id),
  uploaded_at timestamptz not null default now()
);

create index if not exists lesson_assets_lesson_id_idx on public.lesson_assets(lesson_id);

alter table public.lesson_assets enable row level security;

drop policy if exists "anyone reads assets of published modules" on public.lesson_assets;
create policy "anyone reads assets of published modules"
  on public.lesson_assets for select
  using (
    exists (
      select 1
      from public.lessons l
      join public.modules m on m.id = l.module_id
      where l.id = lesson_assets.lesson_id and m.published = true
    )
  );

drop policy if exists "admins manage lesson_assets" on public.lesson_assets;
create policy "admins manage lesson_assets"
  on public.lesson_assets for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- 5. ENROLMENTS
-- ============================================================
create table if not exists public.enrolments (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references auth.users(id) on delete cascade,
  module_id         text        not null references public.modules(id) on delete cascade,
  org_at_enrol      text,
  country_at_enrol  text,
  goal_text         text,
  status            text        not null check (status in ('active','completed','dropped')) default 'active',
  enrolled_at       timestamptz not null default now(),
  unique (user_id, module_id)
);

create index if not exists enrolments_user_id_idx on public.enrolments(user_id);

alter table public.enrolments enable row level security;

drop policy if exists "users read own enrolments" on public.enrolments;
create policy "users read own enrolments"
  on public.enrolments for select using (auth.uid() = user_id);

drop policy if exists "users create own enrolments" on public.enrolments;
create policy "users create own enrolments"
  on public.enrolments for insert with check (auth.uid() = user_id);

drop policy if exists "admins manage enrolments" on public.enrolments;
create policy "admins manage enrolments"
  on public.enrolments for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- 6. LESSON PROGRESS
-- ============================================================
create table if not exists public.lesson_progress (
  user_id               uuid        not null references auth.users(id) on delete cascade,
  lesson_id             text        not null references public.lessons(id) on delete cascade,
  percent_complete      int         not null default 0 check (percent_complete between 0 and 100),
  last_position_seconds int         not null default 0,
  completed_at          timestamptz,
  updated_at            timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

drop policy if exists "users manage own progress" on public.lesson_progress;
create policy "users manage own progress"
  on public.lesson_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- 7. QUIZ QUESTIONS
-- ============================================================
create table if not exists public.quiz_questions (
  id            uuid        primary key default gen_random_uuid(),
  module_id     text        not null references public.modules(id) on delete cascade,
  question_text text        not null,
  options       jsonb       not null,                                        -- ["Option A", "Option B", ...]
  correct_index int         not null,
  order_index   int         not null default 0
);

create index if not exists quiz_questions_module_id_idx on public.quiz_questions(module_id);

alter table public.quiz_questions enable row level security;

drop policy if exists "enrolled users read questions" on public.quiz_questions;
create policy "enrolled users read questions"
  on public.quiz_questions for select
  using (
    exists (
      select 1 from public.enrolments e
      where e.user_id = auth.uid() and e.module_id = quiz_questions.module_id
    )
  );

drop policy if exists "admins manage quiz_questions" on public.quiz_questions;
create policy "admins manage quiz_questions"
  on public.quiz_questions for all
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- 8. QUIZ ATTEMPTS
-- ============================================================
create table if not exists public.quiz_attempts (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users(id) on delete cascade,
  module_id     text        not null references public.modules(id) on delete cascade,
  score_percent int         not null check (score_percent between 0 and 100),
  passed        boolean     not null,
  answers       jsonb,
  attempted_at  timestamptz not null default now()
);

alter table public.quiz_attempts enable row level security;

drop policy if exists "users read own attempts" on public.quiz_attempts;
create policy "users read own attempts"
  on public.quiz_attempts for select using (auth.uid() = user_id);

drop policy if exists "users create own attempts" on public.quiz_attempts;
create policy "users create own attempts"
  on public.quiz_attempts for insert with check (auth.uid() = user_id);

drop policy if exists "admins read attempts" on public.quiz_attempts;
create policy "admins read attempts"
  on public.quiz_attempts for select using (public.is_admin());

-- ============================================================
-- 9. CERTIFICATES
-- ============================================================
create table if not exists public.certificates (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  module_id   text        references public.modules(id) on delete cascade, -- null = full-program cert
  verify_code text        unique not null,
  issued_at   timestamptz not null default now()
);

alter table public.certificates enable row level security;

drop policy if exists "users read own certificates" on public.certificates;
create policy "users read own certificates"
  on public.certificates for select using (auth.uid() = user_id);

drop policy if exists "admins manage certificates" on public.certificates;
create policy "admins manage certificates"
  on public.certificates for all
  using (public.is_admin()) with check (public.is_admin());
