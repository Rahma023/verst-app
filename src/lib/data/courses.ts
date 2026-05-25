import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/data/courses";
import type { IconName } from "@/components/icon";
import type { ClimateVizVariant } from "@/components/climate-viz";

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
};

function toCourse(r: ModuleRow): Course {
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
  };
}

export async function getCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("modules")
    .select(
      "id, code, section, title, subtitle, category, duration, level, certifies, price_text, visual, glass_icon, lesson_count, order_index, status, instructor_name, instructor_role, published",
    )
    .eq("published", true)
    .order("order_index");
  if (error) throw error;
  return (data as ModuleRow[]).map(toCourse);
}
