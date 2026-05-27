import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { ClimateViz } from "@/components/climate-viz";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icon";
import { ModuleCardCompact, ModuleCardFeatured } from "@/components/module-card";
import { TopNav } from "@/components/top-nav";
import { getCourses } from "@/lib/data/courses";
import { PODCASTS, THREADS } from "@/data/community";

const PROGRAM_STATS: readonly [string, string, string][] = [
  ["Modules", "5", "I → V"],
  ["Lessons", "28", "recorded"],
  ["Hours of content", "182", "+ live sessions"],
  ["Learners enrolled", "1,420", "active"],
  ["Countries reached", "23", "East / West / South"],
];

const TUTOR_CHIPS = ["Cites sources", "Slide-aware", "Quizzes you", "Generates flashcards"] as const;
const TUTOR_SUGGESTIONS = ["Quiz me on this", "Flashcards", "Summarise this lesson"] as const;
const DONATE_PRESETS = ["$10", "$25", "$50", "$100"] as const;

export default async function HomePage() {
  const courses = await getCourses();
  const featuredModule = courses.find((c) => c.code === "I") ?? courses[0];
  const otherModules = courses
    .filter((c) => c.id !== featuredModule.id && c.section === "A")
    .slice(0, 4);
  const topPodcast = PODCASTS[0];

  return (
    <>
      <TopNav active="home" />

      {/* ───────── HERO ───────── */}
      <section style={{ borderBottom: "1px solid var(--line)", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ padding: "64px 32px 72px", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 80, alignItems: "end" }}>
            <div>
              <h1
                className="display"
                style={{ fontSize: "clamp(40px, 6vw, 72px)", marginBottom: 24, letterSpacing: "-.025em" }}
              >
                The carbon economy
                <br />
                of the next decade, taught
                <br />
                by its <em>practitioners</em>.
              </h1>

              <p
                style={{
                  fontSize: 17,
                  color: "var(--ink-2)",
                  maxWidth: 540,
                  lineHeight: 1.55,
                  marginBottom: 32,
                }}
              >
                A two-section climate-tech program built for African project developers, corporate
                sustainability teams and the next generation of climate professionals. Self-paced.
                Verified credentials. A learning community that knows the work.
              </p>

              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <Link href="/program" className="btn btn-pri btn-lg">
                  Explore the program <Icon name="arrow-r" size={16} />
                </Link>
                <Link href="/lesson/1-1" className="btn btn-lg">
                  <Icon name="play" size={12} /> Watch a lesson
                </Link>
              </div>
            </div>

            <div style={{ position: "relative" }}>
              <div
                style={{
                  border: "1px solid var(--ink)",
                  background: "var(--card)",
                  padding: "20px 24px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 14,
                    borderBottom: "1px solid var(--ink)",
                    marginBottom: 14,
                  }}
                >
                  <span className="label" style={{ color: "var(--ink)" }}>
                    The program · in numbers
                  </span>
                  <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
                    MAY 2026
                  </span>
                </div>
                {PROGRAM_STATS.map(([k, v, d], i, a) => (
                  <div
                    key={k}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      gap: 14,
                      alignItems: "baseline",
                      padding: "9px 0",
                      borderBottom: i < a.length - 1 ? "1px dashed var(--line)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{k}</span>
                    <span className="num" style={{ fontSize: 22, fontWeight: 600 }}>{v}</span>
                    <span
                      className="mono"
                      style={{ fontSize: 10, color: "var(--ink-3)", width: 100, textAlign: "right" }}
                    >
                      {d}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── THE PROGRAM ───────── */}
      <section className="container" style={{ padding: "80px 32px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 32,
            alignItems: "end",
            marginBottom: 40,
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>The Program</div>
            <h2 className="display" style={{ fontSize: "clamp(32px, 4.5vw, 56px)", maxWidth: 780 }}>
              Two sections, sequenced the way <em>practitioners</em> actually learn.
            </h2>
            <p style={{ fontSize: 15, color: "var(--ink-2)", marginTop: 14, maxWidth: 560, lineHeight: 1.5 }}>
              <strong>Section A · Carbon Markets</strong> and <strong>Section B · AI in Climate</strong> — take any
              module independently or work through the full curriculum.
            </p>
          </div>
          <Link
            href="/program"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: "var(--ink)",
              textDecoration: "none",
            }}
          >
            See the full syllabus <Icon name="arrow-ne" size={14} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
          <ModuleCardFeatured c={featuredModule} />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {otherModules.map((c) => (
              <ModuleCardCompact key={c.id} c={c} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── AI TUTOR ───────── */}
      <section style={{ background: "var(--forest-2)", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.06,
            backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="container" style={{ padding: "88px 32px", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 72, alignItems: "center" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--moss)" }}>· the AI tutor</div>
              <h2
                className="display"
                style={{ fontSize: "clamp(36px, 5vw, 60px)", marginTop: 14, marginBottom: 24, color: "#fff" }}
              >
                A tutor that knows <em style={{ color: "var(--moss)" }}>which slide</em> you&apos;re on.
              </h2>
              <p style={{ fontSize: 17, color: "#D9DCD3", maxWidth: 480, lineHeight: 1.55, marginBottom: 28 }}>
                Trained on the methodology documents themselves — Verra, Puro, Isometric, the IPCC reports, ISO
                14064 — the Verst tutor answers in context. Ask anything mid-lesson. It cites its sources.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
                {TUTOR_CHIPS.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 99,
                      fontSize: 12,
                      background: "transparent",
                      border: "1px solid #3a5547",
                      color: "var(--moss)",
                      fontWeight: 500,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/lesson/1-1" className="btn btn-accent btn-lg">
                Try the tutor live <Icon name="arrow-r" size={16} />
              </Link>
            </div>

            <div
              style={{
                background: "rgba(0,0,0,.35)",
                border: "1px solid #2a4a37",
                borderRadius: 14,
                padding: 22,
                backdropFilter: "blur(6px)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "2px 4px 14px",
                  borderBottom: "1px solid #2a4a37",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Icon name="sparkle" size={14} stroke={1.8} style={{ color: "var(--moss)" }} />
                  <span
                    className="mono"
                    style={{ fontSize: 11, letterSpacing: ".12em", color: "var(--moss)", fontWeight: 700 }}
                  >
                    VERST TUTOR
                  </span>
                </div>
                <span className="mono" style={{ fontSize: 10, color: "#7A857F" }}>
                  Module III · Lesson 3.4
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div
                  style={{
                    alignSelf: "flex-end",
                    maxWidth: "82%",
                    background: "var(--forest)",
                    color: "#fff",
                    padding: "11px 15px",
                    borderRadius: "14px 14px 2px 14px",
                    fontSize: 13.5,
                  }}
                >
                  Explain additionality for a project developer.
                </div>
                <div
                  style={{
                    maxWidth: "92%",
                    background: "#fff",
                    color: "var(--ink)",
                    padding: "15px 17px",
                    borderRadius: "14px 14px 14px 2px",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                  }}
                >
                  A project is{" "}
                  <em style={{ fontStyle: "italic", color: "var(--forest)", fontWeight: 600 }}>additional</em> if it
                  would not have happened without carbon-credit revenue. In practice: show the project is uneconomic
                  without credits, faces an institutional barrier, or isn&apos;t common practice in your region.
                  <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
                    {["slide 04", "ISO 14064-2 §6.4", "library · primer.pdf"].map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 10,
                          padding: "3px 9px",
                          background: "var(--paper-2)",
                          borderRadius: 99,
                          color: "var(--ink-3)",
                          fontWeight: 600,
                          letterSpacing: ".04em",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                  {TUTOR_SUGGESTIONS.map((s) => (
                    <span
                      key={s}
                      style={{
                        padding: "5px 11px",
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 500,
                        background: "transparent",
                        color: "#aab8a8",
                        border: "1px solid #3a5547",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 12,
                    background: "rgba(0,0,0,.4)",
                    border: "1px solid #2a4a37",
                    borderRadius: 99,
                    padding: "5px 5px 5px 16px",
                  }}
                >
                  <Icon name="sparkle" size={14} style={{ color: "var(--moss)" }} />
                  <input
                    type="text"
                    placeholder="Ask the tutor anything…"
                    readOnly
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "#fff",
                      fontSize: 13,
                      padding: "8px 0",
                      fontFamily: "inherit",
                    }}
                  />
                  <button type="button" className="btn btn-accent btn-sm" style={{ height: 32 }}>
                    Ask <Icon name="arrow-r" size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── FIELD DISPATCHES ───────── */}
      <section style={{ borderTop: "1px solid var(--line)", background: "var(--paper-2)" }}>
        <div className="container" style={{ padding: "72px 32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: 32,
              marginBottom: 36,
            }}
          >
            <div>
              <div className="eyebrow">· Field dispatches</div>
              <h2 className="display" style={{ fontSize: "clamp(28px, 4vw, 48px)", marginTop: 8 }}>
                The community, <em>off-program</em>.
              </h2>
            </div>
            <span
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".08em" }}
            >
              FORUM · WEBINARS · PODCAST
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr", gap: 20 }}>
            {/* Forum preview */}
            <Link href="/forum" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="card-flat hover-lift" style={{ padding: 24, borderRadius: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Icon name="msg" size={16} style={{ color: "var(--forest)" }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Experts Forum</span>
                  </div>
                  <span className="label">156 active</span>
                </div>
                {THREADS.slice(0, 3).map((t, i) => (
                  <div
                    key={t.id}
                    style={{
                      paddingTop: i === 0 ? 0 : 14,
                      paddingBottom: 14,
                      borderBottom: i < 2 ? "1px solid var(--line-2)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <Avatar name={t.author} size={26} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            lineHeight: 1.35,
                            color: "var(--ink)",
                            marginBottom: 4,
                          }}
                        >
                          {t.title}
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
                            {t.cat}
                          </span>
                          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
                            · {t.replies} replies · {t.time}
                          </span>
                          {t.expert && <span className="tag tag-expert">Expert reply</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 8,
                    fontSize: 12,
                    color: "var(--forest)",
                    fontWeight: 600,
                  }}
                >
                  Open the forum <Icon name="arrow-r" size={13} />
                </div>
              </div>
            </Link>

            {/* Webinar card */}
            <Link href="/webinars" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="card-ink hover-lift" style={{ overflow: "hidden", borderRadius: 10 }}>
                <div style={{ position: "relative", height: 200 }}>
                  <ClimateViz variant="grid" style={{ height: "100%", width: "100%", borderRadius: 0 }} />
                  <span className="tag tag-live" style={{ position: "absolute", top: 14, left: 14 }}>
                    Live in 6h
                  </span>
                </div>
                <div style={{ padding: 22 }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--moss)",
                      letterSpacing: ".14em",
                      marginBottom: 10,
                      fontWeight: 700,
                    }}
                  >
                    WEBINAR · MAY 12 · 6 PM EAT
                  </div>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: 22,
                      lineHeight: 1.2,
                      marginBottom: 14,
                      color: "#fff",
                      letterSpacing: "-.01em",
                    }}
                  >
                    Article 6.2 — what{" "}
                    <em style={{ fontStyle: "italic", color: "var(--moss)" }}>changed</em> in 2026.
                  </h3>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Avatar name="Amaka Eze" size={28} />
                    <div>
                      <div style={{ fontSize: 12, color: "#fff", fontWeight: 500 }}>Dr. Amaka Eze</div>
                      <div className="mono" style={{ fontSize: 10, color: "#9aa19a" }}>
                        UNFCCC Observer
                      </div>
                    </div>
                    <span className="btn btn-accent btn-sm" style={{ marginLeft: "auto" }}>
                      Register
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Podcast card */}
            <Link href="/podcast" style={{ textDecoration: "none", color: "inherit" }}>
              <div
                className="card-flat hover-lift"
                style={{
                  padding: 24,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 10,
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Icon name="podcast" size={16} style={{ color: "var(--forest)" }} />
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Verst Podcast</span>
                  </div>
                  <span className="label">Ep. {topPodcast.ep}</span>
                </div>
                <div
                  style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 16, marginBottom: 20 }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: 1,
                      background: "var(--forest)",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="wave" size={32} stroke={1.2} style={{ color: "#fff" }} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.2, marginBottom: 6 }}>
                      Why most carbon credits won&apos;t{" "}
                      <em style={{ fontStyle: "italic", color: "var(--forest)" }}>survive</em> 2027
                    </h3>
                    <div
                      className="mono"
                      style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".06em" }}
                    >
                      {topPodcast.dur} · {topPodcast.date}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: "auto" }}>
                  <Avatar name={topPodcast.guest} size={28} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{topPodcast.guest}</div>
                    <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
                      {topPodcast.role}
                    </div>
                  </div>
                  <span className="btn-icon btn btn-pri btn-sm">
                    <Icon name="play" size={11} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── PULL QUOTE ───────── */}
      <section style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div
          className="container"
          style={{
            padding: "80px 32px",
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 160,
              color: "var(--forest)",
              lineHeight: 1,
              letterSpacing: "-.04em",
              fontWeight: 800,
              fontStyle: "italic",
            }}
          >
            &ldquo;
          </div>
          <div>
            <p
              style={{
                fontWeight: 600,
                fontSize: "clamp(20px, 2.4vw, 32px)",
                lineHeight: 1.25,
                color: "var(--ink)",
                marginBottom: 28,
                letterSpacing: "-.01em",
                maxWidth: 920,
              }}
            >
              Verst is the only place I can send a junior analyst, point at a methodology, and trust they&apos;ll come
              back fluent in{" "}
              <span style={{ color: "var(--forest)", fontWeight: 800 }}>permanence</span>,{" "}
              <span style={{ color: "var(--forest)", fontWeight: 800 }}>leakage</span> and{" "}
              <span style={{ color: "var(--forest)", fontWeight: 800 }}>additionality</span>.
            </p>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar name="Naledi Mokoena" size={48} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Naledi Mokoena</div>
                <div
                  className="mono"
                  style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".06em" }}
                >
                  HEAD OF CLIMATE FINANCE · OLD MUTUAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── DONATION CTA ───────── */}
      <section className="container" style={{ padding: "72px 32px" }}>
        <div
          style={{
            background: "var(--ink)",
            color: "#fff",
            padding: "52px 56px",
            borderRadius: 14,
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 48,
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: -40, right: -40, opacity: 0.16 }}>
            <Icon name="leaf" size={280} stroke={1} style={{ color: "var(--moss)" }} />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="eyebrow" style={{ color: "var(--moss)" }}>· Sustain</div>
            <h2
              className="display"
              style={{ fontSize: "clamp(30px, 4vw, 46px)", marginTop: 14, marginBottom: 18 }}
            >
              Every donation funds a <em style={{ color: "var(--moss)" }}>scholarship</em>.
            </h2>
            <p style={{ fontSize: 16, color: "#C9CCC4", maxWidth: 520, lineHeight: 1.55 }}>
              1,240 learners across 23 countries are studying for free because of donors. M-Pesa, card,
              recurring — receipts auto-emailed.
            </p>
          </div>
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {DONATE_PRESETS.map((p, i) => (
                <div
                  key={p}
                  style={{
                    flex: 1,
                    padding: "18px 0",
                    textAlign: "center",
                    border: "1px solid " + (i === 2 ? "var(--moss)" : "#3a4540"),
                    background: i === 2 ? "var(--moss)" : "transparent",
                    color: "#fff",
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {p}
                </div>
              ))}
            </div>
            <Link href="/donate" className="btn btn-accent btn-lg">
              Donate $50 monthly <Icon name="arrow-r" size={16} />
            </Link>
            <div
              className="mono"
              style={{
                fontSize: 10,
                color: "#9aa19a",
                textAlign: "center",
                letterSpacing: ".1em",
                fontWeight: 600,
              }}
            >
              SECURED · RECEIPTS AUTO-EMAILED
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
