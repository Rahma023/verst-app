"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AnswerResult = { ok: true } | { ok: false; error: string };

export async function submitAnswer(
  questionId: string,
  answerText: string,
): Promise<AnswerResult> {
  const trimmed = answerText.trim();
  if (trimmed.length < 5) {
    return { ok: false, error: "Please write a longer answer (at least 5 characters)." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };

  const { error } = await supabase
    .from("learner_questions")
    .update({
      answer_text: trimmed,
      tutor_user_id: user.id,
      status: "answered",
      answered_at: new Date().toISOString(),
    })
    .eq("id", questionId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/tutor/questions/${questionId}`);
  revalidatePath("/tutor/questions");
  revalidatePath("/tutor");
  return { ok: true };
}

export async function reopenQuestion(questionId: string) {
  const supabase = await createClient();
  await supabase
    .from("learner_questions")
    .update({
      answer_text: null,
      tutor_user_id: null,
      status: "open",
      answered_at: null,
    })
    .eq("id", questionId);
  revalidatePath(`/tutor/questions/${questionId}`);
  revalidatePath("/tutor/questions");
  redirect(`/tutor/questions/${questionId}`);
}
