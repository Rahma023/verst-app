import "server-only";

import { createClient } from "@/lib/supabase/server";

export type TutorModule = {
  id: string;
  code: string;
  title: string;
  section: "A" | "B";
  category: string;
  lesson_count: number;
  order_index: number;
  lessons: { id: string; code: string; title: string; order_index: number }[];
};

export type LearnerQuestion = {
  id: string;
  module_id: string;
  module_code: string;
  module_title: string;
  lesson_id: string | null;
  lesson_code: string | null;
  lesson_title: string | null;
  learner_full_name: string | null;
  question_text: string;
  status: "open" | "answered" | "archived";
  asked_at: string;
  answer_text: string | null;
  answered_at: string | null;
};

type AssignmentJoin = {
  module_id: string;
  modules: {
    id: string;
    code: string;
    title: string;
    section: "A" | "B";
    category: string;
    lesson_count: number;
    order_index: number;
    lessons: { id: string; code: string; title: string; order_index: number }[];
  } | null;
};

type QuestionRow = {
  id: string;
  module_id: string;
  learner_user_id: string;
  lesson_id: string | null;
  question_text: string;
  status: "open" | "answered" | "archived";
  asked_at: string;
  answer_text: string | null;
  answered_at: string | null;
  modules: { code: string; title: string } | null;
  lessons: { code: string; title: string } | null;
};

export async function getTutorModules(): Promise<TutorModule[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("tutor_assignments")
    .select(
      `module_id,
       modules ( id, code, title, section, category, lesson_count, order_index,
                 lessons ( id, code, title, order_index ) )`,
    )
    .eq("tutor_user_id", user.id);
  if (error) throw error;

  const rows = (data ?? []) as unknown as AssignmentJoin[];
  return rows
    .filter((r) => r.modules !== null)
    .map((r) => {
      const m = r.modules!;
      return {
        id: m.id,
        code: m.code,
        title: m.title,
        section: m.section,
        category: m.category,
        lesson_count: m.lesson_count,
        order_index: m.order_index,
        lessons: m.lessons.slice().sort((a, b) => a.order_index - b.order_index),
      };
    })
    .sort((a, b) => a.order_index - b.order_index);
}

async function attachLearnerNames(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: QuestionRow[],
): Promise<Map<string, string | null>> {
  const ids = Array.from(new Set(rows.map((r) => r.learner_user_id)));
  if (ids.length === 0) return new Map();
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, full_name")
    .in("user_id", ids);
  if (error) throw error;
  const map = new Map<string, string | null>();
  (data ?? []).forEach((p: { user_id: string; full_name: string | null }) => {
    map.set(p.user_id, p.full_name);
  });
  return map;
}

function toLearnerQuestion(
  r: QuestionRow,
  names: Map<string, string | null>,
): LearnerQuestion {
  return {
    id: r.id,
    module_id: r.module_id,
    module_code: r.modules?.code ?? "?",
    module_title: r.modules?.title ?? "Unknown module",
    lesson_id: r.lesson_id,
    lesson_code: r.lessons?.code ?? null,
    lesson_title: r.lessons?.title ?? null,
    learner_full_name: names.get(r.learner_user_id) ?? null,
    question_text: r.question_text,
    status: r.status,
    asked_at: r.asked_at,
    answer_text: r.answer_text,
    answered_at: r.answered_at,
  };
}

export async function getTutorQuestions(): Promise<LearnerQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learner_questions")
    .select(
      `id, module_id, learner_user_id, lesson_id, question_text, status,
       asked_at, answer_text, answered_at,
       modules ( code, title ),
       lessons ( code, title )`,
    )
    .order("asked_at", { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as unknown as QuestionRow[];
  const names = await attachLearnerNames(supabase, rows);
  return rows.map((r) => toLearnerQuestion(r, names));
}

export async function getQuestion(id: string): Promise<LearnerQuestion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learner_questions")
    .select(
      `id, module_id, learner_user_id, lesson_id, question_text, status,
       asked_at, answer_text, answered_at,
       modules ( code, title ),
       lessons ( code, title )`,
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as unknown as QuestionRow;
  const names = await attachLearnerNames(supabase, [r]);
  return toLearnerQuestion(r, names);
}
