import Link from "next/link";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/top-nav";
import { TutorAnswerForm } from "@/components/tutor-answer-form";
import { requireTutor } from "@/lib/auth/require-tutor";
import { getQuestion } from "@/lib/data/tutor";

export const metadata = {
  title: "Question — Tutor Portal",
};

export default async function QuestionPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  await requireTutor();
  const q = await getQuestion(id);
  if (!q) notFound();

  const isOpen = q.status === "open";

  return (
    <>
      <TopNav active="home" />
      <div className="container" style={{ padding: "32px 32px 80px", maxWidth: 760 }}>
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
          <Link
            href="/tutor/questions"
            style={{ color: "var(--ink-3)", textDecoration: "none" }}
          >
            QUESTIONS
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--ink)", fontWeight: 700 }}>
            {isOpen ? "OPEN" : "ANSWERED"}
          </span>
        </div>

        <header style={{ marginBottom: 24 }}>
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: isOpen ? "var(--clay)" : "var(--forest)",
              letterSpacing: ".18em",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            {isOpen ? "● OPEN QUESTION" : "✓ ANSWERED"}
          </div>
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              letterSpacing: ".08em",
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            MODULE {q.module_code}: {q.module_title}
            {q.lesson_code && (
              <>
                {" · "}
                LESSON {q.lesson_code}: {q.lesson_title}
              </>
            )}
          </div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              lineHeight: 1.5,
              color: "var(--ink)",
              letterSpacing: "-.005em",
            }}
          >
            {q.question_text}
          </h1>
          <div
            className="mono"
            style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 12, letterSpacing: ".06em" }}
          >
            Asked by{" "}
            <strong style={{ color: "var(--ink-2)" }}>
              {q.learner_full_name ?? "Anonymous learner"}
            </strong>
            {" · "}
            {new Date(q.asked_at).toLocaleString()}
          </div>
        </header>

        {q.answer_text && (
          <section
            style={{
              padding: 20,
              border: "1px solid var(--line)",
              borderRadius: 10,
              background: "var(--card)",
              marginBottom: 24,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--forest)",
                letterSpacing: ".14em",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              YOUR ANSWER
            </div>
            <div
              style={{
                fontSize: 14.5,
                color: "var(--ink-2)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}
            >
              {q.answer_text}
            </div>
            <div
              className="mono"
              style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 14, letterSpacing: ".06em" }}
            >
              ANSWERED {q.answered_at ? new Date(q.answered_at).toLocaleString() : ""}
            </div>
          </section>
        )}

        {isOpen ? (
          <section>
            <h2
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--moss)",
                letterSpacing: ".14em",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              YOUR ANSWER
            </h2>
            <TutorAnswerForm questionId={q.id} />
          </section>
        ) : (
          <Link
            href="/tutor/questions"
            className="btn btn-ghost"
            style={{ textDecoration: "none" }}
          >
            ← Back to inbox
          </Link>
        )}
      </div>
    </>
  );
}
