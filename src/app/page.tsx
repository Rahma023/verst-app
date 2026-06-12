import Link from "next/link";
import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { AskAiChat } from "@/components/ask-ai-chat";
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

      {/* ───────── HERO (glass + arched glow) ───────── */}
      <section className="hero-dark" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="hero-arc" aria-hidden="true" />
        <div className="hero-arc-bottom" aria-hidden="true" />
        <div className="hero-stars" aria-hidden="true" />
        <div className="hero-orb hero-orb-1" aria-hidden="true" />
        <div className="hero-orb hero-orb-2" aria-hidden="true" />
        <div className="hero-orb hero-orb-3" aria-hidden="true" />

        <div
          className="container"
          style={{ padding: "88px 32px 96px", position: "relative", zIndex: 1 }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 80, alignItems: "center" }}>
            <div className="anim-fade-in-up">
              <span className="glass-pill" style={{ marginBottom: 22 }}>
                <span className="glass-pill-dot" />
                Africa's climate-tech academy · early access beta
              </span>

              <h1
                className="display"
                style={{
                  fontSize: "clamp(40px, 6.4vw, 78px)",
                  letterSpacing: "-.03em",
                  lineHeight: 1.02,
                  marginBottom: 24,
                  color: "#fff",
                }}
              >
                The carbon economy of the next decade,
                <br />
                taught by its{" "}
                <em className="gradient-moss">practitioners</em>.
              </h1>

              <p
                style={{
                  fontSize: 17.5,
                  color: "rgba(255,255,255,.78)",
                  maxWidth: 560,
                  lineHeight: 1.6,
                  marginBottom: 36,
                }}
              >
                A two-section climate-tech program built for African project developers, corporate
                sustainability teams and the next generation of climate professionals. Self-paced.
                Verified credentials. A learning community that knows the work.
              </p>

              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <Link href="/program" className="btn-glass btn-glass-pri">
                  Explore the program <Icon name="arrow-r" size={16} />
                </Link>
                <Link href="/lesson/1-1" className="btn-glass">
                  <Icon name="play" size={12} /> Watch a lesson
                </Link>
              </div>
            </div>

            <div style={{ position: "relative" }} className="anim-fade-in-up anim-delay-200">
              <div className="glass-card" style={{ padding: "24px 28px", position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 14,
                    borderBottom: "1px solid rgba(255,255,255,.14)",
                    marginBottom: 14,
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: ".18em",
                      color: "var(--moss)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    The program · in numbers
                  </span>
                  <span
                    className="mono"
                    style={{ fontSize: 10, color: "rgba(255,255,255,.55)" }}
                  >
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
                      padding: "10px 0",
                      borderBottom:
                        i < a.length - 1 ? "1px dashed rgba(255,255,255,.10)" : "none",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,.72)" }}>{k}</span>
                    <span
                      className="num"
                      style={{ fontSize: 26, fontWeight: 700, color: "#fff" }}
                    >
                      {v}
                    </span>
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: "rgba(255,255,255,.50)",
                        width: 100,
                        textAlign: "right",
                      }}
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
        <AmbientBackdrop particles={12} />
        <div className="container" style={{ padding: "88px 32px", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 72, alignItems: "center" }}>
            <div className="anim-fade-in-up">
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
              <Link href="/lesson/1-1" className="btn-glass btn-glass-pri">
                Try the tutor in a lesson <Icon name="arrow-r" size={16} />
              </Link>
            </div>

            <div>
              <AskAiChat
                guestMode
                moduleCode="Demo"
                moduleTitle="Public preview"
                suggestions={[
                  "What is additionality?",
                  "Explain Article 6.2 in 3 sentences",
                  "How does M-Pesa fit a community carbon project?",
                ]}
                emptyStateText="Try me — ask anything about carbon markets, climate science, methodologies (VM0044, Puro, Isometric), Article 6, MRV, or AI in climate. You get 3 free questions; sign up for unlimited."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── HUMAN TUTOR ───────── */}
      <section style={{ borderTop: "1px solid var(--line)", background: "var(--paper-2)" }}>
        <div className="container" style={{ padding: "88px 32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.05fr",
              gap: 72,
              alignItems: "center",
            }}
          >
            {/* mock convo on the left */}
            <div
              className="shadow-moss"
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: 16,
                padding: 24,
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: 14,
                  borderBottom: "1px solid var(--line)",
                  marginBottom: 16,
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--forest)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    AE
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                      Dr. Amaka Eze
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: ".08em",
                        color: "var(--ink-3)",
                      }}
                    >
                      UNFCCC OBSERVER · LEAD TUTOR
                    </div>
                  </div>
                </div>
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: ".1em",
                    fontWeight: 700,
                    padding: "4px 9px",
                    borderRadius: 4,
                    background: "rgba(0,128,55,.12)",
                    color: "var(--forest)",
                    border: "1px solid rgba(0,128,55,.3)",
                  }}
                >
                  ✓ 24h SLA
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* learner question */}
                <div
                  style={{
                    alignSelf: "flex-start",
                    maxWidth: "92%",
                    background: "var(--paper-2)",
                    border: "1px solid var(--line)",
                    color: "var(--ink)",
                    padding: "12px 16px",
                    borderRadius: "14px 14px 14px 2px",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                  }}
                >
                  My biochar project uses cashew shells. Verra reviewer flagged feedstock
                  permanence. How have other developers framed this for VM0044?
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--ink-3)",
                      marginTop: 8,
                      letterSpacing: ".06em",
                    }}
                  >
                    Mariam Hassan · Project dev · Tanzania
                  </div>
                </div>

                {/* tutor reply */}
                <div
                  style={{
                    alignSelf: "flex-end",
                    maxWidth: "92%",
                    background: "var(--forest)",
                    color: "#fff",
                    padding: "13px 16px",
                    borderRadius: "14px 14px 2px 14px",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                  }}
                >
                  Cashew shells score well on permanence — the key is documenting your
                  pyrolysis temp (≥500°C) and a 100-yr sequestration estimate using H/C
                  ratio. I&apos;ll send the validation memo we used for the Mt. Kenya
                  facility. Let&apos;s book 30 min to walk through the reviewer&apos;s
                  specific paragraph.
                </div>

                <div
                  className="mono"
                  style={{
                    alignSelf: "flex-end",
                    fontSize: 10,
                    color: "var(--ink-3)",
                    letterSpacing: ".06em",
                    marginTop: 2,
                  }}
                >
                  REPLIED IN 4H 12M · MARKED ACCEPTED
                </div>
              </div>
            </div>

            {/* text on the right */}
            <div>
              <div className="eyebrow" style={{ color: "var(--forest)", marginBottom: 14 }}>
                · When AI isn&apos;t enough
              </div>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(34px, 4.5vw, 56px)",
                  marginBottom: 22,
                  letterSpacing: "-.02em",
                }}
              >
                Some questions deserve a <em className="gradient-moss">human</em>.
              </h2>
              <p
                style={{
                  fontSize: 17,
                  color: "var(--ink-2)",
                  maxWidth: 540,
                  lineHeight: 1.6,
                  marginBottom: 22,
                }}
              >
                Every module has an assigned <strong>practitioner-tutor</strong> — an
                African specialist in their methodology. When the AI can&apos;t answer, hit
                the <em>Ask a tutor</em> button on any lesson. Replies within 24 hours,
                often under 4.
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  fontSize: 14.5,
                  color: "var(--ink-2)",
                }}
              >
                {[
                  ["Verified experts", "UNFCCC Observers, Verra project devs, methodology authors"],
                  ["24h reply guarantee", "Most replies arrive in 2–6 hours"],
                  ["Marked-accepted threads", "Answers stay searchable in your dashboard"],
                ].map(([k, v]) => (
                  <li key={k} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "var(--forest)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      ✓
                    </span>
                    <span>
                      <strong>{k}</strong> — {v}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/lesson/1-1" className="btn-pri-glow">
                See it in action <Icon name="arrow-r" size={14} />
              </Link>
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
