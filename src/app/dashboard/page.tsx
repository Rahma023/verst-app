import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon, type IconName } from "@/components/icon";
import { ModuleThumb } from "@/components/module-thumb";
import { TopNav } from "@/components/top-nav";
import { getDashboardData } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Dashboard — Verst Carbon Academy",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const data = await getDashboardData();
  if (!data) redirect("/");

  const { enrolments, totals } = data;
  const fullName =
    (user.user_metadata?.full_name as string | undefined) ?? user.email ?? "learner";
  const firstName = fullName.split(" ")[0];

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle<{ role: string }>();

  const { data: questionRows } = await supabase
    .from("learner_questions")
    .select(
      "id, question_text, status, asked_at, answer_text, answered_at, modules ( code, title ), lessons ( code, title )",
    )
    .eq("learner_user_id", user.id)
    .order("asked_at", { ascending: false })
    .limit(5);
  type LQ = {
    id: string;
    question_text: string;
    status: string;
    asked_at: string;
    answer_text: string | null;
    answered_at: string | null;
    modules: { code: string; title: string } | null;
    lessons: { code: string; title: string } | null;
  };
  const myQuestions = (questionRows ?? []) as unknown as LQ[];

  return (
    <>
      <TopNav active="home" />

      <div className="container" style={{ padding: "32px 32px 80px", maxWidth: 1200 }}>
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
            YOUR DASHBOARD
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(32px, 4.5vw, 52px)", letterSpacing: "-.025em" }}
          >
            Welcome back, <em>{firstName}</em>.
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
            {totals.enrolled > 0
              ? `${totals.enrolled} module${
                  totals.enrolled === 1 ? "" : "s"
                } in your learning queue.`
              : "You haven't enrolled in a module yet. Browse the program to get started."}
          </p>
        </header>

        {(profile?.role === "admin" || profile?.role === "tutor") && (
          <div
            style={{
              padding: "14px 18px",
              border: "1px solid var(--forest)",
              background: "rgba(0,128,55,.05)",
              borderRadius: 10,
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            <Icon name="sparkle" size={16} style={{ color: "var(--forest)" }} />
            <div style={{ flex: 1, fontSize: 13.5 }}>
              You have <strong>{profile.role}</strong> access.{" "}
              {profile.role === "admin"
                ? "Open the Studio to manage modules, lessons and uploads."
                : "Open the Tutor Portal to upload lesson content and answer learner questions."}
            </div>
            <Link
              href={profile.role === "admin" ? "/admin" : "/tutor"}
              className="btn btn-pri btn-sm"
              style={{ textDecoration: "none" }}
            >
              Open {profile.role === "admin" ? "Studio" : "Tutor Portal"} →
            </Link>
          </div>
        )}

        {/* KPI row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 40,
          }}
        >
          {(
            [
              ["Enrolled", totals.enrolled, "book"],
              ["In progress", totals.inProgress, "compass"],
              ["Lessons done", totals.completedLessons, "check"],
              ["Certificates", totals.certificates, "trophy"],
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
              <div
                className="num"
                style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-.02em" }}
              >
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

        {/* Continue learning */}
        <section style={{ marginBottom: 48 }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <h2
              className="display"
              style={{ fontSize: "clamp(22px, 3vw, 30px)", letterSpacing: "-.015em" }}
            >
              Continue <em>learning</em>.
            </h2>
            <Link
              href="/program"
              style={{
                fontSize: 13,
                color: "var(--ink-2)",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline-flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              Browse all modules <Icon name="arrow-ne" size={12} />
            </Link>
          </div>

          {enrolments.length === 0 ? (
            <div
              style={{
                padding: "40px 24px",
                textAlign: "center",
                background: "var(--paper-2)",
                border: "1px dashed var(--line)",
                borderRadius: 12,
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: "var(--ink-3)",
                  marginBottom: 16,
                }}
              >
                Pick a module from the catalogue to get started.
              </p>
              <Link href="/program" className="btn btn-pri">
                Explore the program →
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 18,
              }}
            >
              {enrolments.map((e) => (
                <article
                  key={e.module.id}
                  className="hover-lift"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--line)",
                    borderRadius: 12,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ position: "relative", aspectRatio: "16/10" }}>
                    <ModuleThumb
                      moduleId={e.module.id}
                      icon={e.module.glass_icon as IconName}
                      code={e.module.code}
                      label={e.module.title}
                      style={{ height: "100%", borderRadius: 0 }}
                    />
                    <span
                      className="mono"
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        padding: "5px 9px",
                        background: "rgba(255,255,255,.92)",
                        color: "var(--ink)",
                        borderRadius: 99,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: ".06em",
                      }}
                    >
                      MODULE {e.module.code}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      flex: 1,
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-.005em" }}>
                        {e.module.title}
                      </h3>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--ink-3)",
                          marginTop: 4,
                          lineHeight: 1.45,
                        }}
                      >
                        {e.module.subtitle}
                      </p>
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <span
                          className="mono"
                          style={{
                            fontSize: 10,
                            letterSpacing: ".1em",
                            color: "var(--ink-3)",
                            fontWeight: 600,
                          }}
                        >
                          {e.completedLessons}/{e.module.lesson_count} LESSONS
                        </span>
                        <span
                          className="mono"
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--forest)",
                          }}
                        >
                          {e.percentComplete}%
                        </span>
                      </div>
                      <div className="bar bar-thick">
                        <i style={{ width: `${e.percentComplete}%` }} />
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "center",
                        marginTop: "auto",
                      }}
                    >
                      {e.resumeLessonId ? (
                        <Link
                          href={`/lesson/${e.resumeLessonId}`}
                          className="btn btn-pri btn-sm"
                          style={{ textDecoration: "none", flex: 1, justifyContent: "center" }}
                        >
                          {e.percentComplete > 0 ? "Resume" : "Start"} →
                        </Link>
                      ) : (
                        <span
                          className="btn btn-ghost btn-sm"
                          style={{ flex: 1, justifyContent: "center", cursor: "default" }}
                        >
                          Coming soon
                        </span>
                      )}
                      <Link
                        href={`/program/${e.module.id}`}
                        className="btn btn-ghost btn-sm"
                        style={{ textDecoration: "none" }}
                      >
                        Syllabus
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {myQuestions.length > 0 && (
          <section style={{ marginBottom: 48 }}>
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
                style={{ fontSize: "clamp(22px, 3vw, 30px)", letterSpacing: "-.015em" }}
              >
                Your <em>questions</em>.
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {myQuestions.map((q) => (
                <article
                  key={q.id}
                  style={{
                    padding: 18,
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    background: "var(--card)",
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: ".14em",
                      fontWeight: 700,
                      color:
                        q.status === "answered" ? "var(--forest)" : "var(--clay)",
                      marginBottom: 8,
                    }}
                  >
                    {q.status === "answered" ? "✓ ANSWERED" : "● AWAITING TUTOR"}
                    {" · MODULE "}
                    {q.modules?.code ?? "?"}
                    {q.lessons?.code ? ` · LESSON ${q.lessons.code}` : ""}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      lineHeight: 1.45,
                      marginBottom: q.answer_text ? 12 : 0,
                    }}
                  >
                    {q.question_text}
                  </div>
                  {q.answer_text && (
                    <div
                      style={{
                        padding: "10px 14px",
                        background: "var(--paper-2)",
                        borderLeft: "3px solid var(--forest)",
                        borderRadius: 4,
                        fontSize: 13.5,
                        color: "var(--ink-2)",
                        lineHeight: 1.55,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {q.answer_text}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
