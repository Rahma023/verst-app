import "server-only";

import { createClient } from "@/lib/supabase/server";

export type LessonAsset = {
  id: string;
  type: "slide_deck" | "voice_over" | "avatar_video" | "resource";
  file_url: string;
  filename: string | null;
  size_bytes: number | null;
  uploaded_at: string;
};

export type LessonPlayerData = {
  lesson: {
    id: string;
    code: string;
    title: string;
    duration: string;
    order_index: number;
    state: "content" | "qa" | "planned";
    transcript_text: string | null;
  };
  module: {
    id: string;
    code: string;
    title: string;
    section: "A" | "B";
  };
  siblings: { id: string; code: string; title: string; order_index: number }[];
  assets: LessonAsset[];
};

type LessonRow = {
  id: string;
  code: string;
  title: string;
  duration: string;
  order_index: number;
  state: "content" | "qa" | "planned";
  transcript_text: string | null;
  module_id: string;
  modules: {
    id: string;
    code: string;
    title: string;
    section: "A" | "B";
  } | null;
};

export async function getLessonForPlayer(
  lessonId: string,
): Promise<LessonPlayerData | null> {
  const supabase = await createClient();

  const { data: lessonData, error } = await supabase
    .from("lessons")
    .select(
      "id, code, title, duration, order_index, state, transcript_text, module_id, modules ( id, code, title, section )",
    )
    .eq("id", lessonId)
    .maybeSingle();
  if (error) throw error;
  if (!lessonData) return null;

  const lesson = lessonData as unknown as LessonRow;
  if (!lesson.modules) return null;

  const [{ data: siblings }, { data: assets }] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, code, title, order_index")
      .eq("module_id", lesson.module_id)
      .order("order_index"),
    supabase
      .from("lesson_assets")
      .select("id, type, file_url, filename, size_bytes, uploaded_at")
      .eq("lesson_id", lessonId)
      .order("uploaded_at", { ascending: false }),
  ]);

  return {
    lesson: {
      id: lesson.id,
      code: lesson.code,
      title: lesson.title,
      duration: lesson.duration,
      order_index: lesson.order_index,
      state: lesson.state,
      transcript_text: lesson.transcript_text,
    },
    module: lesson.modules,
    siblings: siblings ?? [],
    assets: (assets ?? []) as LessonAsset[],
  };
}

export async function getFirstLessonId(moduleId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lessons")
    .select("id")
    .eq("module_id", moduleId)
    .order("order_index")
    .limit(1)
    .maybeSingle<{ id: string }>();
  return data?.id ?? null;
}
