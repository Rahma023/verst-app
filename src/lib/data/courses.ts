import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Course, Lesson, LessonState } from "@/data/courses";
import type { IconName } from "@/components/icon";
import type { ClimateVizVariant } from "@/components/climate-viz";

type LessonRow = {
  id: string;
  code: string;
  title: string;
  duration: string;
  order_index: number;
  state: LessonState;
};

type ModuleRow = {
  id: string;
  code: string;
  section: "A" | "B";
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  certifies: boolean;
  price_text: string;
  visual: ClimateVizVariant;
  glass_icon: IconName;
  lesson_count: number;
  order_index: number;
  status: "live" | "in-production" | "recording" | "planned";
  instructor_name: string | null;
  instructor_role: string | null;
  published: boolean;
  lessons?: LessonRow[];
};

const MODULE_FIELDS =
  "id, code, section, title, subtitle, category, duration, level, certifies, price_text, visual, glass_icon, lesson_count, order_index, status, instructor_name, instructor_role, published";

function toLesson(r: LessonRow): Lesson {
  return { id: r.id, t: r.title, dur: r.duration, state: r.state };
}

function toCourse(r: ModuleRow): Course {
  const syllabus = (r.lessons ?? [])
    .slice()
    .sort((a, b) => a.order_index - b.order_index)
    .map(toLesson);
  return {
    id: r.id,
    code: r.code,
    section: r.section,
    title: r.title,
    sub: r.subtitle,
    cat: r.category,
    dur: r.duration,
    lvl: r.level,
    cert: r.certifies,
    price: r.price_text,
    inst: r.instructor_name ?? "TBA",
    instRole: r.instructor_role ?? "",
    visual: r.visual,
    glassIcon: r.glass_icon,
    progress: 0,
    lessons: r.lesson_count,
    mods: 1,
    status: r.status,
    syllabus,
  };
}

export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select(MODULE_FIELDS)
    .eq("published", true)
    .order("order_index");
  if (error) throw error;
  return (data as ModuleRow[]).map(toCourse);
}

export async function getCoursesWithSyllabus(): Promise<Course[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select(
      `${MODULE_FIELDS}, lessons (id, code, title, duration, order_index, state)`,
    )
    .eq("published", true)
    .order("order_index");
  if (error) throw error;
  return (data as ModuleRow[]).map(toCourse);
}

export async function getCourseById(id: string): Promise<Course | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select(
      `${MODULE_FIELDS}, lessons (id, code, title, duration, order_index, state)`,
    )
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return toCourse(data as ModuleRow);
}
