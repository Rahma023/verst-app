import Link from "next/link";
import { notFound } from "next/navigation";
import { AssetList } from "@/components/admin/asset-list";
import { AssetUploader } from "@/components/admin/asset-uploader";
import { Icon } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import { requireTutorForModule } from "@/lib/auth/require-tutor";

export const metadata = {
  title: "Lesson · Tutor — Verst Carbon Academy",
};

type LessonRow = {
  id: string;
  code: string;
  title: string;
  duration: string;
  order_index: number;
  state: string;
  module_id: string;
  modules: {
    id: string;
    code: string;
    title: string;
    section: "A" | "B";
  } | null;
};

type AssetRow = {
  id: string;
  type: "slide_deck" | "voice_over" | "avatar_video" | "resource";
  file_url: string;
  filename: string | null;
  size_bytes: number | null;
  uploaded_at: string;
};

async function getLesson(supabase: Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>, id: string) {
  const { data } = await supabase
    .from("lessons")
    .select(
      "id, code, title, duration, order_index, state, module_id, modules ( id, code, title, section )",
    )
    .eq("id", id)
    .maybeSingle();
  return data as LessonRow | null;
}

export default async function TutorLessonPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  // First fetch the lesson to know its module
  const tmpClient = await (await import("@/lib/supabase/server")).createClient();
  const lessonProbe = await getLesson(tmpClient, id);
  if (!lessonProbe || !lessonProbe.modules) notFound();

  const { supabase } = await requireTutorForModule(lessonProbe.module_id);
  const lesson = await getLesson(supabase, id);
  if (!lesson || !lesson.modules) notFound();

  const { data: assetsData } = await supabase
    .from("lesson_assets")
    .select("id, type, file_url, filename, size_bytes, uploaded_at")
    .eq("lesson_id", id)
    .order("uploaded_at", { ascending: false });
  const assets = (assetsData ?? []) as AssetRow[];

  return (
    <>
      <TopNav active="home" />
      <div className="container" style={{ padding: "32px 32px 80px", maxWidth: 1000 }}>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--ink-3)",
            letterSpacing: ".1em",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          <Link href="/tutor" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            TUTOR PORTAL
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--ink-3)" }}>MODULE {lesson.modules.code}</span>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--ink)", fontWeight: 700 }}>
            LESSON {lesson.code}
          </span>
        </div>

        <div style={{ marginBottom: 36 }}>
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--moss)",
              letterSpacing: ".18em",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            LESSON · {lesson.code}
          </div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              letterSpacing: "-.02em",
              marginBottom: 8,
            }}
          >
            {lesson.title}
          </h1>
          <p style={{ fontSize: 14, color: "var(--ink-3)", margin: 0 }}>
            From <strong style={{ color: "var(--ink-2)" }}>{lesson.modules.title}</strong>
            {" · "}
            {lesson.duration}
            {" · status: "}
            <span style={{ color: "var(--forest)" }}>{lesson.state}</span>
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 28 }}>
          <AssetUploader lessonId={lesson.id} />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Uploaded assets</h2>
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 600 }}
              >
                {assets.length} TOTAL
              </span>
            </div>
            <AssetList assets={assets} />
          </div>
        </div>

        <div
          style={{
            marginTop: 36,
            padding: "14px 18px",
            background: "var(--paper-2)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            fontSize: 13,
            color: "var(--ink-3)",
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <Icon name="sparkle" size={14} style={{ color: "var(--forest)", marginTop: 2 }} />
          <div style={{ lineHeight: 1.5 }}>
            <strong style={{ color: "var(--ink-2)" }}>Upload tips.</strong>{" "}
            Slide decks: PDF or PPTX. Voice-overs: MP3 (compressed for African network
            conditions). Avatar videos: MP4 H.264. Uploads are immediately visible to
            enrolled learners.
          </div>
        </div>
      </div>
    </>
  );
}
