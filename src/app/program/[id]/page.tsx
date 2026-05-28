import Link from "next/link";
import { notFound } from "next/navigation";
import { EnrollButton } from "@/components/enroll-button";
import { Footer } from "@/components/footer";
import { GlassThumb } from "@/components/glass-thumb";
import { Icon } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import { getCourseById } from "@/lib/data/courses";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const course = await getCourseById(id);
  if (!course) return { title: "Module — Verst Carbon Academy" };
  return {
    title: `Module ${course.code}: ${course.title} — Verst Carbon Academy`,
    description: course.sub,
  };
}

export default async function ModuleDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const course = await getCourseById(id);
  if (!course) notFound();

  const syllabus = course.syllabus ?? [];
  const half = Math.ceil(syllabus.length / 2);
  const sections = [
    { label: "Section 01", lessons: syllabus.slice(0, half) },
    { label: "Section 02", lessons: syllabus.slice(half) },
  ].filter((s) => s.lessons.length > 0);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const signedIn = !!user;

  let enrolled = false;
  if (user) {
    const { data: enrolment } = await supabase
      .from("enrolments")
      .select("id")
      .eq("user_id", user.id)
      .eq("module_id", course.id)
      .maybeSingle();
    enrolled = !!enrolment;
  }

  const durationTail = course.dur.split("·")[1]?.trim() ?? course.dur;

  return (
    <>
      <TopNav active="program" />

      {/* breadcrumb */}
      <div className="container" style={{ padding: "18px 32px 0" }}>
        <div
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".1em", fontWeight: 600 }}
        >
          <Link href="/" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            HOME
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <Link href="/program" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            THE PROGRAM
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--ink)", fontWeight: 700 }}>
            {course.section === "B" ? `MODULE ${course.code}` : `MODULE ${course.code}`}
          </span>
        </div>
      </div>

      {/* HERO */}
      <section
        className="container"
        style={{
          padding: "40px 32px 56px",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: 64,
          alignItems: "end",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div>
          <div style={{ display: "flex", gap: 14, alignItems: "baseline", marginBottom: 14 }}>
            <span
              style={{
                fontSize: 80,
                fontWeight: 800,
                color: "var(--forest)",
                lineHeight: 1,
                letterSpacing: "-.03em",
              }}
            >
              {course.code}.
            </span>
            <span
              className="mono"
              style={{
                fontSize: 11,
                color: "var(--ink-3)",
                letterSpacing: ".16em",
                fontWeight: 700,
                paddingBottom: 18,
              }}
            >
              MODULE · {course.cat.toUpperCase()}
            </span>
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(36px, 5vw, 60px)", marginBottom: 14, letterSpacing: "-.025em" }}
          >
            {course.title}
          </h1>
          <p
            style={{
              fontSize: 20,
              color: "var(--ink-2)",
              marginBottom: 28,
              letterSpacing: "-.005em",
              fontWeight: 500,
              maxWidth: 620,
            }}
          >
            {course.sub}
          </p>

          {/* meta strip */}
          <div
            style={{
              display: "flex",
              gap: 0,
              border: "1px solid var(--ink)",
              background: "var(--card)",
              marginBottom: 28,
            }}
          >
            {(
              [
                ["Length", durationTail],
                ["Lessons", String(course.lessons)],
                ["Level", course.lvl],
                ["Pace", "Self-paced"],
                ["Cert.", course.cert ? "Yes" : "No"],
              ] as const
            ).map(([k, v], i, a) => (
              <div
                key={k}
                style={{
                  flex: 1,
                  padding: "14px 16px",
                  borderRight: i < a.length - 1 ? "1px solid var(--line)" : "none",
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 9,
                    color: "var(--ink-3)",
                    letterSpacing: ".14em",
                    marginBottom: 6,
                    fontWeight: 700,
                  }}
                >
                  {k.toUpperCase()}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <EnrollButton
              courseId={course.id}
              signedIn={signedIn}
              enrolled={enrolled}
              progress={course.progress}
            />
            <span
              className="mono"
              style={{ marginLeft: 8, fontSize: 14, fontWeight: 700 }}
            >
              {course.price}
            </span>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <GlassThumb
            icon={course.glassIcon}
            code={course.code}
            label={course.title}
            style={{ aspectRatio: "4/5" }}
          />
        </div>
      </section>

      {/* BODY — syllabus */}
      <section
        className="container"
        style={{
          padding: "40px 32px 80px",
          display: "grid",
          gridTemplateColumns: "1.5fr 320px",
          gap: 56,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
            <h2 style={{ fontWeight: 800, fontSize: 32, letterSpacing: "-.015em" }}>
              The <span style={{ color: "var(--forest)" }}>syllabus</span>.
            </h2>
            <span
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".1em", fontWeight: 600 }}
            >
              {course.lessons} LESSONS
            </span>
          </div>
          <p className="margin-note" style={{ maxWidth: 680, marginBottom: 32 }}>
            Lessons are self-paced — take each one when it suits you. Each comes with slides, an
            audio narration, and a discussion thread with{" "}
            {course.inst.split(" ").slice(-1)[0]}.
          </p>

          {sections.map((s, i) => (
            <div
              key={s.label}
              style={{
                marginBottom: 18,
                border: "1px solid var(--line)",
                background: "var(--card)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 18,
                  alignItems: "center",
                  padding: "18px 22px",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: "var(--forest)",
                    letterSpacing: ".12em",
                    fontWeight: 700,
                    width: 90,
                  }}
                >
                  SECTION {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontWeight: 700, fontSize: 18 }}>
                  Part {i + 1} · {s.lessons.length} lessons
                </span>
                <span
                  className="mono"
                  style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 600 }}
                >
                  {s.lessons.length} lessons
                </span>
              </div>
              <div style={{ padding: "6px 22px 18px" }}>
                {s.lessons.map((l, j) => (
                  <div
                    key={l.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto auto",
                      gap: 14,
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom:
                        j < s.lessons.length - 1 ? "1px dashed var(--line)" : "none",
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 12,
                        color: "var(--forest)",
                        fontWeight: 700,
                        width: 36,
                      }}
                    >
                      {l.id}
                    </span>
                    <span style={{ fontSize: 14.5, color: "var(--ink-2)", fontWeight: 500 }}>
                      {l.t}
                    </span>
                    <span
                      className="mono"
                      style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 600 }}
                    >
                      {l.dur}
                    </span>
                    <Icon name="play" size={14} style={{ color: "var(--ink-3)" }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* sidebar: instructor card */}
        <aside>
          <div
            style={{
              padding: 22,
              border: "1px solid var(--line)",
              borderRadius: 10,
              background: "var(--card)",
              position: "sticky",
              top: 90,
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--ink-3)",
                letterSpacing: ".14em",
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              LEAD INSTRUCTOR
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{course.inst}</div>
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 18 }}
            >
              {course.instRole}
            </div>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
              A practitioner-led module — fewer slides, more field examples. Each lesson includes
              real African case studies and an active discussion thread.
            </p>
          </div>
        </aside>
      </section>

      <Footer />
    </>
  );
}
