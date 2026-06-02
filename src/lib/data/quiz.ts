import "server-only";

import { createClient } from "@/lib/supabase/server";

export type QuizQuestion = {
  id: string;
  question_text: string;
  options: string[];
  order_index: number;
};

// Fetched on the public surface — does NOT include correct_index, so we
// don't ship answers to the browser.
export async function getQuizQuestions(
  moduleId: string,
): Promise<QuizQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("id, question_text, options, order_index")
    .eq("module_id", moduleId)
    .order("order_index");
  if (error) throw error;
  return (data ?? []) as QuizQuestion[];
}

export type QuizModule = {
  id: string;
  code: string;
  title: string;
};

export async function getQuizModule(moduleId: string): Promise<QuizModule | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("modules")
    .select("id, code, title")
    .eq("id", moduleId)
    .eq("published", true)
    .maybeSingle<QuizModule>();
  return data ?? null;
}

export type LatestAttempt = {
  score_percent: number;
  passed: boolean;
  attempted_at: string;
};

export async function getLatestAttempt(
  moduleId: string,
): Promise<LatestAttempt | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("quiz_attempts")
    .select("score_percent, passed, attempted_at")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .order("attempted_at", { ascending: false })
    .limit(1)
    .maybeSingle<LatestAttempt>();
  return data ?? null;
}
