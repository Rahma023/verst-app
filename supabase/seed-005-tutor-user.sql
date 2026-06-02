-- ============================================================
-- Promote tutor@verst.earth to tutor role and assign them to
-- Module I (Introduction to Carbon Markets) for testing.
-- Safe to re-run.
--
-- Run AFTER tutor@verst.earth has signed up via the website
-- (the signup trigger creates the matching profiles row).
-- ============================================================

-- 1. Flip the role on profiles
update public.profiles
set    role = 'tutor'
where  user_id in (
  select id from auth.users where email = 'tutor@verst.earth'
);

-- 2. Assign them to Module I
insert into public.tutor_assignments (tutor_user_id, module_id)
select id, 'm1'
from   auth.users
where  email = 'tutor@verst.earth'
on conflict do nothing;

-- Verification — should return one row.
select
  u.email,
  p.full_name,
  p.role,
  array_agg(ta.module_id order by ta.module_id) as assigned_modules
from   auth.users u
join   public.profiles p on p.user_id = u.id
left   join public.tutor_assignments ta on ta.tutor_user_id = u.id
where  u.email = 'tutor@verst.earth'
group  by u.email, p.full_name, p.role;
