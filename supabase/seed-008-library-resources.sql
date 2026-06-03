-- ============================================================
-- Seed the library with starter resources. Mostly links to
-- third-party public docs so /library isn't empty on first visit.
-- Verst-original briefs use placeholder external_url='#' and will
-- be replaced once the docs are produced + uploaded to Storage.
-- Safe to re-run (deletes by exact title match first).
-- ============================================================

delete from public.library_resources where title in (
  'VM0044 — Biochar in soils',
  'Puro.earth Standard v3.1',
  'Isometric Protocol — Carbon Removal',
  'VCM Buyers List 2026',
  'Project Financial-Model Template',
  'MRV Field Checklist',
  'Climate Glossary 2026',
  'Africa Carbon Markets — State of Play',
  'Article 6 — Plain-English explainer'
);

insert into public.library_resources
  (title, description, category, topic, file_type, file_size_bytes, external_url, published_at)
values
  ('VM0044 — Biochar in soils',
   'Verra-approved methodology for biochar applied to soils. The reference for any biochar carbon project.',
   'Methodology', 'Biochar', 'PDF', 4404019,
   'https://verra.org/methodologies/vm0044-methodology-for-biochar-utilization-in-soil-and-non-soil-applications-v1-0/',
   '2026-02-15'),

  ('Puro.earth Standard v3.1',
   'Puro.earth''s removal-only methodology framework — biochar, BECCS, DAC and more.',
   'Methodology', 'Carbon Removal', 'PDF', 2202010,
   'https://puro.earth/methodologies/',
   '2026-03-04'),

  ('Isometric Protocol — Carbon Removal',
   'Isometric''s scientifically-rigorous protocol set covering geological storage, mineralisation and biomass burial.',
   'Methodology', 'Carbon Removal', 'PDF', 3566018,
   'https://isometric.com/protocol/',
   '2026-01-22'),

  ('VCM Buyers List 2026',
   'Crowdsourced public list of corporate buyers active in the voluntary carbon market in 2026 — sector, geography, ticket size.',
   'Dataset', 'Finance', 'XLSX', 245760,
   '#',
   '2026-04-08'),

  ('Project Financial-Model Template',
   'Verst-curated Excel template for a carbon project P&L: capex, opex, credit issuance schedule, revenue scenarios.',
   'Template', 'Finance', 'XLSX', 112640,
   '#',
   '2026-03-18'),

  ('MRV Field Checklist',
   'One-page printable checklist for a monitoring visit — what to record, what to photograph, what to log.',
   'Template', 'MRV', 'PDF', 92160,
   '#',
   '2026-04-02'),

  ('Climate Glossary 2026',
   'Plain-English definitions of 240+ climate-finance and carbon-markets terms.',
   'Reference', 'General', 'PDF', 1153434,
   '#',
   '2026-05-11'),

  ('Africa Carbon Markets — State of Play',
   'Country-by-country snapshot of African carbon-market readiness, NDC ambition, host-country authorization status.',
   'Brief', 'Africa Focus', 'PDF', 6082560,
   '#',
   '2026-03-29'),

  ('Article 6 — Plain-English explainer',
   '20-page primer on Article 6.2, 6.4 and 6.8 of the Paris Agreement, written for project developers.',
   'Brief', 'Policy', 'PDF', 839270,
   '#',
   '2026-05-06');
