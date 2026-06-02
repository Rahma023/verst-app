import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { QuizPlayer } from "@/components/quiz-player";
import { TopNav } from "@/components/top-nav";
import {
  getLatestAttempt,
  getQuizModule,
  getQuizQuestions,
} from "@/lib/data/quiz";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(props: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await props.params;
  const mod = await getQuizModule(moduleId);
  if (!mod) return { title: "Module quiz — Verst Carbon Academy" };
  return {
    title: `Module ${mod.code} quiz — Verst Carbon Academy`,
  };
}

export default async function QuizPage(props: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await props.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const mod = await getQuizModule(moduleId);
  if (!mod) notFound();

  const { data: enrolment } = await supabase
    .from("enrolments")
    .select("id")
    .eq("user_id", user.id)
    .eq("module_id", moduleId)
    .maybeSingle();
  if (!enrolment) redirect(`/program/${moduleId}`);

  const [questions, latest] = await Promise.all([
    getQuizQuestions(moduleId),
    getLatestAttempt(moduleId),
  ]);

  return (
    <>
      <TopNav active="program" />
      <div className="container" style={{ padding: "24px 32px 0" }}>
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
          <Link href="/dashboard" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            DASHBOARD
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <Link
            href={`/program/${mod.id}`}
            style={{ color: "var(--ink-3)", textDecoration: "none" }}
          >
            MODULE {mod.code}
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--ink)", fontWeight: 700 }}>QUIZ</span>
        </div>

        <div style={{ marginBottom: 24, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
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
            MODULE QUIZ · {questions.length} QUESTIONS · 80% TO PASS
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-.025em" }}
          >
            {mod.title}
          </h1>
          {latest && (
            <p
              style={{
                fontSize: 13,
                color: "var(--ink-3)",
                marginTop: 10,
                display: "inline-flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              Previous attempt:{" "}
              <strong style={{ color: latest.passed ? "var(--forest)" : "var(--bad)" }}>
                {latest.score_percent}% · {latest.passed ? "passed" : "did not pass"}
              </strong>
            </p>
          )}
        </div>
      </div>

      {questions.length === 0 ? (
        <div
          style={{
            maxWidth: 600,
            margin: "20px auto 80px",
            padding: 24,
            border: "1px dashed var(--line)",
            borderRadius: 12,
            textAlign: "center",
            color: "var(--ink-3)",
          }}
        >
          No quiz questions configured for this module yet. Check back soon.
        </div>
      ) : (
        <QuizPlayer module={mod} questions={questions} />
      )}
    </>
  );
}
