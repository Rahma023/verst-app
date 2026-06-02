-- ============================================================
-- Fix: let learners insert their own certificate on a passing
-- quiz attempt. Original schema-001 only granted INSERT to admins
-- via "admins manage certificates" — so submitQuizAttempt silently
-- failed to issue certs for regular users.
--
-- Policy enforces: the caller can only insert for themselves AND
-- only if they have a passed=true quiz_attempts row for the module.
-- Safe to re-run.
-- ============================================================

drop policy if exists "users insert own cert after passing" on public.certificates;
create policy "users insert own cert after passing"
  on public.certificates
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.quiz_attempts qa
      where qa.user_id    = auth.uid()
        and qa.module_id  = certificates.module_id
        and qa.passed     = true
    )
  );

-- ---------- Backfill ----------
-- Issue a certificate for every (user, module) where the user has at
-- least one passing attempt and no cert exists yet. Idempotent.
insert into public.certificates (user_id, module_id, verify_code)
select distinct
  qa.user_id,
  qa.module_id,
  'VC-' || upper(qa.module_id) || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6))
from   public.quiz_attempts qa
where  qa.passed = true
  and  not exists (
    select 1 from public.certificates c
    where c.user_id = qa.user_id and c.module_id = qa.module_id
  );

-- Verification
select
  c.user_id,
  c.module_id,
  c.verify_code,
  c.issued_at
from   public.certificates c
order  by c.issued_at desc;
