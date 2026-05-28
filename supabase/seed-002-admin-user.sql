-- ============================================================
-- Promote rahmafaizyusuf@gmail.com to admin role.
--
-- The signup trigger creates the profiles row automatically;
-- we just flip the role column. Safe to re-run.
-- ============================================================

update public.profiles
set    role = 'admin'
where  user_id in (
  select id from auth.users where email = 'rahmafaizyusuf@gmail.com'
);

-- Verification — should return one row with role = 'admin'.
select
  u.email,
  p.full_name,
  p.role
from   public.profiles p
join   auth.users u on u.id = p.user_id
where  p.role = 'admin';
