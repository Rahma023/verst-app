import "server-only";

import { createClient } from "@/lib/supabase/server";

export type DashboardEnrolment = {
  module: {
    id: string;
    code: string;
    title: string;
    subtitle: string;
    duration: string;
    lesson_count: number;
    glass_icon: string;
    section: "A" | "B";
  };
  enrolledAt: string;
  status: "active" | "completed" | "dropped";
  firstLessonId: string | null;
  resumeLessonId: string | null;
  percentComplete: number;
  completedLessons: number;
};

export type DashboardData = {
  enrolments: DashboardEnrolment[];
  totals: {
    enrolled: number;
    inProgress: number;
    completedModules: number;
    completedLessons: number;
    certificates: number;
  };
};

type EnrolmentRow = {
  module_id: string;
  enrolled_at: string;
  status: "active" | "completed" | "dropped";
  modules: {
    id: string;
    code: string;
    title: string;
    subtitle: string;
    duration: string;
    lesson_count: number;
    glass_icon: string;
    section: "A" | "B";
    lessons: { id: string; order_index: number }[];
  } | null;
};

type ProgressRow = {
  lesson_id: string;
  percent_complete: number;
  last_position_seconds: number;
  completed_at: string | null;
  updated_at: string;
};

export async function getDashboardData(): Promise<DashboardData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [enrolmentsRes, progressRes, certsRes] = await Promise.all([
    supabase
      .from("enrolments")
      .select(
        `module_id, enrolled_at, status,
         modules ( id, code, title, subtitle, duration, lesson_count, glass_icon, section,
                   lessons ( id, order_index ) )`,
      )
      .eq("user_id", user.id)
      .order("enrolled_at", { ascending: false }),
    supabase
      .from("lesson_progress")
      .select("lesson_id, percent_complete, last_position_seconds, completed_at, updated_at")
      .eq("user_id", user.id),
    supabase
      .from("certificates")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const enrolmentRows = (enrolmentsRes.data ?? []) as unknown as EnrolmentRow[];
  const progressRows = (progressRes.data ?? []) as ProgressRow[];

  // Index progress by lesson_id for fast lookup
  const progressByLesson = new Map<string, ProgressRow>();
  progressRows.forEach((p) => progressByLesson.set(p.lesson_id, p));

  const enrolments: DashboardEnrolment[] = enrolmentRows
    .filter((e) => e.modules !== null)
    .map((e) => {
      const m = e.modules!;
      const sortedLessons = m.lessons
        .slice()
        .sort((a, b) => a.order_index - b.order_index);
      const firstLessonId = sortedLessons[0]?.id ?? null;

      const moduleProgress = sortedLessons.map((l) => progressByLesson.get(l.id));
      const totalCount = sortedLessons.length;
      const completedCount = moduleProgress.filter((p) => p?.completed_at).length;
      const sumPct = moduleProgress.reduce((s, p) => s + (p?.percent_complete ?? 0), 0);
      const percentComplete = totalCount > 0 ? Math.round(sumPct / totalCount) : 0;

      // Resume lesson: first lesson not yet completed; fall back to first lesson
      const nextLesson = sortedLessons.find((l) => {
        const p = progressByLesson.get(l.id);
        return !p || !p.completed_at;
      });
      const resumeLessonId = nextLesson?.id ?? firstLessonId;

      return {
        module: {
          id: m.id,
          code: m.code,
          title: m.title,
          subtitle: m.subtitle,
          duration: m.duration,
          lesson_count: m.lesson_count,
          glass_icon: m.glass_icon,
          section: m.section,
        },
        enrolledAt: e.enrolled_at,
        status: e.status,
        firstLessonId,
        resumeLessonId,
        percentComplete,
        completedLessons: completedCount,
      };
    });

  const totals = {
    enrolled: enrolments.length,
    inProgress: enrolments.filter((e) => e.percentComplete > 0 && e.percentComplete < 100).length,
    completedModules: enrolments.filter((e) => e.percentComplete >= 100).length,
    completedLessons: progressRows.filter((p) => p.completed_at).length,
    certificates: certsRes.count ?? 0,
  };

  return { enrolments, totals };
}
