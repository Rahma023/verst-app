import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/lesson-player";
import { TopNav } from "@/components/top-nav";
import { getLessonForPlayer } from "@/lib/data/lessons";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const data = await getLessonForPlayer(id);
  if (!data) return { title: "Lesson — Verst Carbon Academy" };
  return {
    title: `${data.lesson.code} · ${data.lesson.title} — Verst Carbon Academy`,
  };
}

export default async function LessonPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const data = await getLessonForPlayer(id);
  if (!data) notFound();

  // Enrolment guard
  const { data: enrolment } = await supabase
    .from("enrolments")
    .select("id")
    .eq("user_id", user.id)
    .eq("module_id", data.module.id)
    .maybeSingle();
  if (!enrolment) redirect(`/program/${data.module.id}`);

  // Resume position
  const { data: progress } = await supabase
    .from("lesson_progress")
    .select("percent_complete, last_position_seconds")
    .eq("user_id", user.id)
    .eq("lesson_id", id)
    .maybeSingle<{ percent_complete: number; last_position_seconds: number }>();

  return (
    <>
      <TopNav active="program" />
      <LessonPlayer
        data={data}
        initialPercent={progress?.percent_complete ?? 0}
        initialPosition={progress?.last_position_seconds ?? 0}
      />
    </>
  );
}
