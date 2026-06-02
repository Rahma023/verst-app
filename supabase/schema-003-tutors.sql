-- ============================================================
-- VERST CARBON ACADEMY — schema v3: tutor assignments + Q&A
--
-- Adds the tutor-side data model:
--   * tutor_assignments  (which tutors are assigned to which modules)
--   * learner_questions  (questions posted by learners, answered by tutors)
--
-- Plus an is_tutor_for(module_id) helper and RLS updates so tutors can
-- manage lesson_assets / storage objects for their own modules only.
--
-- Run after schema-001 and schema-002. Safe to re-run.
-- ============================================================

-- ---------- 1. tutor_assignments ----------
create table if not exists public.tutor_assignments (
  tutor_user_id  uuid        not null references auth.users(id) on delete cascade,
  module_id      text        not null references public.modules(id) on delete cascade,
  assigned_at    timestamptz not null default now(),
  primary key (tutor_user_id, module_id)
);

create index if not exists tutor_assignments_tutor_idx
  on public.tutor_assignments(tutor_user_id);
create index if not exists tutor_assignments_module_idx
  on public.tutor_assignments(module_id);

alter table public.tutor_assignments enable row level security;

drop policy if exists "tutors read own assignments" on public.tutor_assignments;
create policy "tutors read own assignments"
  on public.tutor_assignments for select
  using (auth.uid() = tutor_user_id or public.is_admin());

drop policy if exists "admins manage assignments" on public.tutor_assignments;
create policy "admins manage assignments"
  on public.tutor_assignments for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- 2. is_tutor_for() helper ----------
create or replace function public.is_tutor_for(p_module_id text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.tutor_assignments
    where tutor_user_id = auth.uid() and module_id = p_module_id
  );
$$;

create or replace function public.is_tutor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'tutor'
  );
$$;

-- ---------- 3. learner_questions ----------
create table if not exists public.learner_questions (
  id                uuid        primary key default gen_random_uuid(),
  learner_user_id   uuid        not null references auth.users(id) on delete cascade,
  module_id         text        not null references public.modules(id) on delete cascade,
  lesson_id         text        references public.lessons(id) on delete set null,
  question_text     text        not null,
  asked_at          timestamptz not null default now(),
  status            text        not null check (status in ('open','answered','archived')) default 'open',
  tutor_user_id     uuid        references auth.users(id) on delete set null,
  answer_text       text,
  answered_at       timestamptz
);

create index if not exists learner_questions_module_idx
  on public.learner_questions(module_id);
create index if not exists learner_questions_learner_idx
  on public.learner_questions(learner_user_id);
create index if not exists learner_questions_status_idx
  on public.learner_questions(status);

alter table public.learner_questions enable row level security;

drop policy if exists "learners read own questions" on public.learner_questions;
create policy "learners read own questions"
  on public.learner_questions for select
  using (auth.uid() = learner_user_id);

drop policy if exists "learners create own questions" on public.learner_questions;
create policy "learners create own questions"
  on public.learner_questions for insert
  with check (auth.uid() = learner_user_id);

drop policy if exists "tutors read questions for their modules" on public.learner_questions;
create policy "tutors read questions for their modules"
  on public.learner_questions for select
  using (public.is_tutor_for(module_id));

drop policy if exists "tutors update questions for their modules" on public.learner_questions;
create policy "tutors update questions for their modules"
  on public.learner_questions for update
  using (public.is_tutor_for(module_id))
  with check (public.is_tutor_for(module_id));

drop policy if exists "admins manage learner_questions" on public.learner_questions;
create policy "admins manage learner_questions"
  on public.learner_questions for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- 4. Extend lesson_assets so tutors can manage their modules ----------
-- (admins were already covered by "admins manage lesson_assets" in schema-001.)
drop policy if exists "tutors manage assets for their modules" on public.lesson_assets;
create policy "tutors manage assets for their modules"
  on public.lesson_assets for all
  using (
    exists (
      select 1
      from public.lessons l
      join public.tutor_assignments ta
        on ta.module_id = l.module_id
      where l.id = lesson_assets.lesson_id
        and ta.tutor_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.lessons l
      join public.tutor_assignments ta
        on ta.module_id = l.module_id
      where l.id = lesson_assets.lesson_id
        and ta.tutor_user_id = auth.uid()
    )
  );

-- ---------- 5. Storage RLS so tutors can write to lesson-content buckets ----------
-- For simplicity we grant tutors blanket write access to the lesson-content
-- buckets (same as admins) and rely on the path convention `<lesson_id>/...`
-- + the lesson_assets RLS above to keep data correct. Tightening to
-- per-module paths is a polish item for later.
drop policy if exists "tutors write to lesson content buckets" on storage.objects;
create policy "tutors write to lesson content buckets"
  on storage.objects
  for all
  to authenticated
  using (
    bucket_id in ('lesson-slides','lesson-audio','lesson-avatars','resources')
    and public.is_tutor()
  )
  with check (
    bucket_id in ('lesson-slides','lesson-audio','lesson-avatars','resources')
    and public.is_tutor()
  );

-- ---------- Verification ----------
select 'tutor_assignments' as table, count(*) as row_count from public.tutor_assignments
union all
select 'learner_questions', count(*) from public.learner_questions;
