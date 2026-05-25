-- ============================================================
-- VERST CARBON ACADEMY — seed: modules + lessons
--
-- Mirrors the COURSES array in src/data/courses.ts. Safe to re-run
-- (UPSERT on id, all columns refreshed). 9 modules + 48 lessons.
-- Run after schema-001-initial.sql.
-- ============================================================

-- ---------- MODULES ----------
insert into public.modules
  (id, code, section, title, subtitle, category, duration, level, certifies, price_text, visual, glass_icon, lesson_count, order_index, status, instructor_name, instructor_role, published)
values
  ('a1', 'A.1', 'A', 'Foundations of AI for Climate',
   'A practitioner''s primer to the AI stack used in climate work.',
   'AI Foundations', '~4 weeks · 28 h', 'Beginner', true, 'Free', 'grid', 'sparkle',
   5, 1, 'in-production', 'Asha Kimani', 'GIS / MRV · Kenya', true),

  ('a2', 'A.2', 'A', 'AI for Carbon Monitoring & MRV',
   'Remote sensing, satellite imagery, and ML-driven measurement.',
   'MRV', '~5 weeks · 35 h', 'Intermediate', true, '$49', 'map', 'globe',
   6, 2, 'in-production', 'Asha Kimani', 'GIS / MRV · Kenya', true),

  ('a3', 'A.3', 'A', 'AI for Climate Modelling & Adaptation',
   'From digital twins to early-warning systems.',
   'Adaptation', '~4 weeks · 28 h', 'Advanced', true, '$49', 'wave', 'chart',
   5, 3, 'planned', 'Dr. Lerato Sithole', 'Climate Scientist · S. Africa', true),

  ('a4', 'A.4', 'A', 'Generative AI for Sustainability Teams',
   'Practical LLM workflows for ESG, reporting and project ops.',
   'AI Applications', '~3 weeks · 21 h', 'Beginner', true, 'Free', 'stack', 'wand',
   4, 4, 'planned', 'Tunde Aiyetan', 'Sustainability Director', true),

  ('m1', 'I', 'B', 'Introduction to Carbon Markets',
   'The foundation. How the world prices climate.',
   'Foundations', '~6 weeks · 42 h', 'Beginner', true, 'Free', 'orbit', 'globe',
   6, 5, 'live', 'Dr. Amaka Eze', 'UNFCCC Observer', true),

  ('m2', 'II', 'B', 'Organizational Level GHG Accounting',
   'ISO 14064-1 — the full scope of emissions you own.',
   'Corporate Reporting', '~5 weeks · 35 h', 'Intermediate', true, 'Free', 'stack', 'users',
   5, 6, 'live', 'Tunde Aiyetan', 'Sustainability Director', true),

  ('m3', 'III', 'B', 'Project Level GHG Accounting',
   'ISO 14064-2 — building a real, verifiable carbon project.',
   'Project Development', '~6 weeks · 42 h', 'Intermediate', true, '$49', 'leaf', 'leaf',
   6, 7, 'in-production', 'Kwame Mensah', 'Project Developer · Ghana', true),

  ('m4', 'IV', 'B', 'Carbon Finance',
   'From the climate-finance stack to a signed offtake.',
   'Finance', '~5 weeks · 35 h', 'Advanced', true, '$49', 'map', 'chart',
   5, 8, 'recording', 'Naledi Mokoena', 'Climate Finance Lead', true),

  ('m5', 'V', 'B', 'Article 6 of the Paris Agreement',
   'The global rulebook — from Kyoto to corresponding adjustments.',
   'Policy', '~6 weeks · 42 h', 'Advanced', true, '$49', 'wave', 'flag',
   6, 9, 'live', 'Dr. Lerato Sithole', 'Climate Policy · S. Africa', true)
on conflict (id) do update set
  code             = excluded.code,
  section          = excluded.section,
  title            = excluded.title,
  subtitle         = excluded.subtitle,
  category         = excluded.category,
  duration         = excluded.duration,
  level            = excluded.level,
  certifies        = excluded.certifies,
  price_text       = excluded.price_text,
  visual           = excluded.visual,
  glass_icon       = excluded.glass_icon,
  lesson_count     = excluded.lesson_count,
  order_index      = excluded.order_index,
  status           = excluded.status,
  instructor_name  = excluded.instructor_name,
  instructor_role  = excluded.instructor_role,
  published        = excluded.published;

-- ---------- LESSONS ----------
insert into public.lessons (id, module_id, code, title, duration, order_index, state) values
  -- a1 — Foundations of AI for Climate
  ('A.1.1', 'a1', 'A.1.1', 'What AI actually is — and isn''t',                       '5 h', 1, 'content'),
  ('A.1.2', 'a1', 'A.1.2', 'Machine learning vs. statistics vs. heuristics',         '6 h', 2, 'content'),
  ('A.1.3', 'a1', 'A.1.3', 'Large language models for climate',                       '6 h', 3, 'content'),
  ('A.1.4', 'a1', 'A.1.4', 'Data ethics & climate justice in AI',                     '5 h', 4, 'content'),
  ('A.1.5', 'a1', 'A.1.5', 'Choosing an AI tool for your project',                    '6 h', 5, 'content'),

  -- a2 — AI for Carbon Monitoring & MRV
  ('A.2.1', 'a2', 'A.2.1', 'Satellite imagery basics for climate',                    '6 h', 1, 'content'),
  ('A.2.2', 'a2', 'A.2.2', 'Computer vision for land-cover detection',                '6 h', 2, 'content'),
  ('A.2.3', 'a2', 'A.2.3', 'Forest carbon estimation with ML',                        '6 h', 3, 'content'),
  ('A.2.4', 'a2', 'A.2.4', 'Soil carbon — sensors + models',                          '6 h', 4, 'content'),
  ('A.2.5', 'a2', 'A.2.5', 'Continuous MRV pipelines',                                '6 h', 5, 'content'),
  ('A.2.6', 'a2', 'A.2.6', 'Auditing AI-generated MRV data',                          '5 h', 6, 'content'),

  -- a3 — AI for Climate Modelling
  ('A.3.1', 'a3', 'A.3.1', 'Climate model ensembles, explained',                      '5 h', 1, 'planned'),
  ('A.3.2', 'a3', 'A.3.2', 'ML downscaling for African regions',                      '6 h', 2, 'planned'),
  ('A.3.3', 'a3', 'A.3.3', 'Drought, flood & wildfire forecasting',                   '6 h', 3, 'planned'),
  ('A.3.4', 'a3', 'A.3.4', 'Digital twins for cities',                                '6 h', 4, 'planned'),
  ('A.3.5', 'a3', 'A.3.5', 'Designing AI-driven early-warning systems',               '5 h', 5, 'planned'),

  -- a4 — Generative AI for Sustainability Teams
  ('A.4.1', 'a4', 'A.4.1', 'Prompting for sustainability work',                       '5 h', 1, 'planned'),
  ('A.4.2', 'a4', 'A.4.2', 'Drafting ESG and TCFD reports with AI',                   '6 h', 2, 'planned'),
  ('A.4.3', 'a4', 'A.4.3', 'RAG over your methodology library',                       '5 h', 3, 'planned'),
  ('A.4.4', 'a4', 'A.4.4', 'Governance, hallucinations & disclosure',                 '5 h', 4, 'planned'),

  -- m1 — Introduction to Carbon Markets (pilot module)
  ('1.1', 'm1', '1.1', 'The Science of Climate Change',                               '7 h', 1, 'qa'),
  ('1.2', 'm1', '1.2', 'Key Terminologies in Climate Science & Carbon Markets',       '7 h', 2, 'qa'),
  ('1.3', 'm1', '1.3', 'Carbon Markets Ecosystem',                                    '7 h', 3, 'content'),
  ('1.4', 'm1', '1.4', 'Carbon Offsets Project Types',                                '7 h', 4, 'content'),
  ('1.5', 'm1', '1.5', 'Carbon Credit Pricing',                                       '7 h', 5, 'content'),
  ('1.6', 'm1', '1.6', 'Innovations in Carbon Markets',                               '7 h', 6, 'content'),

  -- m2 — Organizational Level GHG Accounting
  ('2.1', 'm2', '2.1', 'Foundational Concepts (ISO 14064-1:2018)',                    '7 h', 1, 'content'),
  ('2.2', 'm2', '2.2', 'Scope 1 Emissions',                                           '7 h', 2, 'content'),
  ('2.3', 'm2', '2.3', 'Scope 2 Emissions',                                           '7 h', 3, 'content'),
  ('2.4', 'm2', '2.4', 'Scope 3 Emissions',                                           '7 h', 4, 'content'),
  ('2.5', 'm2', '2.5', 'Carbon Neutrality (ISO 14068-1:2023)',                        '7 h', 5, 'content'),

  -- m3 — Project Level GHG Accounting
  ('3.1', 'm3', '3.1', 'Foundational Concepts (ISO 14064-2:2018)',                    '7 h', 1, 'content'),
  ('3.2', 'm3', '3.2', 'Carbon Methodology',                                          '7 h', 2, 'content'),
  ('3.3', 'm3', '3.3', 'Carbon Project Cycle',                                        '7 h', 3, 'content'),
  ('3.4', 'm3', '3.4', 'Additionality of Carbon Projects',                            '7 h', 4, 'content'),
  ('3.5', 'm3', '3.5', 'Quantifying GHG Reductions',                                  '7 h', 5, 'content'),
  ('3.6', 'm3', '3.6', 'Monitoring, Reporting & Verification Systems',                '7 h', 6, 'content'),

  -- m4 — Carbon Finance
  ('4.1', 'm4', '4.1', 'Global Landscape of Climate Finance',                         '7 h', 1, 'content'),
  ('4.2', 'm4', '4.2', 'Types of Carbon Finance',                                     '7 h', 2, 'content'),
  ('4.3', 'm4', '4.3', 'Investment Structures',                                       '7 h', 3, 'content'),
  ('4.4', 'm4', '4.4', 'Benefit-Sharing Mechanisms',                                  '7 h', 4, 'content'),
  ('4.5', 'm4', '4.5', 'Carbon Pricing',                                              '7 h', 5, 'content'),

  -- m5 — Article 6 of the Paris Agreement
  ('5.1', 'm5', '5.1', 'Nationally Determined Contributions (NDCs)',                  '7 h', 1, 'content'),
  ('5.2', 'm5', '5.2', 'Kyoto Protocol',                                              '7 h', 2, 'content'),
  ('5.3', 'm5', '5.3', 'Article 6.2',                                                 '7 h', 3, 'content'),
  ('5.4', 'm5', '5.4', 'Article 6.4',                                                 '7 h', 4, 'content'),
  ('5.5', 'm5', '5.5', 'Article 6.8',                                                 '7 h', 5, 'content'),
  ('5.6', 'm5', '5.6', 'Global Stocktake',                                            '7 h', 6, 'content')
on conflict (id) do update set
  module_id   = excluded.module_id,
  code        = excluded.code,
  title       = excluded.title,
  duration    = excluded.duration,
  order_index = excluded.order_index,
  state       = excluded.state;

-- ---------- VERIFICATION ----------
-- Should return 9 and 48.
select 'modules' as table, count(*) as row_count from public.modules
union all
select 'lessons', count(*) from public.lessons;
