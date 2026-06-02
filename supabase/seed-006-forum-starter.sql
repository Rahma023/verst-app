-- ============================================================
-- Seed a few starter forum threads + replies so /forum isn't
-- empty on first visit. Picks ONE learner + ONE tutor + ONE
-- admin dynamically from existing profiles — gracefully skips
-- anything it can't find.
--
-- Safe to re-run: deletes by (title, user_id) match before
-- re-inserting, so it's idempotent without UPSERT.
-- ============================================================

do $$
declare
  v_learner uuid;
  v_tutor   uuid;
  v_admin   uuid;
  v_thread1 uuid;
  v_thread2 uuid;
  v_thread3 uuid;
  v_reply   uuid;
begin
  select user_id into v_learner from public.profiles where role = 'learner' limit 1;
  select user_id into v_tutor   from public.profiles where role = 'tutor'   limit 1;
  select user_id into v_admin   from public.profiles where role = 'admin'   limit 1;

  if v_learner is null then
    raise notice 'No learner profile found — skipping forum seed.';
    return;
  end if;

  -- Clean any previous seed runs so we get a clean slate.
  delete from public.forum_threads where title in (
    'What exactly makes a biochar credit "additional" under VM0044?',
    'M-Pesa payouts for a Kenya cookstove project — what''s the cleanest VVB-friendly structure?',
    'How are people pricing African ARR right now vs Article 6 buyers?'
  );

  -- THREAD 1 ───────────────────────────────────────────
  insert into public.forum_threads (id, user_id, category, title, body, status)
  values (
    gen_random_uuid(),
    v_learner,
    'biochar',
    'What exactly makes a biochar credit "additional" under VM0044?',
    E'I''m a project developer in northern Tanzania building a 12,000-ton/yr biochar facility using cashew-shell feedstock. We''re targeting VM0044 with optional Article-6 authorization.\n\nThe methodology talks about additionality in terms of "common practice", "barrier analysis" and "investment analysis" — but in our region, biochar production is happening at artisanal scale already. Does that disqualify us from a common-practice argument?\n\nAnd how have other developers framed the financial barrier specifically — given that pyrolysis equipment is now available at much lower CapEx than the methodology was originally written for?',
    'open'
  )
  returning id into v_thread1;

  if v_tutor is not null then
    insert into public.forum_replies (id, thread_id, user_id, body)
    values (
      gen_random_uuid(),
      v_thread1,
      v_tutor,
      E'Short version: existing artisanal practice does not disqualify you — what matters is whether industrial-scale biochar with measured, verified carbon removal is common in your geography. It almost certainly is not.\n\nFor your barrier analysis, I''d lean financial + institutional rather than technological:\n\n• Show the levelised cost of removal without credit revenue ≥ break-even\n• Demonstrate the absence of local off-takers or domestic compliance demand\n• Reference the difficulty of accessing pyrolysis equipment financing locally\n\nFor pricing context — three Kenyan biochar projects closed VM0044 validation in 2025 using exactly this framing. Happy to share the public summaries.'
    )
    returning id into v_reply;
    -- mark the tutor reply as accepted (running as service role, so we
    -- can write directly without going through the accept_forum_reply RPC)
    update public.forum_replies set is_accepted = true where id = v_reply;
    update public.forum_threads
      set accepted_reply_id = v_reply, status = 'answered'
      where id = v_thread1;
  end if;

  if v_admin is not null then
    insert into public.forum_replies (id, thread_id, user_id, body)
    values (
      gen_random_uuid(),
      v_thread1,
      v_admin,
      E'Echoing the framing above — we''ve seen success quoting the actual cost gap and being explicit about uncertainty. Strong narratives don''t hand-wave.'
    );
  end if;

  -- THREAD 2 ───────────────────────────────────────────
  insert into public.forum_threads (id, user_id, category, title, body, status)
  values (
    gen_random_uuid(),
    coalesce(v_tutor, v_learner),
    'fin',
    E'M-Pesa payouts for a Kenya cookstove project — what''s the cleanest VVB-friendly structure?',
    E'Setting up benefit-sharing for a 35,000-household clean cooking project in Murang''a. We want to pay end-users directly via M-Pesa twice a year.\n\nQuestions: (1) how do you log payments in an auditable way the VVB will accept — the screenshots feel weak. (2) any examples of a "payment receipt" template that survived validation? (3) is there an FX hedging concern when the credit is sold in USD but distributed in KES?',
    'open'
  )
  returning id into v_thread2;

  if v_admin is not null then
    insert into public.forum_replies (id, thread_id, user_id, body)
    values (
      gen_random_uuid(),
      v_thread2,
      v_admin,
      E'Three things worked for us on a similar project:\n\n1. Pull the M-Pesa transaction CSV via Safaricom''s daraja API monthly and hash-anchor each batch to a public timestamping service. That gives the VVB a single line to verify.\n\n2. SMS receipts with a one-time code that beneficiaries can present in spot audits.\n\n3. FX-wise: we held 4 months of KES on hand and bought USD-KES forwards only when credit-sale timing aligned. Don''t over-hedge — it eats into community benefit.'
    );
  end if;

  -- THREAD 3 ───────────────────────────────────────────
  insert into public.forum_threads (id, user_id, category, title, body)
  values (
    gen_random_uuid(),
    v_learner,
    'fin',
    'How are people pricing African ARR right now vs Article 6 buyers?',
    E'Scoping a 4,000ha Acacia + native species mosaic in northern Kenya. Verra ARR vs a host-country authorized Article 6.4 unit — radically different price discovery.\n\nWhat are folks actually seeing in 2026 for: (a) Verra ARR ex-ante from East Africa, (b) Article 6.4 authorized with corresponding adjustments, (c) bilateral A6 deals with Japan / Korea / Switzerland?\n\nGenuinely asking — most published price ranges feel 6 months stale.'
  );
end$$;
