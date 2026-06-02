-- ============================================================
-- Forum: threads + replies.
--
-- Design choices:
--  * Threads are publicly readable (anon + authenticated). Anyone with the
--    URL can browse — useful for SEO and for the public moderator wall.
--  * Posting requires sign-in.
--  * Categories are stored as a slug (text) with a CHECK constraint so we
--    catch typos at the DB layer. The list mirrors the prototype's design.
--  * Vote / view tallies are columns on the row; we increment them with
--    SECURITY DEFINER triggers so RLS doesn't block the count update when
--    another user posts a reply.
--  * accepted_reply_id is set via the accept_forum_reply RPC; only the
--    thread author can call it.
--
-- Safe to re-run.
-- ============================================================

-- ---------- TABLES ----------
create table if not exists public.forum_threads (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  category          text not null check (category in (
    'carbon','method','mrv','biochar','blue','fin','policy','africa','general'
  )),
  title             text not null check (char_length(title) between 8 and 240),
  body              text not null check (char_length(body) >= 20),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  reply_count       int  not null default 0,
  view_count        int  not null default 0,
  status            text not null default 'open' check (status in ('open','answered','closed')),
  accepted_reply_id uuid null
);

create index if not exists forum_threads_category_idx on public.forum_threads(category);
create index if not exists forum_threads_created_at_idx on public.forum_threads(created_at desc);
create index if not exists forum_threads_user_id_idx on public.forum_threads(user_id);

create table if not exists public.forum_replies (
  id              uuid primary key default gen_random_uuid(),
  thread_id       uuid not null references public.forum_threads(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  parent_reply_id uuid null references public.forum_replies(id) on delete cascade,
  body            text not null check (char_length(body) >= 5),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  is_accepted     bool not null default false
);

create index if not exists forum_replies_thread_idx on public.forum_replies(thread_id);
create index if not exists forum_replies_created_at_idx on public.forum_replies(created_at);

-- FK on the accepted_reply_id column (had to defer creation until forum_replies existed)
alter table public.forum_threads
  drop constraint if exists forum_threads_accepted_reply_fk;
alter table public.forum_threads
  add  constraint forum_threads_accepted_reply_fk
       foreign key (accepted_reply_id)
       references public.forum_replies(id) on delete set null;

-- ---------- RLS ----------
alter table public.forum_threads enable row level security;
alter table public.forum_replies enable row level security;

-- Public read
drop policy if exists "forum_threads public read" on public.forum_threads;
create policy "forum_threads public read"
  on public.forum_threads for select
  to anon, authenticated
  using (true);

drop policy if exists "forum_replies public read" on public.forum_replies;
create policy "forum_replies public read"
  on public.forum_replies for select
  to anon, authenticated
  using (true);

-- Authenticated insert (own)
drop policy if exists "forum_threads owner insert" on public.forum_threads;
create policy "forum_threads owner insert"
  on public.forum_threads for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "forum_replies owner insert" on public.forum_replies;
create policy "forum_replies owner insert"
  on public.forum_replies for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Owner update (edit own thread/reply)
drop policy if exists "forum_threads owner update" on public.forum_threads;
create policy "forum_threads owner update"
  on public.forum_threads for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "forum_replies owner update" on public.forum_replies;
create policy "forum_replies owner update"
  on public.forum_replies for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Owner delete
drop policy if exists "forum_threads owner delete" on public.forum_threads;
create policy "forum_threads owner delete"
  on public.forum_threads for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "forum_replies owner delete" on public.forum_replies;
create policy "forum_replies owner delete"
  on public.forum_replies for delete
  to authenticated
  using (auth.uid() = user_id);

-- Admin manages everything
drop policy if exists "forum_threads admin all" on public.forum_threads;
create policy "forum_threads admin all"
  on public.forum_threads for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "forum_replies admin all" on public.forum_replies;
create policy "forum_replies admin all"
  on public.forum_replies for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- TRIGGERS ----------
-- Keep reply_count + updated_at in sync as replies are added / removed.
create or replace function public.bump_thread_reply_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.forum_threads
    set reply_count = reply_count + 1,
        updated_at  = now()
    where id = NEW.thread_id;
  return NEW;
end;
$$;
drop trigger if exists trg_forum_reply_count on public.forum_replies;
create trigger trg_forum_reply_count
  after insert on public.forum_replies
  for each row execute function public.bump_thread_reply_count();

create or replace function public.decrement_thread_reply_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.forum_threads
    set reply_count = greatest(0, reply_count - 1)
    where id = OLD.thread_id;
  return OLD;
end;
$$;
drop trigger if exists trg_forum_reply_decrement on public.forum_replies;
create trigger trg_forum_reply_decrement
  after delete on public.forum_replies
  for each row execute function public.decrement_thread_reply_count();

-- ---------- ACCEPT-REPLY RPC ----------
-- Only the thread author can mark one of their thread's replies as accepted.
-- Clears any previously-accepted reply on the same thread.
create or replace function public.accept_forum_reply(p_reply_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_thread_id    uuid;
  v_thread_owner uuid;
begin
  select fr.thread_id, ft.user_id
    into v_thread_id, v_thread_owner
    from public.forum_replies fr
    join public.forum_threads ft on ft.id = fr.thread_id
    where fr.id = p_reply_id;

  if v_thread_id is null then
    raise exception 'reply not found';
  end if;
  if v_thread_owner <> auth.uid() then
    raise exception 'only the thread author can accept a reply';
  end if;

  update public.forum_replies set is_accepted = false where thread_id = v_thread_id;
  update public.forum_replies set is_accepted = true  where id = p_reply_id;
  update public.forum_threads
    set accepted_reply_id = p_reply_id,
        status            = 'answered'
    where id = v_thread_id;
end;
$$;
grant execute on function public.accept_forum_reply(uuid) to authenticated;

-- ---------- VIEW-COUNT RPC ----------
-- Cheap, fire-and-forget increment from the thread detail page.
create or replace function public.increment_thread_view_count(p_thread_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.forum_threads
    set view_count = view_count + 1
    where id = p_thread_id;
$$;
grant execute on function public.increment_thread_view_count(uuid) to anon, authenticated;
