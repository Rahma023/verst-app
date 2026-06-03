-- ============================================================
-- Donations: capture donation intent now, wire payment provider
-- (Stripe + Paystack) later in Phase 7.
--
-- For now `status` defaults to 'pending_setup' — the page records
-- the donor's intent, shows a thank-you screen, and the founder
-- gets visibility into demand before the PSP is live. Once Stripe /
-- Paystack are connected, the same row gets updated to 'paid'.
--
-- Anyone (anon or authed) can INSERT — donations don't require
-- sign-in. Only admins read the table; donors can read their own
-- rows when signed in.
--
-- Safe to re-run.
-- ============================================================

create table if not exists public.donations (
  id              uuid primary key default gen_random_uuid(),
  donor_user_id   uuid null references auth.users(id) on delete set null,
  donor_email     text not null check (donor_email ~* '^[^@]+@[^@]+\.[^@]+$'),
  donor_name      text null,
  amount_usd      numeric(10,2) not null check (amount_usd > 0 and amount_usd <= 100000),
  is_monthly      boolean not null default false,
  payment_method  text not null check (payment_method in ('mpesa','card','paypal')),
  status          text not null default 'pending_setup' check (
    status in ('pending_setup','pending','paid','failed','cancelled')
  ),
  provider_ref    text null,
  message         text null,
  created_at      timestamptz not null default now(),
  paid_at         timestamptz null
);

create index if not exists donations_created_at_idx on public.donations(created_at desc);
create index if not exists donations_donor_email_idx on public.donations(donor_email);
create index if not exists donations_donor_user_id_idx on public.donations(donor_user_id);

alter table public.donations enable row level security;

-- Anyone can insert a donation row (anon donors are welcome).
drop policy if exists "donations anyone insert" on public.donations;
create policy "donations anyone insert"
  on public.donations for insert
  to anon, authenticated
  with check (
    -- a signed-in donor can only attach their own user_id (or null);
    -- anon donors set it to null.
    donor_user_id is null
    or donor_user_id = auth.uid()
  );

-- A signed-in donor can read their own donation rows.
drop policy if exists "donations donor read own" on public.donations;
create policy "donations donor read own"
  on public.donations for select
  to authenticated
  using (donor_user_id = auth.uid());

-- Admins read + manage everything.
drop policy if exists "donations admin all" on public.donations;
create policy "donations admin all"
  on public.donations for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
