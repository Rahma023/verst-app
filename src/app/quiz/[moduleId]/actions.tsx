"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import { revalidatePath } from "next/cache";
import {
  emailButton,
  emailHeading,
  emailMetaStrip,
  emailParagraph,
  escapeHtml,
  sendEmail,
} from "@/lib/email";
import { VerstCertificate } from "@/lib/pdf/certificate";
import { createClient } from "@/lib/supabase/server";

const SITE = "https://verst-app.vercel.app";

export type GradedQuestion = {
  question_id: string;
  question_text: string;
  options: string[];
  selected_index: number | null;
  correct_index: number;
  is_correct: boolean;
};

export type QuizResult = {
  ok: true;
  scorePercent: number;
  passed: boolean;
  totalQuestions: number;
  correctCount: number;
  graded: GradedQuestion[];
  certificateIssued: boolean;
};

type QuizError = { ok: false; error: string };

type QuestionRow = {
  id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  order_index: number;
};

const PASS_THRESHOLD = 80;

function randomVerifyCode(): string {
  // Six-character base36-ish code, easy to read aloud.
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

async function sendCertificateEmail(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email: string | undefined,
  moduleId: string,
  cert: { id: string; verify_code: string; issued_at: string },
) {
  if (!email) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("user_id", userId)
    .maybeSingle<{ full_name: string | null }>();

  const { data: mod } = await supabase
    .from("modules")
    .select("code, title")
    .eq("id", moduleId)
    .maybeSingle<{ code: string; title: string }>();

  const fullName = profile?.full_name ?? email ?? "Verst Learner";
  const moduleCode = mod?.code ?? "—";
  const moduleTitle = mod?.title ?? "Verst Carbon Academy";
  const firstName = (fullName || "").split(" ")[0] || "there";
  const safeName = fullName.replace(/[^A-Za-z0-9-_]+/g, "-").replace(/-+/g, "-");
  const filename = `verst-certificate-${moduleCode}-${safeName}.pdf`;

  const pdfBuffer = await renderToBuffer(
    <VerstCertificate
      data={{
        fullName,
        moduleCode,
        moduleTitle,
        issuedAt: cert.issued_at,
        verifyCode: cert.verify_code,
      }}
    />,
  );

  const verifyUrl = `${SITE}/verify/${cert.verify_code}`;
  const dashboardUrl = `${SITE}/dashboard`;

  const body = [
    emailHeading(`Congratulations, ${escapeHtml(firstName)}.`),
    emailParagraph(
      `You passed the <strong>Module ${escapeHtml(moduleCode)} — ${escapeHtml(moduleTitle)}</strong> quiz. Your Verst Carbon Academy certificate is attached to this email and is also available from your dashboard.`,
    ),
    emailMetaStrip([
      ["Module", `${moduleCode} — ${moduleTitle}`],
      ["Issued", new Date(cert.issued_at).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })],
      ["Verify code", cert.verify_code],
    ]),
    emailButton(verifyUrl, "Verify publicly"),
    emailParagraph(
      `Anyone with the verify link above can confirm this certificate is authentic — share it on LinkedIn, with a recruiter, or attach it to a project bid. The verification page works without sign-in.`,
    ),
    emailParagraph(
      `Your dashboard at <a href="${dashboardUrl}" style="color:#008037;font-weight:600;">verst-app.vercel.app/dashboard</a> always has a fresh copy.`,
    ),
  ].join("\n");

  await sendEmail({
    to: email,
    subject: `Your Verst Academy certificate — Module ${moduleCode}`,
    body,
    text: `You passed Module ${moduleCode} — ${moduleTitle}. Verify code: ${cert.verify_code}. ${verifyUrl}`,
    attachments: [{ filename, content: pdfBuffer as Buffer }],
  });
}

export async function submitQuizAttempt(
  moduleId: string,
  answers: Record<string, number>,
): Promise<QuizResult | QuizError> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in to submit a quiz." };

  // Confirm enrolment
  const { data: enrolment } = await supabase
    .from("enrolments")
    .select("id")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .maybeSingle();
  if (!enrolment) return { ok: false, error: "You must be enrolled in this module to take its quiz." };

  // Load questions WITH correct answers (RLS allows enrolled users to read).
  const { data: questions, error: qErr } = await supabase
    .from("quiz_questions")
    .select("id, question_text, options, correct_index, order_index")
    .eq("module_id", moduleId)
    .order("order_index");
  if (qErr) return { ok: false, error: qErr.message };
  if (!questions || questions.length === 0) {
    return { ok: false, error: "No questions found for this module." };
  }

  // Grade
  const graded: GradedQuestion[] = (questions as QuestionRow[]).map((q) => {
    const selected = answers[q.id];
    const sel = typeof selected === "number" ? selected : null;
    return {
      question_id: q.id,
      question_text: q.question_text,
      options: q.options,
      selected_index: sel,
      correct_index: q.correct_index,
      is_correct: sel !== null && sel === q.correct_index,
    };
  });

  const correctCount = graded.filter((g) => g.is_correct).length;
  const scorePercent = Math.round((correctCount / graded.length) * 100);
  const passed = scorePercent >= PASS_THRESHOLD;

  // Record attempt
  const { error: attErr } = await supabase.from("quiz_attempts").insert({
    user_id: user.id,
    module_id: moduleId,
    score_percent: scorePercent,
    passed,
    answers: answers as unknown,
  });
  if (attErr) return { ok: false, error: `Couldn't record attempt: ${attErr.message}` };

  // Issue certificate on first pass (idempotent)
  let certificateIssued = false;
  if (passed) {
    const { data: existingCert } = await supabase
      .from("certificates")
      .select("id")
      .eq("user_id", user.id)
      .eq("module_id", moduleId)
      .maybeSingle();
    if (!existingCert) {
      const { data: newCert, error: certErr } = await supabase
        .from("certificates")
        .insert({
          user_id: user.id,
          module_id: moduleId,
          verify_code: `VC-${moduleId.toUpperCase()}-${randomVerifyCode()}`,
        })
        .select("id, verify_code, issued_at")
        .single();
      if (!certErr && newCert) {
        certificateIssued = true;
        // Fire-and-forget: build PDF + email it. Never block the response on
        // email — the cert row is what matters; we can re-send manually if
        // delivery fails.
        void sendCertificateEmail(supabase, user.id, user.email, moduleId, newCert).catch((e) => {
          console.error("[sendCertificateEmail] failed:", e);
        });
      }
    }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/program/${moduleId}`);

  return {
    ok: true,
    scorePercent,
    passed,
    totalQuestions: graded.length,
    correctCount,
    graded,
    certificateIssued,
  };
}
