import Link from "next/link";
import { Icon } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import { requireTutor } from "@/lib/auth/require-tutor";
import { getTutorQuestions } from "@/lib/data/tutor";

export const metadata = {
  title: "Student questions — Tutor Portal",
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  const ms = Date.now() - d.getTime();
  const h = Math.floor(ms / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default async function TutorQuestionsInbox() {
  await requireTutor();
  const questions = await getTutorQuestions();

  const open = questions.filter((q) => q.status === "open");
  const answered = questions.filter((q) => q.status === "answered");

  return (
    <>
      <TopNav active="home" />
      <div className="container" style={{ padding: "32px 32px 80px", maxWidth: 980 }}>
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
          <span style={{ color: "var(--ink)", fontWeight: 700 }}>QUESTIONS</span>
        </div>

        <header style={{ marginBottom: 28 }}>
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
            STUDENT QUESTIONS
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-.02em" }}
          >
            Inbox &nbsp;
            <span className="num" style={{ color: "var(--forest)" }}>
              {open.length}
            </span>
            <span style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-3)" }}>
              {" "}open
            </span>
          </h1>
        </header>

        <section style={{ marginBottom: 36 }}>
          <h2
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--ink-3)",
              letterSpacing: ".14em",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            OPEN · {open.length}
          </h2>
          {open.length === 0 ? (
            <div
              style={{
                padding: 24,
                border: "1px dashed var(--line)",
                borderRadius: 12,
                textAlign: "center",
                color: "var(--ink-3)",
                fontSize: 13.5,
                background: "var(--paper-2)",
              }}
            >
              All caught up. No open questions right now.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {open.map((q) => (
                <Link
                  key={q.id}
                  href={`/tutor/questions/${q.id}`}
                  style={{
                    padding: "16px 20px",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    background: "var(--card)",
                    textDecoration: "none",
                    color: "inherit",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--clay)",
                      letterSpacing: ".14em",
                      fontWeight: 700,
                      width: 50,
                    }}
                  >
                    ● OPEN
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                      {q.question_text.length > 120
                        ? q.question_text.slice(0, 120) + "…"
                        : q.question_text}
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: "var(--ink-3)",
                        letterSpacing: ".06em",
                      }}
                    >
                      {q.learner_full_name ?? "Anonymous"} · MODULE {q.module_code}
                      {q.lesson_code ? ` · LESSON ${q.lesson_code}` : ""} · {formatWhen(q.asked_at)}
                    </div>
                  </div>
                  <Icon name="arrow-r" size={14} style={{ color: "var(--ink-3)" }} />
                </Link>
              ))}
            </div>
          )}
        </section>

        {answered.length > 0 && (
          <section>
            <h2
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--ink-3)",
                letterSpacing: ".14em",
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              ANSWERED · {answered.length}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {answered.slice(0, 20).map((q) => (
                <Link
                  key={q.id}
                  href={`/tutor/questions/${q.id}`}
                  style={{
                    padding: "12px 18px",
                    border: "1px solid var(--line-2)",
                    borderRadius: 8,
                    background: "var(--paper-2)",
                    textDecoration: "none",
                    color: "inherit",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--forest)",
                      letterSpacing: ".14em",
                      fontWeight: 700,
                      width: 70,
                    }}
                  >
                    ✓ ANSWERED
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>
                      {q.question_text.length > 100
                        ? q.question_text.slice(0, 100) + "…"
                        : q.question_text}
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: "var(--ink-3)",
                        letterSpacing: ".06em",
                        marginTop: 2,
                      }}
                    >
                      MODULE {q.module_code} · {formatWhen(q.answered_at ?? q.asked_at)}
                    </div>
                  </div>
                  <Icon name="arrow-r" size={14} style={{ color: "var(--ink-3)" }} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
