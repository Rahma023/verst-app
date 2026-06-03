-- ============================================================
-- Seed the webinars catalogue with 6 sessions: 1 live, 2 upcoming,
-- 3 replays. Dates relative to today (2026-06) so they look fresh.
-- Safe to re-run (deletes by exact title match first).
-- ============================================================

delete from public.webinars where title in (
  'Article 6.2 corresponding adjustments: what changed in 2026',
  'Pricing biochar credits: inside the latest auction',
  'Mangrove restoration: lessons from the Tana Delta',
  'How African DACs are pricing offtake',
  'MRV with remote sensing — a practitioner Q&A',
  'Inside the new Puro standard for biochar'
);

insert into public.webinars
  (title, description, topic, speaker_name, speaker_role, speaker_org,
   starts_at, duration_minutes, status, video_url, attendees_count, visual_variant)
values
  ('Article 6.2 corresponding adjustments: what changed in 2026',
   'A practitioner walk-through of how host-country authorization for ITMOs is being structured in 2026 — what bilateral deals look like and what landed differently than expected.',
   'Policy',
   'Dr. Amaka Eze', 'UNFCCC Observer', 'Independent',
   now() + interval '2 hours', 60, 'live',
   null, 1204, 'grid'),

  ('Pricing biochar credits: inside the latest auction',
   'Recap of the latest Puro biochar auction — bid range, who cleared, what the curve looked like.',
   'Carbon',
   'Kwame Mensah', 'Project Developer', 'Verra-registered, Ghana',
   now() + interval '6 days', 60, 'upcoming',
   null, 0, 'stack'),

  ('M-Pesa payouts for community carbon: a how-to',
   'Live demo of structuring auditable benefit-sharing for a cookstove project on M-Pesa, with the documentation a VVB will accept.',
   'MRV',
   'Asha Kimani', 'GIS / MRV lead', 'Independent · Kenya',
   now() + interval '13 days', 75, 'upcoming',
   null, 0, 'wave'),

  ('Mangrove restoration: lessons from the Tana Delta',
   'A 60-min field debrief from a 2,400-hectare mangrove restoration concession — what worked, what was harder than expected, what verification looked like.',
   'Africa',
   'Dr. Lerato Sithole', 'Marine ecologist · S. Africa', 'IUCN',
   now() - interval '14 days', 60, 'replay',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', 480, 'wave'),

  ('How African DACs are pricing offtake',
   'Founder-led discussion on direct-air-capture offtake structures, focusing on three African DAC projects negotiating long-term offtake agreements.',
   'Finance',
   'Tunde Aiyetan', 'Founder', 'Climate Capital · Nigeria',
   now() - interval '21 days', 55, 'replay',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', 612, 'map'),

  ('Inside the new Puro standard for biochar',
   'Methodology author Bola Adekunle walks through the changes in the new Puro biochar standard and what they mean for active projects.',
   'Carbon',
   'Bola Adekunle', 'Methodology lead', 'Puro.earth',
   now() - interval '56 days', 50, 'replay',
   'https://www.youtube.com/embed/dQw4w9WgXcQ', 891, 'leaf');
