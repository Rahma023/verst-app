-- ============================================================
-- Public certificate verification.
--
-- The certificates table is RLS-restricted to the owner (and admins),
-- which is correct for the table itself. But verification needs to be
-- usable by anyone with the verify_code (employers, recruiters, etc.).
--
-- Solution: a SECURITY DEFINER function that exposes only the
-- non-sensitive fields needed to prove authenticity (module title,
-- learner name, issue date, verify code). No user_id leakage, no
-- enumeration possible without knowing the code.
--
-- Safe to re-run.
-- ============================================================

create or replace function public.get_cert_by_verify_code(p_code text)
returns table (
  module_code         text,
  module_title        text,
  issued_at           timestamptz,
  verify_code         text,
  learner_full_name   text
)
language sql
security definer
set search_path = public
stable
as $$
  select
    m.code        as module_code,
    m.title       as module_title,
    c.issued_at,
    c.verify_code,
    p.full_name   as learner_full_name
  from   public.certificates c
  left   join public.modules  m on m.id = c.module_id
  left   join public.profiles p on p.user_id = c.user_id
  where  c.verify_code = p_code;
$$;

grant execute on function public.get_cert_by_verify_code(text) to anon, authenticated;
