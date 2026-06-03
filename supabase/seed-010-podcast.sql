-- ============================================================
-- Seed 5 starter podcast episodes. audio_url is left null —
-- shown as "Audio coming soon" until you upload the real files
-- to Supabase Storage or Cloudflare Stream and update the rows.
--
-- Episode 24 (the latest) has the prototype's chapters +
-- transcript JSON so the right rail looks populated; the rest
-- have empty defaults.
-- Safe to re-run (deletes by episode_number first).
-- ============================================================

delete from public.podcast_episodes where episode_number in (20, 21, 22, 23, 24);

insert into public.podcast_episodes
  (episode_number, series, title, description, host_name, guest_name, guest_role, guest_org,
   guest_quote, duration_seconds, chapters, transcript, published_at)
values
  (24,
   'African Innovators',
   E'Why most carbon credits won''t survive 2027',
   'Procurement policy at the Fortune 500 has hardened around removals + permanence. We unpack what that means for the long tail of avoidance credits — and who survives.',
   'Asha Kimani',
   'Kwame Mensah', 'Project Developer', 'Verra-registered, Ghana',
   E'I''m sceptical of every carbon credit until it has a measurement story, a permanence story, and a price that reflects both.',
   2538, -- 42:18
   E'[
     {"at_seconds": 0,    "label": "Why we''re here"},
     {"at_seconds": 194,  "label": "The 2024 quality discourse, in retrospect"},
     {"at_seconds": 692,  "label": "Microsoft''s purchasing playbook"},
     {"at_seconds": 1148, "label": "What \"removals premium\" actually means"},
     {"at_seconds": 1730, "label": "Who survives 2027"},
     {"at_seconds": 2200, "label": "Advice for a project developer today"}
   ]'::jsonb,
   E'[
     {"at": "00:00", "speaker": "ASHA",  "text": "Kwame, welcome to the Verst podcast."},
     {"at": "00:08", "speaker": "KWAME", "text": "Thanks. Long-time listener, first-time guest."},
     {"at": "00:14", "speaker": "ASHA",  "text": "Let''s start with the thing you said on LinkedIn that got everyone shouting at each other — that most carbon credits won''t survive 2027. Walk me through it."},
     {"at": "00:31", "speaker": "KWAME", "text": "Sure. The thing people miss is that the credit-quality discourse of 2023 and 2024 has hardened into procurement policy at the Fortune 500 level. Microsoft, Google, Stripe — they''ve quietly stopped buying anything that doesn''t have a removals signal and a permanence story."},
     {"at": "00:58", "speaker": "ASHA",  "text": "Even forestry?"},
     {"at": "01:06", "speaker": "KWAME", "text": "Especially forestry. The avoidance-deforestation cohort is essentially uninvestable from a corporate-procurement angle now."},
     {"at": "01:21", "speaker": "ASHA",  "text": "But there''s still buyers — the market hasn''t collapsed."},
     {"at": "01:30", "speaker": "KWAME", "text": "Right. The market has bifurcated. There''s the high-quality $200-a-ton biochar / DAC / mineralisation segment, and then there''s a long tail of $4-a-ton credits being bought by mid-sized European industrials for compliance offsets. The middle has fallen out."}
   ]'::jsonb,
   '2026-05-04'),

  (23,
   'African Innovators',
   'The blue carbon gold-rush',
   'Mangroves, seagrasses, salt marshes — what''s actually verifiable today, and what''s still vibes.',
   'Asha Kimani',
   'Dr. Lerato Sithole', 'Marine ecologist', 'South Africa',
   null,
   2330, -- 38:50
   '[]'::jsonb, '[]'::jsonb,
   '2026-04-27'),

  (22,
   'Finance & Capital',
   'How a Lagos startup priced the first DAC offtake',
   'Founder-led breakdown of pricing a long-term DAC offtake agreement with a European industrial buyer.',
   'Asha Kimani',
   'Tunde Aiyetan', 'Founder', 'Climate Capital · Nigeria',
   null,
   3072, -- 51:12
   '[]'::jsonb, '[]'::jsonb,
   '2026-04-20'),

  (21,
   'Methodology Deep-Dive',
   'MRV is the bottleneck. Now what?',
   'Remote-sensing MRV is maturing, but most projects can''t afford it. We talk about why and what changes the trajectory.',
   'Asha Kimani',
   'Asha Kimani', 'GIS / MRV lead', 'Independent · Kenya',
   null,
   2086, -- 34:46
   '[]'::jsonb, '[]'::jsonb,
   '2026-04-13'),

  (20,
   'Policy Watch',
   'Article 6 explained, slowly',
   'A patient walk-through of Article 6.2, 6.4 and 6.8 — what each one actually does, with examples.',
   'Asha Kimani',
   'Bola Adekunle', 'Climate Policy', 'Nigeria',
   null,
   2762, -- 46:02
   '[]'::jsonb, '[]'::jsonb,
   '2026-04-06');
