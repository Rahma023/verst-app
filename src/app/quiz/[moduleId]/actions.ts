"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
      const { error: certErr } = await supabase.from("certificates").insert({
        user_id: user.id,
        module_id: moduleId,
        verify_code: `VC-${moduleId.toUpperCase()}-${randomVerifyCode()}`,
      });
      if (!certErr) certificateIssued = true;
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
