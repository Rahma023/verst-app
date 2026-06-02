-- ============================================================
-- VERST CARBON ACADEMY — seed: quiz questions
--
-- 5 questions × 5 modules = 25 multiple-choice questions.
-- Mirrors QUIZ_BANKS in the prototype's screens-modals.jsx.
-- Idempotent: deletes the module's existing questions first.
-- ============================================================

-- Wipe existing quiz questions for these modules so re-runs are clean.
delete from public.quiz_questions
where module_id in ('m1', 'm2', 'm3', 'm4', 'm5');

-- ---------- m1 — Introduction to Carbon Markets ----------
insert into public.quiz_questions (module_id, question_text, options, correct_index, order_index) values
('m1',
 'Which of the following best defines a carbon credit?',
 jsonb_build_array(
   'A government-issued permit to emit unlimited CO₂',
   'A certificate representing 1 tonne of CO₂e reduced, avoided or removed',
   'A tax on fossil fuels',
   'A subsidy for renewable energy'),
 1, 1),
('m1',
 'Voluntary carbon markets differ from compliance markets in that:',
 jsonb_build_array(
   'They are mandatory for regulated entities',
   'Participation is driven by corporate climate strategy, not regulation',
   'They only deal with avoidance credits',
   'They are cheaper for everyone'),
 1, 2),
('m1',
 'Which is NOT one of the five quality pillars of a carbon credit?',
 jsonb_build_array('Additionality', 'Permanence', 'Profitability', 'Measurability'),
 2, 3),
('m1',
 'A registry''s primary role in the carbon market is to:',
 jsonb_build_array(
   'Verify project emissions',
   'Issue, track and retire credits',
   'Buy credits on behalf of corporates',
   'Set carbon prices'),
 1, 4),
('m1',
 'High-quality credit prices in 2026 typically:',
 jsonb_build_array(
   'Match low-quality credit prices',
   'Trade at a significant premium',
   'Are set by government',
   'Are below $1 per tonne'),
 1, 5);

-- ---------- m2 — Organizational Level GHG Accounting ----------
insert into public.quiz_questions (module_id, question_text, options, correct_index, order_index) values
('m2',
 'ISO 14064-1:2018 sets out requirements for:',
 jsonb_build_array(
   'Project-level accounting',
   'Organisational-level GHG accounting',
   'Carbon neutrality claims',
   'Voluntary credit trading'),
 1, 1),
('m2',
 'Which scope covers direct emissions from owned sources?',
 jsonb_build_array('Scope 1', 'Scope 2', 'Scope 3', 'Scope 4'),
 0, 2),
('m2',
 'Purchased electricity falls under:',
 jsonb_build_array('Scope 1', 'Scope 2', 'Scope 3 — upstream', 'Scope 3 — downstream'),
 1, 3),
('m2',
 'A carbon-neutrality claim under ISO 14068-1:2023 requires:',
 jsonb_build_array(
   'Only carbon offsets',
   'A clear emission-reduction trajectory before offsetting residuals',
   'Public disclosure of revenue',
   'No internal carbon price'),
 1, 4),
('m2',
 'Business travel emissions are typically:',
 jsonb_build_array('Scope 1', 'Scope 2', 'Scope 3 — Category 6', 'Not reported'),
 2, 5);

-- ---------- m3 — Project Level GHG Accounting ----------
insert into public.quiz_questions (module_id, question_text, options, correct_index, order_index) values
('m3',
 'Additionality means the project:',
 jsonb_build_array(
   'Adds to government tax revenue',
   'Would not have occurred without carbon credit revenue',
   'Is additional to a company''s NDC',
   'Adds new employees to a project team'),
 1, 1),
('m3',
 'The baseline scenario describes:',
 jsonb_build_array(
   'The best possible future',
   'What would happen without the project',
   'The certified emission level',
   'The project sponsor'),
 1, 2),
('m3',
 'Leakage refers to:',
 jsonb_build_array(
   'Loss of water in a project',
   'Emissions shifting outside the project boundary',
   'Carbon credits leaking into other markets',
   'A poorly written contract'),
 1, 3),
('m3',
 'MRV stands for:',
 jsonb_build_array(
   'Monitor, Report, Verify',
   'Methodology, Registry, Validation',
   'Market, Risk, Value',
   'Material, Real, Validated'),
 0, 4),
('m3',
 'A VVB (Validation and Verification Body) is independent because:',
 jsonb_build_array(
   'It works for the project',
   'It works for the registry',
   'It must be accredited and conflict-free',
   'It is owned by the buyer'),
 2, 5);

-- ---------- m4 — Carbon Finance ----------
insert into public.quiz_questions (module_id, question_text, options, correct_index, order_index) values
('m4',
 'A streaming agreement in carbon finance is:',
 jsonb_build_array(
   'Live-streaming an audit',
   'Upfront capital in exchange for a credit-share over time',
   'A type of insurance',
   'A government bond'),
 1, 1),
('m4',
 'Blended finance combines:',
 jsonb_build_array(
   'Two types of carbon credits',
   'Concessional and commercial capital',
   'Equity and pre-payments only',
   'Two registries'),
 1, 2),
('m4',
 'A benefit-sharing mechanism distributes:',
 jsonb_build_array(
   'Carbon credits to the buyer only',
   'Project revenue to communities, government and project owners',
   'Equity in the project',
   'Carbon dividends to all citizens'),
 1, 3),
('m4',
 'A floor price in an offtake protects:',
 jsonb_build_array(
   'The buyer from price spikes',
   'The seller from price collapse',
   'The registry from default',
   'The government from leakage'),
 1, 4),
('m4',
 'ETS stands for:',
 jsonb_build_array(
   'Earth Tracking System',
   'Emissions Trading System',
   'Energy Trading Standard',
   'Environmental Tax Surcharge'),
 1, 5);

-- ---------- m5 — Article 6 of the Paris Agreement ----------
insert into public.quiz_questions (module_id, question_text, options, correct_index, order_index) values
('m5',
 'NDCs are:',
 jsonb_build_array(
   'Nationally Determined Contributions',
   'Net Discount Credits',
   'Non-Domestic Carbon credits',
   'New Direct Capture devices'),
 0, 1),
('m5',
 'Article 6.2 governs:',
 jsonb_build_array(
   'Centralised market via UN',
   'Cooperative approaches between countries (ITMOs)',
   'Voluntary forest credits only',
   'Climate finance from rich to poor'),
 1, 2),
('m5',
 'Article 6.4 establishes:',
 jsonb_build_array(
   'A bilateral trading mechanism',
   'A UN-supervised crediting mechanism (successor to CDM)',
   'A REDD+ replacement',
   'A loss-and-damage fund'),
 1, 3),
('m5',
 'A corresponding adjustment ensures:',
 jsonb_build_array(
   'Project documents are aligned',
   'Emission reductions aren''t double-counted between host and recipient',
   'Buyers pay a premium',
   'Auditors are paid fairly'),
 1, 4),
('m5',
 'The Global Stocktake happens every:',
 jsonb_build_array('Year', 'Two years', 'Five years', 'Decade'),
 2, 5);

-- Verification
select module_id, count(*) as questions
from   public.quiz_questions
group  by module_id
order  by module_id;
