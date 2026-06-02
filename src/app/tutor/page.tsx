import Link from "next/link";
import { Icon, type IconName } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import { requireTutor } from "@/lib/auth/require-tutor";
import { getTutorModules, getTutorQuestions } from "@/lib/data/tutor";

export const metadata = {
  title: "Tutor Portal — Verst Carbon Academy",
};

export default async function TutorLandingPage() {
  const { profile, supabase } = await requireTutor();
  const [modules, questions] = await Promise.all([
    getTutorModules(),
    getTutorQuestions(),
  ]);

  const openQuestions = questions.filter((q) => q.status === "open").length;
  const assignedModuleIds = new Set(modules.map((m) => m.id));
  const myQuestions = questions.filter((q) => assignedModuleIds.has(q.module_id));
  const lessonsCount = modules.reduce((s, m) => s + m.lessons.length, 0);

  // Asset counts for context — single query
  const lessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id));
  let assetsByLesson = new Map<string, number>();
  if (lessonIds.length > 0) {
    const { data: assetRows } = await supabase
      .from("lesson_assets")
      .select("lesson_id")
      .in("lesson_id", lessonIds);
    (assetRows ?? []).forEach((a: { lesson_id: string }) => {
      assetsByLesson.set(a.lesson_id, (assetsByLesson.get(a.lesson_id) ?? 0) + 1);
    });
  }

  return (
    <>
      <TopNav active="home" />
      <div className="container" style={{ padding: "32px 32px 80px", maxWidth: 1100 }}>
        <header style={{ marginBottom: 32 }}>
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
            TUTOR PORTAL
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(32px, 4.5vw, 48px)", letterSpacing: "-.025em" }}
          >
            Welcome back, {profile?.full_name?.split(" ")[0] ?? "tutor"}.
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--ink-2)",
              marginTop: 8,
              maxWidth: 620,
              lineHeight: 1.55,
            }}
          >
            Upload lesson content for your assigned modules and answer learner
            questions. You manage only the modules you're assigned to.
          </p>
        </header>

        {/* KPIs */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 14,
            marginBottom: 36,
          }}
        >
          {(
            [
              ["Modules assigned", modules.length, "book"],
              ["Lessons in pipeline", lessonsCount, "edit"],
              ["Open questions", openQuestions, "msg"],
            ] as const
          ).map(([label, value, icon]) => (
            <div
              key={label}
              style={{
                padding: 20,
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <Icon name={icon as IconName} size={20} style={{ color: "var(--forest)" }} />
              <div className="num" style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-.02em" }}>
                {value}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: ".12em",
                  color: "var(--ink-3)",
                  fontWeight: 700,
                }}
              >
                {label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
          <Link href="/tutor/questions" className="btn btn-pri" style={{ textDecoration: "none" }}>
            <Icon name="msg" size={14} /> Student-question inbox
            {openQuestions > 0 && (
              <span
                className="mono"
                style={{
                  marginLeft: 6,
                  padding: "2px 7px",
                  borderRadius: 99,
                  background: "rgba(255,255,255,.2)",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {openQuestions}
              </span>
            )}
          </Link>
        </div>

        {/* Modules list */}
        {modules.length === 0 ? (
          <div
            style={{
              padding: "32px 24px",
              border: "1px dashed var(--line)",
              borderRadius: 12,
              textAlign: "center",
              color: "var(--ink-3)",
              fontSize: 14,
              background: "var(--paper-2)",
            }}
          >
            You haven't been assigned to any modules yet. Reach out to the admin to get
            assigned.
          </div>
        ) : (
          <section>
            <h2
              className="display"
              style={{ fontSize: "clamp(22px, 3vw, 28px)", letterSpacing: "-.015em", marginBottom: 18 }}
            >
              Your <em>modules</em>.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {modules.map((m) => {
                const moduleAssets = m.lessons.reduce(
                  (s, l) => s + (assetsByLesson.get(l.id) ?? 0),
                  0,
                );
                return (
                  <article
                    key={m.id}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: 10,
                      overflow: "hidden",
                      background: "var(--card)",
                    }}
                  >
                    <header
                      style={{
                        padding: "18px 22px",
                        background: "var(--paper-2)",
                        borderBottom: "1px solid var(--line)",
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto",
                        gap: 18,
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: 28,
                          color: "var(--forest)",
                          letterSpacing: "-.02em",
                          width: 44,
                        }}
                      >
                        {m.code}
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{m.title}</div>
                        <div
                          className="mono"
                          style={{
                            fontSize: 10,
                            color: "var(--ink-3)",
                            marginTop: 2,
                            letterSpacing: ".12em",
                            fontWeight: 600,
                          }}
                        >
                          SECTION {m.section} · {m.category.toUpperCase()}
                        </div>
                      </div>
                      <span
                        className="mono"
                        style={{
                          fontSize: 11,
                          color: "var(--ink-3)",
                          fontWeight: 600,
                        }}
                      >
                        {m.lessons.length} lessons · {moduleAssets} asset
                        {moduleAssets === 1 ? "" : "s"}
                      </span>
                    </header>
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {m.lessons.map((l, j) => {
                        const count = assetsByLesson.get(l.id) ?? 0;
                        return (
                          <li
                            key={l.id}
                            style={{
                              borderBottom:
                                j < m.lessons.length - 1
                                  ? "1px solid var(--line-2)"
                                  : "none",
                            }}
                          >
                            <Link
                              href={`/tutor/lessons/${l.id}`}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "auto 1fr auto auto",
                                gap: 16,
                                alignItems: "center",
                                padding: "14px 22px",
                                textDecoration: "none",
                                color: "inherit",
                              }}
                            >
                              <span
                                className="mono"
                                style={{
                                  fontSize: 12,
                                  color: "var(--forest)",
                                  fontWeight: 700,
                                  width: 44,
                                }}
                              >
                                {l.code}
                              </span>
                              <span style={{ fontSize: 14, fontWeight: 500 }}>
                                {l.title}
                              </span>
                              <span
                                className="mono"
                                style={{
                                  fontSize: 10,
                                  color:
                                    count > 0
                                      ? "var(--forest)"
                                      : "var(--ink-4)",
                                  fontWeight: 700,
                                  letterSpacing: ".1em",
                                }}
                              >
                                {count > 0
                                  ? `${count} ASSET${count === 1 ? "" : "S"}`
                                  : "NO ASSETS"}
                              </span>
                              <Icon
                                name="arrow-r"
                                size={14}
                                style={{ color: "var(--ink-3)" }}
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Recent questions preview */}
        {myQuestions.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 18,
              }}
            >
              <h2
                className="display"
                style={{ fontSize: "clamp(22px, 3vw, 28px)", letterSpacing: "-.015em" }}
              >
                Recent <em>questions</em>.
              </h2>
              <Link
                href="/tutor/questions"
                style={{
                  fontSize: 13,
                  color: "var(--ink-2)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Open inbox →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myQuestions.slice(0, 5).map((q) => (
                <Link
                  key={q.id}
                  href={`/tutor/questions/${q.id}`}
                  style={{
                    padding: "14px 18px",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    background: "var(--card)",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    gap: 14,
                    alignItems: "center",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: q.status === "open" ? "var(--clay)" : "var(--ink-3)",
                      letterSpacing: ".1em",
                      fontWeight: 700,
                      width: 78,
                    }}
                  >
                    {q.status === "open" ? "● OPEN" : "ANSWERED"}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>
                      {q.question_text.length > 90
                        ? q.question_text.slice(0, 90) + "…"
                        : q.question_text}
                    </div>
                    <div
                      className="mono"
                      style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".06em" }}
                    >
                      {q.learner_full_name ?? "Anonymous"} · MODULE {q.module_code}
                      {q.lesson_code ? ` · LESSON ${q.lesson_code}` : ""}
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
