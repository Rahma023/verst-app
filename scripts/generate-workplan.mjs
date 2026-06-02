// Build a comprehensive Verst Carbon Academy workplan as .xlsx.
// Run: node scripts/generate-workplan.mjs
//
// Output: ../Verst-Academy-Workplan.xlsx  (relative to this script — i.e. the
// project's parent folder, the user's "e-Learning Platform" Desktop dir).

import ExcelJS from "exceljs";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_PATH = path.resolve(__dirname, "..", "..", "Verst-Academy-Workplan.xlsx");

// --- palette (Verst brand) ---
const C = {
  forest: "FF008037",
  forest2: "FF003F1B",
  moss: "FF589630",
  ink: "FF0E1612",
  ink3: "FF5A6259",
  line: "FFE5E3DA",
  paper2: "FFF7F7F4",
  sand: "FFF5EBC4",
  clay: "FFB0512E",
  warn: "FFB8801E",
  good: "FF008037",
  white: "FFFFFFFF",
};

const STATUS_COLORS = {
  Done: { fg: C.good, bg: "FFEAF6EE" },
  "In progress": { fg: C.warn, bg: "FFFCF3DD" },
  "To do": { fg: C.ink3, bg: C.paper2 },
  Blocked: { fg: C.clay, bg: "FFF6E0D7" },
};

const PRIORITY_COLORS = {
  P0: { fg: C.clay, bg: "FFF6E0D7" },
  P1: { fg: C.warn, bg: "FFFCF3DD" },
  P2: { fg: C.ink, bg: C.paper2 },
  P3: { fg: C.ink3, bg: C.line.replace("FF", "FFF6") },
};

// --- helper styles ---
function setHeader(row, fg = C.white, bg = C.forest2) {
  row.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bg } };
    cell.font = { bold: true, color: { argb: fg }, size: 11, name: "Calibri" };
    cell.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    cell.border = { bottom: { style: "thin", color: { argb: C.ink } } };
  });
  row.height = 22;
}

function setBody(row) {
  row.eachCell((cell) => {
    cell.font = { size: 10.5, name: "Calibri", color: { argb: C.ink } };
    cell.alignment = { vertical: "top", wrapText: true };
    cell.border = {
      bottom: { style: "hair", color: { argb: C.line } },
    };
  });
}

function colorStatus(cell, status) {
  const c = STATUS_COLORS[status];
  if (!c) return;
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: c.bg } };
  cell.font = { ...cell.font, color: { argb: c.fg }, bold: true };
  cell.alignment = { ...cell.alignment, horizontal: "center" };
}

function colorPriority(cell, p) {
  const c = PRIORITY_COLORS[p];
  if (!c) return;
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: c.bg } };
  cell.font = { ...cell.font, color: { argb: c.fg }, bold: true };
  cell.alignment = { ...cell.alignment, horizontal: "center" };
}

// ============================================================
// THE WORKPLAN — every task we've done + everything ahead
// ============================================================
//
// Columns: Phase, Category, Task, Description, Status, Priority,
// Effort (hours), Owner, Dependencies, Notes

const TASKS = [
  // ---------- PHASE 1: FOUNDATION ----------
  ["1. Foundation", "Local env", "Install Node.js 22 + Git", "Dev prerequisites on Windows via winget.", "Done", "P0", 0.5, "Rahma", "", ""],
  ["1. Foundation", "Local env", "Init Next.js 16 + TypeScript + Tailwind", "Scaffold the app at verst-app/.", "Done", "P0", 0.5, "Claude Code", "Node.js", ""],
  ["1. Foundation", "Design system", "Port brand tokens from prototype CSS", "Raleway font, forest/moss palette, light/dark vars in globals.css.", "Done", "P1", 1, "Claude Code", "Next.js init", "Mirrors prototype's styles.css"],
  ["1. Foundation", "Pages", "Build home page (all 6 sections)", "Hero, program grid, AI tutor preview, field dispatches, pull quote, donation CTA.", "Done", "P1", 4, "Claude Code", "Design tokens", ""],
  ["1. Foundation", "Hosting", "Set up Vercel + GitHub auto-deploy", "Free Hobby tier; push to main auto-deploys.", "Done", "P0", 0.5, "Rahma", "GitHub account", "Live URL: verst-app.vercel.app"],

  // ---------- PHASE 2: BACKEND + AUTH ----------
  ["2. Backend + Auth", "Supabase", "Create project + grab API keys", "Free Nano plan, eu-central-1 region.", "Done", "P0", 0.5, "Rahma", "", "Project ref: hujlpsemkuqgvjmdmhmh"],
  ["2. Backend + Auth", "Supabase", "Database schema v1 (9 tables, RLS)", "profiles, modules, lessons, lesson_assets, enrolments, lesson_progress, quiz_questions, quiz_attempts, certificates.", "Done", "P0", 2, "Claude Code", "Supabase project", "schema-001-initial.sql"],
  ["2. Backend + Auth", "Supabase", "Seed modules + lessons", "9 modules (5 Carbon + 4 AI) and 48 lessons.", "Done", "P0", 0.5, "Claude Code", "Schema v1", "seed-001-modules-lessons.sql"],
  ["2. Backend + Auth", "Supabase", "Section swap: Carbon → Section A", "Re-ordered so Carbon Markets is shown first everywhere.", "Done", "P1", 0.5, "Claude Code", "Seed v1", "seed-003-fix-section-order.sql"],
  ["2. Backend + Auth", "Client wiring", "Supabase clients (server + browser)", "src/lib/supabase/server.ts + client.ts.", "Done", "P0", 0.5, "Claude Code", "API keys", ""],
  ["2. Backend + Auth", "Auth flow", "proxy.ts session refresh middleware", "Refreshes auth cookies on each request (Next.js 16 convention).", "Done", "P0", 0.5, "Claude Code", "Supabase clients", ""],
  ["2. Backend + Auth", "Auth flow", "Signup modal with role picker (Learner/Tutor/Admin)", "Three-card chooser → form → profile.role set on submit.", "Done", "P0", 1.5, "Claude Code", "proxy.ts", "Open self-signup (locked down before public launch)"],
  ["2. Backend + Auth", "Auth flow", "Signin modal with role redirect", "Routes admin → /admin, tutor → /tutor, learner → /dashboard.", "Done", "P0", 1, "Claude Code", "Signup modal", ""],
  ["2. Backend + Auth", "Auth flow", "TopNav avatar + role badge", "Avatar links to the role's portal; ADMIN/TUTOR badge under first name.", "Done", "P1", 0.5, "Claude Code", "Signin redirect", ""],
  ["2. Backend + Auth", "Email", "Disable email confirmation for testing", "Toggle 'Confirm email' off in Supabase Auth settings.", "Done", "P1", 0.1, "Rahma", "", "Re-enable before public launch"],

  // ---------- PHASE 3: LEARNER EXPERIENCE ----------
  ["3. Learner experience", "Catalogue", "/program page (catalogue, section grouping, filter chips)", "Server-side filter by category via URL params.", "Done", "P0", 2, "Claude Code", "Schema", ""],
  ["3. Learner experience", "Catalogue", "'Program at a glance' creative panel on /program", "Right column: section A/B count tiles + stats list + tape note.", "Done", "P2", 1, "Claude Code", "/program page", ""],
  ["3. Learner experience", "Catalogue", "/program/[id] module detail page", "Hero, meta strip, syllabus split into two parts, instructor sidebar.", "Done", "P0", 2, "Claude Code", "/program page", ""],
  ["3. Learner experience", "Catalogue", "Module cover images (Unsplash, with GlassThumb fallback)", "Real African-themed photos per module ID.", "Done", "P2", 1, "Claude Code", "Module detail", ""],
  ["3. Learner experience", "Enrolment", "Enrolment modal (org/country/years/role/goal)", "Pre-fills from profile, writes to profiles + enrolments.", "Done", "P0", 1.5, "Claude Code", "Module detail", ""],
  ["3. Learner experience", "Lesson player", "/lesson/[id] auth + enrolment guard", "Server-side check; redirects if unauth or unenrolled.", "Done", "P0", 1, "Claude Code", "Enrolment", ""],
  ["3. Learner experience", "Lesson player", "Slide viewer (PDF iframe) + audio player", "Latest slide_deck + voice_over assets per lesson.", "Done", "P0", 2, "Claude Code", "Asset upload", ""],
  ["3. Learner experience", "Lesson player", "Progress tracking (10s interval upsert)", "Saves percent_complete + position into lesson_progress.", "Done", "P0", 1, "Claude Code", "Player", ""],
  ["3. Learner experience", "Lesson player", "Prev/Next lesson navigation", "Within-module nav at the bottom of the player.", "Done", "P1", 0.5, "Claude Code", "Player", ""],
  ["3. Learner experience", "Quiz", "/quiz/[moduleId] page + UI", "5 questions per module, dot progress indicator, review screen.", "Done", "P0", 2, "Claude Code", "quiz_questions seed", ""],
  ["3. Learner experience", "Quiz", "Server-side grading + quiz_attempts", "submitQuizAttempt server action; never ships correct_index to browser.", "Done", "P0", 1, "Claude Code", "Quiz UI", ""],
  ["3. Learner experience", "Quiz", "Seed 25 quiz questions (5 per module)", "Carbon Markets modules I–V from QUIZ_BANKS in prototype.", "Done", "P0", 0.5, "Claude Code", "Schema", "seed-004-quiz-questions.sql"],
  ["3. Learner experience", "Quiz", "Pass mark = 80%", "≥4 of 5 correct issues the certificate.", "Done", "P1", 0.1, "Claude Code", "Quiz logic", ""],
  ["3. Learner experience", "Dashboard", "/dashboard with KPIs + enrolled module cards", "Enrolled, in-progress, completed lessons, certificates KPIs + Continue Learning grid.", "Done", "P0", 1.5, "Claude Code", "Enrolment + progress", ""],
  ["3. Learner experience", "Dashboard", "Your questions section on dashboard", "Lists learner's questions + tutor replies.", "Done", "P1", 0.5, "Claude Code", "Q&A schema", ""],
  ["3. Learner experience", "Dashboard", "Role banner (Admin/Tutor portal link)", "Visible when signed in as admin or tutor.", "Done", "P1", 0.3, "Claude Code", "Role helper", ""],
  ["3. Learner experience", "Certificates", "Auto-issue cert on quiz pass", "Verify code generated (VC-MODULE-XXXXXX).", "Done", "P0", 0.5, "Claude Code", "Quiz", ""],
  ["3. Learner experience", "Certificates", "Cert insert RLS policy + backfill", "Fixed: learner couldn't insert own cert due to missing policy.", "Done", "P0", 0.5, "Claude Code", "Schema", "schema-005-cert-insert.sql"],
  ["3. Learner experience", "Certificates", "Certificate PDF generation (@react-pdf/renderer)", "A4 landscape, branded design, /api/certificate/[id]/pdf.", "Done", "P1", 2, "Claude Code", "Cert issue", ""],
  ["3. Learner experience", "Certificates", "/verify/[code] public verification page", "SECURITY DEFINER RPC enables anon reads without user_id leakage.", "Done", "P1", 1, "Claude Code", "Cert PDF", "schema-004-cert-verify.sql"],

  // ---------- PHASE 4: TUTOR + ADMIN ----------
  ["4. Tutor + Admin", "Schema", "tutor_assignments + learner_questions tables + RLS", "is_tutor_for(module_id) helper, RLS so tutors only see their modules.", "Done", "P0", 1, "Claude Code", "Phase 2 schema", "schema-003-tutors.sql"],
  ["4. Tutor + Admin", "Storage", "5 Supabase Storage buckets + RLS", "lesson-slides, lesson-audio, lesson-avatars, resources, avatars.", "Done", "P0", 1, "Claude Code", "Schema", "schema-002-storage.sql"],
  ["4. Tutor + Admin", "Admin portal", "Promote test admin (rahmafaizyusuf@verst)", "Set profiles.role='admin' via SQL.", "Done", "P0", 0.1, "Rahma", "Schema", "seed-002-admin-user.sql"],
  ["4. Tutor + Admin", "Admin portal", "/admin landing (all modules + lessons + asset counts)", "Module/lesson tree with click-through to upload.", "Done", "P0", 1.5, "Claude Code", "Admin role", ""],
  ["4. Tutor + Admin", "Admin portal", "/admin/lessons/[id] upload UI", "AssetUploader + AssetList; uploads to Supabase Storage, writes lesson_assets row.", "Done", "P0", 1.5, "Claude Code", "Storage RLS", ""],
  ["4. Tutor + Admin", "Tutor portal", "Promote test tutor (tutor@verst.earth)", "Set role='tutor', assign to Module I.", "Done", "P0", 0.1, "Rahma", "Schema", "seed-005-tutor-user.sql"],
  ["4. Tutor + Admin", "Tutor portal", "/tutor landing (KPIs + assigned modules + recent questions)", "Mirrors admin shape but scoped to assignments.", "Done", "P0", 1, "Claude Code", "Tutor role + assignments", ""],
  ["4. Tutor + Admin", "Tutor portal", "/tutor/lessons/[id] (reuses admin upload UI)", "requireTutorForModule guard wraps the admin components.", "Done", "P0", 0.5, "Claude Code", "Admin upload", ""],
  ["4. Tutor + Admin", "Tutor portal", "/tutor/questions inbox + answer page", "Open / Answered split; submitAnswer server action.", "Done", "P0", 1.5, "Claude Code", "Q&A schema", ""],
  ["4. Tutor + Admin", "Learner Q&A", "'Ask a tutor' button + modal", "On lesson player + module detail; writes to learner_questions.", "Done", "P0", 1, "Claude Code", "Q&A schema", ""],

  // ---------- PHASE 5: AI TUTOR ----------
  ["5. AI Tutor", "API key", "Sign up Anthropic API + get key", "Free $5 credit on signup.", "Done", "P0", 0.1, "Rahma", "", ""],
  ["5. AI Tutor", "Backend", "Install Anthropic SDK", "@anthropic-ai/sdk.", "Done", "P0", 0.1, "Claude Code", "API key", ""],
  ["5. AI Tutor", "Backend", "/api/tutor-ai/chat streaming route", "ReadableStream piping Claude Opus 4.7 deltas back to browser.", "Done", "P0", 1.5, "Claude Code", "SDK", "Adaptive thinking, medium effort"],
  ["5. AI Tutor", "Frontend", "AskAiChat client component", "Chat UI with suggestion chips, streaming response into white bubbles.", "Done", "P0", 1.5, "Claude Code", "API route", ""],
  ["5. AI Tutor", "Frontend", "Embed in lesson player", "Below the audio narration; lesson context (module/lesson code) sent with each turn.", "Done", "P1", 0.3, "Claude Code", "AskAiChat", ""],
  ["5. AI Tutor", "Production", "Add ANTHROPIC_API_KEY to Vercel env", "Production runs with the same key.", "Done", "P0", 0.2, "Rahma", "API key", ""],

  // ---------- PHASE 6: PUBLIC SURFACES (TODO) ----------
  ["6. Public surfaces", "Forum", "/forum index — categories + active threads", "List the discussion categories, top threads, member count.", "To do", "P2", 3, "Claude Code", "Phase 2 schema", "Needs forum_threads + forum_replies tables"],
  ["6. Public surfaces", "Forum", "/forum/[id] thread detail + reply form", "Nested replies, expert badges, vote counts.", "To do", "P2", 3, "Claude Code", "/forum index", ""],
  ["6. Public surfaces", "Webinars", "/webinars index (live + replay)", "WEBINARS sample data, registration CTA, video embed for replays.", "To do", "P2", 2, "Claude Code", "Schema", "webinars table + registrations"],
  ["6. Public surfaces", "Podcast", "/podcast hub", "Audio player per episode, guest cards, RSS feed.", "To do", "P3", 2, "Claude Code", "Schema", ""],
  ["6. Public surfaces", "Library", "/library downloads index", "Filterable resource library with category chips.", "To do", "P2", 1.5, "Claude Code", "Storage bucket 'resources'", "Use existing 'resources' bucket"],
  ["6. Public surfaces", "Donate", "/donate page (hero + impact + sticky donate panel)", "Currently 404; needs the prototype's S8 layout + donate modal.", "To do", "P1", 2, "Claude Code", "Phase 7 payments", ""],

  // ---------- PHASE 7: PAYMENTS (TODO) ----------
  ["7. Payments", "Stripe", "Create Stripe account", "Get Stripe Atlas if Kenya/Nigeria business registration needed for international receiving.", "To do", "P0", 1, "Rahma", "", "Business documents required"],
  ["7. Payments", "Paystack", "Create Paystack account", "Africa-friendly PSP. M-Pesa + local cards.", "To do", "P0", 0.5, "Rahma", "", "Business documents required"],
  ["7. Payments", "Backend", "/api/donations/create — Stripe Checkout session", "Server action that creates a checkout session and redirects.", "To do", "P1", 1.5, "Claude Code", "Stripe", ""],
  ["7. Payments", "Backend", "/api/webhooks/stripe — donation succeeded", "Marks donation row paid; sends receipt.", "To do", "P1", 2, "Claude Code", "Stripe Checkout", "Needs webhook signing key"],
  ["7. Payments", "Backend", "/api/donations/mpesa — Paystack initiate", "STK push or transfer; webhook on success.", "To do", "P1", 2, "Claude Code", "Paystack", ""],
  ["7. Payments", "Frontend", "Donate modal (preset amounts + monthly toggle)", "Picks PSP based on country; opens redirect/STK.", "To do", "P1", 2, "Claude Code", "Backend routes", ""],
  ["7. Payments", "Backend", "Donations dashboard for admin", "Total, monthly, by-country breakdown.", "To do", "P2", 2, "Claude Code", "Webhooks", ""],

  // ---------- PHASE 8: COMMUNICATIONS (TODO) ----------
  ["8. Communications", "Transactional email", "Sign up Resend", "Free for first 100 emails/day.", "To do", "P1", 0.3, "Rahma", "", ""],
  ["8. Communications", "Transactional email", "Configure Supabase Auth to use Resend SMTP", "Replaces Supabase's default dev mailer.", "To do", "P1", 1, "Claude Code", "Resend account", ""],
  ["8. Communications", "Transactional email", "Re-enable email confirmation in Supabase Auth", "Was disabled for testing. Required before public launch.", "To do", "P0", 0.1, "Rahma", "SMTP configured", ""],
  ["8. Communications", "Transactional email", "Welcome email on signup", "Resend template + Supabase Auth hook.", "To do", "P2", 1, "Claude Code", "Resend", ""],
  ["8. Communications", "Transactional email", "Certificate email (PDF attached)", "Sent when cert is auto-issued.", "To do", "P2", 1.5, "Claude Code", "Cert PDF", ""],
  ["8. Communications", "Transactional email", "Enrolment confirmation email", "Sent when learner enrols in a module.", "To do", "P2", 0.5, "Claude Code", "Resend", ""],
  ["8. Communications", "Newsletter", "Sign up Loops or Beehiiv", "Free up to 1,000–2,500 subscribers.", "To do", "P3", 0.5, "Rahma", "", ""],
  ["8. Communications", "Newsletter", "Add newsletter signup form to footer", "Marketing.", "To do", "P3", 0.5, "Claude Code", "Newsletter provider", ""],

  // ---------- PHASE 9: CONTENT PRODUCTION (TODO — content team) ----------
  ["9. Content production", "Voice-over", "ElevenLabs Pro subscription", "$99/mo; ~500K chars/mo covers all 48 lessons.", "To do", "P0", 0.3, "Content team", "", "Down to $22/mo Creator after initial production"],
  ["9. Content production", "Voice-over", "Generate voice-over for all 48 lessons", "Estimate: 350K characters total.", "To do", "P0", 60, "Content team", "ElevenLabs", "Per-lesson editing pass"],
  ["9. Content production", "Avatar video", "HeyGen subscription (or Synthesia/D-ID)", "$24–89/mo depending on tier.", "To do", "P1", 0.3, "Content team", "", "Decision pending"],
  ["9. Content production", "Avatar video", "Generate avatar videos per lesson", "Optional content type alongside slides + voice.", "To do", "P2", 40, "Content team", "HeyGen", ""],
  ["9. Content production", "Video host", "Set up Cloudflare Stream", "Pay-per-min, African-friendly delivery.", "To do", "P1", 0.5, "Content team", "Avatar videos", ""],
  ["9. Content production", "Slides", "Author slide decks for Module I (pilot)", "6 lessons × ~12 slides each.", "To do", "P0", 30, "Content team", "", "Highest priority for pilot launch"],
  ["9. Content production", "Slides", "Author slide decks for Modules II–V + AI section", "Remainder of Carbon + 4 AI modules.", "To do", "P2", 120, "Content team", "Module I done", ""],
  ["9. Content production", "Transcripts", "Write/clean transcripts per lesson", "Improves AI tutor RAG quality, accessibility.", "To do", "P2", 24, "Content team", "Voice-over", ""],

  // ---------- PHASE 10: PRODUCTION HARDENING (TODO) ----------
  ["10. Production hardening", "Domain", "Buy domain (learn.verst.earth or fresh .com)", "Cloudflare Registrar; $10–15/yr.", "To do", "P0", 0.5, "Rahma", "", ""],
  ["10. Production hardening", "Domain", "Connect domain to Vercel", "Add CNAME records; auto-issued SSL.", "To do", "P0", 0.5, "Claude Code", "Domain purchase", ""],
  ["10. Production hardening", "Security", "Lock admin/tutor signup behind invite code", "Replace open self-signup with invite-only.", "To do", "P0", 1.5, "Claude Code", "", "Critical before public launch"],
  ["10. Production hardening", "Security", "Audit RLS policies on every table", "Verify no anon over-read; check service_role usage.", "To do", "P1", 2, "Claude Code", "", ""],
  ["10. Production hardening", "Security", "Add CAPTCHA (Cloudflare Turnstile) to signup", "Prevent bot signups.", "To do", "P1", 1, "Claude Code", "Domain", ""],
  ["10. Production hardening", "Legal", "Sign up Termly + generate Terms/Privacy/Cookies", "Required for EU/UK/CA compliance.", "To do", "P0", 1, "Rahma", "", "$96/yr"],
  ["10. Production hardening", "Legal", "Add legal links to footer + signup", "Terms / Privacy / Cookies / Accessibility.", "To do", "P1", 0.5, "Claude Code", "Termly docs", ""],
  ["10. Production hardening", "Observability", "Add Sentry (error tracking)", "Free 5K errors/month.", "To do", "P1", 0.5, "Claude Code", "", ""],
  ["10. Production hardening", "Observability", "Add PostHog (product analytics)", "Free up to 1M events/month.", "To do", "P2", 1, "Claude Code", "", ""],
  ["10. Production hardening", "Observability", "Add UptimeRobot monitor", "Free; SMS alerts on $7/mo.", "To do", "P2", 0.3, "Rahma", "Domain", ""],
  ["10. Production hardening", "Performance", "Lighthouse audit + fixes", "Target ≥90 across the board.", "To do", "P1", 2, "Claude Code", "", ""],
  ["10. Production hardening", "Performance", "Mobile responsive audit", "Most learners will likely be on phones in African markets.", "To do", "P0", 3, "Claude Code", "", ""],
  ["10. Production hardening", "Accessibility", "WCAG 2.1 AA audit", "Color contrast, keyboard nav, screen reader labels.", "To do", "P1", 2, "Claude Code", "", ""],
  ["10. Production hardening", "Backups", "Set up Supabase backup strategy", "Pro plan has daily backups; verify retention.", "To do", "P2", 0.5, "Rahma", "Supabase Pro", ""],

  // ---------- PHASE 11: LAUNCH ----------
  ["11. Launch", "Soft launch", "Recruit 10 beta learners", "Verst Carbon network; mix of corporate + project devs.", "To do", "P0", 4, "Rahma", "All P0 complete", ""],
  ["11. Launch", "Soft launch", "Collect beta feedback (form + interviews)", "Tally form + 1:1 30-min calls.", "To do", "P0", 8, "Rahma", "Beta learners", ""],
  ["11. Launch", "Soft launch", "Iterate on feedback", "Bug fixes, copy tweaks, friction removal.", "To do", "P0", 16, "Claude Code", "Beta feedback", ""],
  ["11. Launch", "Public launch", "LinkedIn announcement + press outreach", "Verst Carbon network + carbon-markets media.", "To do", "P1", 4, "Rahma", "Soft launch done", ""],
  ["11. Launch", "Public launch", "Email blast to existing Verst contacts", "Via Loops/Beehiiv.", "To do", "P1", 1, "Rahma", "Newsletter set up", ""],

  // ---------- PHASE 12: GROWTH (Month 6+) ----------
  ["12. Growth", "Tax / billing", "Stripe Tax setup", "Auto VAT calculation; 0.4% per transaction.", "To do", "P2", 1, "Claude Code", "Stripe live", ""],
  ["12. Growth", "Marketing", "Affiliate / referral program", "Track referrer URL → enrolment → reward.", "To do", "P3", 8, "Claude Code", "", ""],
  ["12. Growth", "Marketing", "Multi-language (French / Swahili)", "i18n for major African markets.", "To do", "P3", 24, "Claude Code", "", ""],
  ["12. Growth", "Product", "Live cohort feature", "Scheduled cohort start dates, Slack/Discord integration.", "To do", "P3", 24, "Claude Code", "", ""],
  ["12. Growth", "Product", "Mobile PWA / responsive enhancements", "Make the app installable; offline lesson caching.", "To do", "P2", 16, "Claude Code", "", ""],
  ["12. Growth", "B2B", "Enterprise pricing + team accounts", "Multi-seat licenses for corporate clients.", "To do", "P2", 16, "Claude Code", "", ""],
  ["12. Growth", "AI tutor", "RAG over methodology docs (pgvector)", "Embed Verra/Puro/ISO docs; cite passages in tutor answers.", "To do", "P2", 8, "Claude Code", "Documents uploaded", ""],
];

// ---------- BUILD WORKBOOK ----------
const wb = new ExcelJS.Workbook();
wb.creator = "Verst Carbon Academy";
wb.lastModifiedBy = "Verst Carbon Academy";
wb.created = new Date(2026, 5, 2);
wb.modified = new Date();

// =================== OVERVIEW SHEET ===================
const ov = wb.addWorksheet("Overview", {
  views: [{ showGridLines: false }],
});

ov.columns = [
  { width: 28 },
  { width: 70 },
];

let r = 1;
ov.getCell(`A${r}`).value = "VERST CARBON ACADEMY";
ov.getCell(`A${r}`).font = { size: 22, bold: true, color: { argb: C.forest } };
ov.mergeCells(`A${r}:B${r}`);
ov.getRow(r).height = 30;
r++;
ov.getCell(`A${r}`).value = "Workplan · Year 1 · generated 2026-06-02";
ov.getCell(`A${r}`).font = { size: 11, color: { argb: C.ink3 }, italic: true };
ov.mergeCells(`A${r}:B${r}`);
r += 2;

const summaryRows = [
  ["Vision", "A two-section climate-tech learning platform for African project developers, corporate sustainability teams and the next generation of climate professionals. Self-paced. Verified credentials."],
  ["Sections", "A · Carbon Markets (5 modules)   ·   B · AI in Climate (4 modules)"],
  ["Tech stack", "Next.js 16, TypeScript, Tailwind v4, Supabase (Postgres + Auth + Storage + RLS), Vercel, Anthropic API (Claude Opus 4.7), @react-pdf/renderer, ElevenLabs (planned), HeyGen (planned), Cloudflare Stream (planned)."],
  ["Production URL", "https://verst-app.vercel.app"],
  ["Code repo", "https://github.com/Rahma023/verst-app"],
  ["Supabase project", "hujlpsemkuqgvjmdmhmh (eu-central-1)"],
  ["Total tasks", `${TASKS.length}`],
  ["Done", `${TASKS.filter((t) => t[4] === "Done").length}`],
  ["In progress", `${TASKS.filter((t) => t[4] === "In progress").length}`],
  ["To do", `${TASKS.filter((t) => t[4] === "To do").length}`],
];

for (const [k, v] of summaryRows) {
  ov.getCell(`A${r}`).value = k;
  ov.getCell(`A${r}`).font = { bold: true, color: { argb: C.forest2 }, size: 11 };
  ov.getCell(`A${r}`).alignment = { vertical: "top" };
  ov.getCell(`B${r}`).value = v;
  ov.getCell(`B${r}`).font = { color: { argb: C.ink }, size: 11 };
  ov.getCell(`B${r}`).alignment = { vertical: "top", wrapText: true };
  ov.getRow(r).height = 22;
  r++;
}
r++;

ov.getCell(`A${r}`).value = "HOW TO READ THIS WORKBOOK";
ov.getCell(`A${r}`).font = { bold: true, size: 12, color: { argb: C.forest } };
ov.mergeCells(`A${r}:B${r}`);
r++;
const howTo = [
  "Overview — this sheet. Project at a glance.",
  "Tasks — every concrete piece of work, organised by phase, with status and priority.",
  "Milestones — phase-level rollups with target windows.",
  "Tools & Budget — annual cost per tool we use or plan to use (cross-references docs/tools-roadmap.md).",
  "Risks — known risks with mitigation strategy.",
];
for (const t of howTo) {
  ov.getCell(`A${r}`).value = "·";
  ov.getCell(`A${r}`).alignment = { horizontal: "center" };
  ov.getCell(`B${r}`).value = t;
  ov.getCell(`B${r}`).font = { size: 11, color: { argb: C.ink2 } };
  r++;
}

// =================== TASKS SHEET ===================
const ts = wb.addWorksheet("Tasks", {
  views: [{ state: "frozen", ySplit: 1, showGridLines: false }],
});

ts.columns = [
  { header: "Phase", key: "phase", width: 26 },
  { header: "Category", key: "cat", width: 22 },
  { header: "Task", key: "task", width: 50 },
  { header: "Description", key: "desc", width: 70 },
  { header: "Status", key: "status", width: 13 },
  { header: "Priority", key: "priority", width: 10 },
  { header: "Effort (h)", key: "effort", width: 11 },
  { header: "Owner", key: "owner", width: 16 },
  { header: "Dependencies", key: "deps", width: 26 },
  { header: "Notes", key: "notes", width: 40 },
];
setHeader(ts.getRow(1));

for (const t of TASKS) {
  const row = ts.addRow(t);
  setBody(row);
  colorStatus(row.getCell(5), t[4]);
  colorPriority(row.getCell(6), t[5]);
  // alternate phase shading (subtle)
}

ts.autoFilter = {
  from: { row: 1, column: 1 },
  to: { row: 1, column: 10 },
};

// =================== MILESTONES SHEET ===================
const ms = wb.addWorksheet("Milestones");
ms.columns = [
  { header: "Phase", key: "phase", width: 36 },
  { header: "Target window", key: "window", width: 24 },
  { header: "Goal", key: "goal", width: 70 },
  { header: "Status", key: "status", width: 14 },
];
setHeader(ms.getRow(1));

const milestones = [
  ["1. Foundation", "Week 1", "Local env + Next.js scaffold + Vercel-hosted home page", "Done"],
  ["2. Backend + Auth", "Week 2", "Supabase wired; signup/signin with role redirect; profiles + RLS", "Done"],
  ["3. Learner experience", "Weeks 3–4", "Full learner loop: enrol → lesson → quiz → certificate (PDF + public verify)", "Done"],
  ["4. Tutor + Admin", "Weeks 4–5", "Admin Studio + Tutor Portal with upload UI + Q&A inbox", "Done"],
  ["5. AI Tutor", "Week 5", "Claude-powered lesson-aware tutor embedded in the lesson player", "Done"],
  ["6. Public surfaces", "Weeks 6–7", "Forum, Webinars, Podcast, Library, Donate pages live", "To do"],
  ["7. Payments", "Weeks 7–8", "Stripe + Paystack live; donation flow + admin dashboard", "To do"],
  ["8. Communications", "Week 8", "Resend + transactional emails + email confirmation back on", "To do"],
  ["9. Content production", "Weeks 6–14", "Module I fully produced; Modules II–V + AI section in pipeline", "To do"],
  ["10. Production hardening", "Weeks 9–10", "Domain, invite-only admin/tutor, legal docs, monitoring, audits", "To do"],
  ["11. Launch", "Weeks 11–12", "10 beta learners onboarded, feedback collected, public launch", "To do"],
  ["12. Growth", "Months 4–12", "Stripe Tax, multi-lang, cohorts, mobile PWA, RAG-powered tutor, B2B", "To do"],
];

for (const m of milestones) {
  const row = ms.addRow(m);
  setBody(row);
  colorStatus(row.getCell(4), m[3]);
  row.height = 30;
}

ms.eachRow({ includeEmpty: false }, (row) => {
  row.eachCell((cell) => {
    cell.alignment = { vertical: "middle", wrapText: true };
  });
});

// =================== TOOLS & BUDGET ===================
const tb = wb.addWorksheet("Tools & Budget");
tb.columns = [
  { header: "Category", key: "cat", width: 24 },
  { header: "Tool", key: "tool", width: 26 },
  { header: "Purpose", key: "purpose", width: 56 },
  { header: "Annual cost (USD)", key: "cost", width: 22 },
  { header: "Status", key: "status", width: 13 },
];
setHeader(tb.getRow(1));

const tools = [
  ["Foundation", "GitHub", "Code hosting + auto-deploy trigger", "$0", "Active"],
  ["Foundation", "Vercel (Hobby)", "Web hosting", "$0", "Active"],
  ["Foundation", "Supabase (Free)", "Postgres + Auth + Storage + RLS", "$0", "Active"],
  ["Pre-launch", "Domain (Cloudflare Registrar)", "Web address (e.g. verstacademy.com)", "$10–15", "Pending"],
  ["Pre-launch", "Cloudflare", "DNS / CDN / DDoS protection", "$0", "Pending"],
  ["Pre-launch", "Resend", "Transactional emails (signup, certificates)", "$0 free → $240 once busy", "Pending"],
  ["Pre-launch", "Stripe", "International card payments", "$0 + 2.9% + $0.30 per txn", "Pending"],
  ["Pre-launch", "Paystack", "M-Pesa + African cards / mobile money", "$0 + ~1.5% per txn", "Pending"],
  ["Pre-launch", "Termly", "Auto-generated Terms / Privacy / Cookies", "$96", "Pending"],
  ["Content", "ElevenLabs Pro", "AI voice-over for lessons", "$1,188 / mo prorated", "Pending"],
  ["Content", "HeyGen", "AI avatar talking-head videos", "$1,068 / mo prorated", "Pending"],
  ["Content", "Cloudflare Stream", "Video hosting + streaming", "~$120 usage-based", "Pending"],
  ["AI", "Anthropic API (Claude)", "AI tutor responses", "~$150–600 pay-per-use", "Active"],
  ["AI", "OpenAI Embeddings", "One-off: methodology PDF embeddings for RAG (later)", "~$1", "Future"],
  ["Webinars", "YouTube Live", "Free webinars + replays", "$0", "Future"],
  ["Webinars", "Zoom Webinars (optional)", "Polled/interactive paid webinars", "$1,068", "Optional"],
  ["Observability", "Vercel Analytics", "Page views, Web Vitals", "$0", "Active"],
  ["Observability", "PostHog", "Product analytics (funnels, retention)", "$0 free", "Future"],
  ["Observability", "Sentry", "Error tracking in production", "$0 free", "Future"],
  ["Observability", "UptimeRobot", "Uptime monitoring", "$0", "Future"],
  ["Marketing", "Loops", "Newsletter + marketing email", "$0 free → $588", "Future"],
  ["Marketing", "Buffer", "Social media scheduling", "$216", "Future"],
  ["Marketing", "Canva Pro", "Brand graphics, slides", "$156", "Future"],
];

for (const t of tools) {
  const row = tb.addRow(t);
  setBody(row);
  colorStatus(row.getCell(5), t[4] === "Active" ? "Done" : t[4] === "Pending" ? "To do" : t[4] === "Future" ? "To do" : "To do");
  row.height = 22;
}

// summary footer
tb.addRow([]);
const summaryStart = tb.lastRow.number + 1;
const summaries = [
  ["", "", "Minimum viable Year 1 (voice + AI tutor + payments, skip avatar/zoom)", "≈ $830", ""],
  ["", "", "Recommended pilot (all locked-in tools, no Zoom)", "≈ $2,950", ""],
  ["", "", "Full launch (everything above + Zoom + newsletter + social tools)", "≈ $5,000", ""],
];
for (const s of summaries) {
  const row = tb.addRow(s);
  row.getCell(3).font = { italic: true, color: { argb: C.ink2 } };
  row.getCell(4).font = { bold: true, color: { argb: C.forest } };
  row.height = 22;
}
tb.getCell(`A${summaryStart - 1}`).value = "BUDGET SCENARIOS";
tb.getCell(`A${summaryStart - 1}`).font = { bold: true, size: 11, color: { argb: C.forest } };
tb.mergeCells(`A${summaryStart - 1}:E${summaryStart - 1}`);

tb.autoFilter = {
  from: { row: 1, column: 1 },
  to: { row: 1, column: 5 },
};

// =================== RISKS ===================
const rs = wb.addWorksheet("Risks");
rs.columns = [
  { header: "Risk", key: "risk", width: 50 },
  { header: "Likelihood", key: "lik", width: 14 },
  { header: "Impact", key: "imp", width: 14 },
  { header: "Mitigation", key: "mit", width: 70 },
];
setHeader(rs.getRow(1));

const risks = [
  ["Open self-signup lets anyone become admin/tutor", "High", "High", "Lock admin/tutor roles behind invite codes before public launch (P0 in Phase 10)."],
  ["Anthropic API runaway cost from abuse", "Medium", "Medium", "Rate-limit /api/tutor-ai/chat per user, set monthly cap, add CAPTCHA on signup."],
  ["Stripe doesn't natively support Kenyan businesses", "High", "Medium", "Use Paystack as primary PSP; fall back to Stripe via Stripe Atlas only if international donors need it."],
  ["Supabase free tier limits (500MB DB, 1GB storage)", "Medium", "Low", "Upgrade to Pro at $25/mo once 100K users or 8GB storage. Plan in advance."],
  ["Content production cost overrun (voice + avatar)", "Medium", "High", "Pilot Module I only; defer Modules II–V + AI section until pilot validates demand."],
  ["African network bandwidth on video lessons", "High", "High", "Use Cloudflare Stream for adaptive bitrate; offer audio-only mode; compress slides."],
  ["Single founder bus factor", "Medium", "High", "Document everything in repo + Notion; aim to onboard a second admin within 6 months."],
  ["Compliance (GDPR / Kenyan DPA)", "High", "High", "Termly for legal docs; PII minimisation; audit RLS before launch."],
  ["Anthropic API key leaked", "Low", "High", "Key is server-only (not NEXT_PUBLIC); rotate quarterly; monitor usage."],
  ["Module/lesson content needs SME validation", "High", "Medium", "Tutors review each lesson before 'live' state; soft launch with 10 beta learners catches errors."],
];

for (const r of risks) {
  const row = rs.addRow(r);
  setBody(row);
  // colour likelihood / impact
  const llv = { Low: C.good, Medium: C.warn, High: C.clay };
  for (const col of [2, 3]) {
    const cell = row.getCell(col);
    cell.font = { ...cell.font, color: { argb: llv[cell.value] }, bold: true };
    cell.alignment = { ...cell.alignment, horizontal: "center" };
  }
  row.height = 36;
}

rs.autoFilter = {
  from: { row: 1, column: 1 },
  to: { row: 1, column: 4 },
};

// =================== SAVE ===================
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
await wb.xlsx.writeFile(OUT_PATH);
console.log(`Saved: ${OUT_PATH}`);
console.log(`Sheets: Overview, Tasks (${TASKS.length} rows), Milestones, Tools & Budget, Risks`);
