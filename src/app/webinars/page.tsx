import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { ClimateViz } from "@/components/climate-viz";
import { Footer } from "@/components/footer";
import { HeroGlow } from "@/components/hero-glow";
import { Icon } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import { WebinarRegisterButton } from "@/components/webinar-register-button";
import {
  WEBINAR_TOPICS,
  type Webinar,
  type WebinarStatus,
  type WebinarTopic,
  formatWebinarDate,
  listWebinars,
} from "@/lib/data/webinars";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Webinars — Verst Carbon Academy",
  description:
    "Two live sessions a month — methodology authors, regulators, project developers. Full archive with transcripts.",
};

const TABS: { id: WebinarStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "upcoming", label: "Upcoming" },
  { id: "live", label: "Live now" },
  { id: "replay", label: "Replays" },
];

function isTopic(v: string | undefined): v is WebinarTopic {
  return !!v && (WEBINAR_TOPICS as string[]).includes(v);
}

function isTab(v: string | undefined): v is WebinarStatus | "all" {
  return v === "all" || v === "upcoming" || v === "live" || v === "replay";
}

export default async function WebinarsPage(props: {
  searchParams: Promise<{ tab?: string; topic?: string }>;
}) {
  const { tab: tabParam, topic: topicParam } = await props.searchParams;
  const tab: WebinarStatus | "all" = isTab(tabParam) ? tabParam : "all";
  const topic: WebinarTopic | null = isTopic(topicParam) ? topicParam : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const defaultEmail = user?.email ?? "";

  const [all, live] = await Promise.all([
    listWebinars({
      status: tab === "all" ? null : tab,
      topic,
    }),
    // Always-fetched live ones for the hero feature card (independent of filter)
    listWebinars({ status: "live" }),
  ]);

  const featured = live[0] ?? null;
  const upcoming = all.filter((w) => w.status === "upcoming");
  const liveNow = all.filter((w) => w.status === "live");
  const replays = all.filter((w) => w.status === "replay");

  const counts = {
    upcoming: all.filter((w) => w.status === "upcoming").length,
    live: all.filter((w) => w.status === "live").length,
    replay: all.filter((w) => w.status === "replay").length,
    all: all.length,
  };

  return (
    <>
      <TopNav active="webinars" />

      {/* hero */}
      <section className="hero-dark" style={{ borderBottom: "1px solid var(--ink)" }}>
        <HeroGlow orbs={3} />
        <div
          className="container"
          style={{ padding: "72px 32px 36px", position: "relative", zIndex: 1 }}
        >
          <div
            className="anim-fade-in-up"
            style={{ marginBottom: 32, maxWidth: 760 }}
          >
            <span className="glass-pill" style={{ marginBottom: 22 }}>
              <span className="glass-pill-dot" />
              The webinar series · two live sessions a month
            </span>
            <h1
              className="display"
              style={{
                fontSize: "clamp(40px, 6vw, 72px)",
                letterSpacing: "-.03em",
                marginTop: 8,
                color: "#fff",
              }}
            >
              <em className="gradient-moss">Webinars.</em>
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,.78)",
                maxWidth: 560,
                marginTop: 14,
                lineHeight: 1.6,
              }}
            >
              Two live sessions a month — methodology authors, regulators, project developers.
              Full archive with transcripts and slide decks.
            </p>
          </div>

          {featured && (
            <div className="anim-fade-in-up anim-delay-200">
              <FeaturedCard w={featured} defaultEmail={defaultEmail} />
            </div>
          )}
        </div>
      </section>

      {/* tabs + topic chips — light strip below the dark hero */}
      <div
        style={{
          background: "var(--paper-2)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          className="container"
          style={{
            padding: "20px 32px 16px",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {TABS.map((t) => {
              const isOn = tab === t.id;
              const href =
                t.id === "all"
                  ? topic
                    ? `/webinars?topic=${encodeURIComponent(topic)}`
                    : "/webinars"
                  : topic
                  ? `/webinars?tab=${t.id}&topic=${encodeURIComponent(topic)}`
                  : `/webinars?tab=${t.id}`;
              const count = counts[t.id as keyof typeof counts] ?? 0;
              return (
                <Link
                  key={t.id}
                  href={href}
                  className={"chip " + (isOn ? "on" : "")}
                  style={{ textDecoration: "none" }}
                >
                  {t.label} · {count}
                </Link>
              );
            })}
            <span style={{ width: 1, height: 24, background: "var(--line)" }} />
            <Link
              href={tab === "all" ? "/webinars" : `/webinars?tab=${tab}`}
              className={"chip " + (topic === null ? "on" : "")}
              style={{ textDecoration: "none" }}
            >
              Any topic
            </Link>
            {WEBINAR_TOPICS.map((t) => {
              const isOn = topic === t;
              const href =
                tab === "all"
                  ? `/webinars?topic=${encodeURIComponent(t)}`
                  : `/webinars?tab=${tab}&topic=${encodeURIComponent(t)}`;
              return (
                <Link
                  key={t}
                  href={href}
                  className={"chip " + (isOn ? "on" : "")}
                  style={{ textDecoration: "none" }}
                >
                  {t}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* body */}
      <section className="container" style={{ padding: "40px 32px 80px" }}>
        {all.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {(tab === "all" || tab === "upcoming" || tab === "live") &&
              (upcoming.length + liveNow.length > 0) && (
                <>
                  <SectionHeader
                    num="A"
                    title="Upcoming & live"
                    meta={`${upcoming.length + liveNow.length} session${
                      upcoming.length + liveNow.length === 1 ? "" : "s"
                    }`}
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 20,
                      marginBottom: replays.length > 0 ? 64 : 0,
                    }}
                  >
                    {[...liveNow, ...upcoming].map((w) => (
                      <WebinarCard key={w.id} w={w} defaultEmail={defaultEmail} />
                    ))}
                  </div>
                </>
              )}
            {(tab === "all" || tab === "replay") && replays.length > 0 && (
              <>
                <SectionHeader
                  num={tab === "all" ? "B" : "A"}
                  title="Replays"
                  meta={`${replays.length} session${replays.length === 1 ? "" : "s"}`}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 20,
                  }}
                >
                  {replays.map((w) => (
                    <WebinarCard key={w.id} w={w} defaultEmail={defaultEmail} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      <Footer />
    </>
  );
}

// ────────────── components ──────────────

function SectionHeader({
  num,
  title,
  meta,
}: {
  num: string;
  title: string;
  meta: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: 18,
        alignItems: "baseline",
        paddingBottom: 16,
        borderBottom: "2px solid var(--ink)",
        marginBottom: 24,
      }}
    >
      <span
        style={{
          fontWeight: 800,
          fontSize: 36,
          lineHeight: 1,
          color: "var(--forest)",
          letterSpacing: "-.03em",
        }}
      >
        § {num}
      </span>
      <h2 style={{ fontWeight: 800, fontSize: 28, letterSpacing: "-.015em" }}>{title}</h2>
      <span
        className="mono"
        style={{
          fontSize: 11,
          color: "var(--ink-3)",
          letterSpacing: ".1em",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {meta}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: WebinarStatus }) {
  if (status === "live") {
    return (
      <span
        className="mono"
        style={{
          padding: "4px 10px",
          background: "var(--clay)",
          color: "#fff",
          fontSize: 10,
          letterSpacing: ".12em",
          fontWeight: 700,
          borderRadius: 3,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            background: "#fff",
            borderRadius: "50%",
            animation: "pulse 1.2s ease infinite",
          }}
        />
        LIVE NOW
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span
        className="mono"
        style={{
          padding: "4px 10px",
          background: "rgba(14,22,18,.7)",
          color: "var(--moss)",
          border: "1px solid #3a5547",
          fontSize: 10,
          letterSpacing: ".12em",
          fontWeight: 700,
          borderRadius: 3,
        }}
      >
        UPCOMING
      </span>
    );
  }
  return (
    <span
      className="mono"
      style={{
        padding: "4px 10px",
        background: "rgba(14,22,18,.7)",
        color: "#fff",
        border: "1px solid #3a4540",
        fontSize: 10,
        letterSpacing: ".12em",
        fontWeight: 700,
        borderRadius: 3,
      }}
    >
      REPLAY
    </span>
  );
}

function FeaturedCard({
  w,
  defaultEmail,
}: {
  w: Webinar;
  defaultEmail: string;
}) {
  return (
    <article
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", height: 280 }}>
        <ClimateViz variant={w.visual_variant} style={{ height: "100%", borderRadius: 0 }} />
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <StatusBadge status={w.status} />
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "#fff",
              background: "rgba(14,22,18,.7)",
              padding: "4px 10px",
              borderRadius: 3,
              letterSpacing: ".08em",
            }}
          >
            · {w.attendees_count.toLocaleString()} watching
          </span>
        </div>
      </div>
      <div style={{ padding: "28px 32px 32px" }}>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--ink-3)",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          {formatWebinarDate(w.starts_at, w.duration_minutes)}
        </div>
        <h2
          style={{
            fontWeight: 800,
            fontSize: 34,
            lineHeight: 1.1,
            letterSpacing: "-.015em",
            marginBottom: 18,
          }}
        >
          {w.title}
        </h2>
        {w.description && (
          <p
            style={{
              fontSize: 14.5,
              color: "var(--ink-2)",
              lineHeight: 1.65,
              maxWidth: 760,
              marginBottom: 22,
            }}
          >
            {w.description}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Avatar name={w.speaker_name} size={40} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>{w.speaker_name}</div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
              {[w.speaker_role, w.speaker_org].filter(Boolean).join(" · ").toUpperCase()}
            </div>
          </div>
          <WebinarRegisterButton
            webinarId={w.id}
            defaultEmail={defaultEmail}
            size="lg"
            joinLive
          />
        </div>
      </div>
    </article>
  );
}

function WebinarCard({
  w,
  defaultEmail,
}: {
  w: Webinar;
  defaultEmail: string;
}) {
  return (
    <article
      className="hover-lift"
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ position: "relative", height: 170 }}>
        <ClimateViz variant={w.visual_variant} style={{ height: "100%", borderRadius: 0 }} />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <StatusBadge status={w.status} />
        </div>
      </div>
      <div
        style={{
          padding: "18px 22px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: 12,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 10,
            color: "var(--ink-3)",
            letterSpacing: ".1em",
            textTransform: "uppercase",
          }}
        >
          {formatWebinarDate(w.starts_at, w.duration_minutes)}
        </div>
        <h3
          style={{
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1.2,
            letterSpacing: "-.005em",
            color: "var(--ink)",
            flex: 1,
          }}
        >
          {w.title}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name={w.speaker_name} size={24} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{w.speaker_name}</div>
            <div
              className="mono"
              style={{
                fontSize: 9,
                color: "var(--ink-3)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {[w.speaker_role, w.speaker_org].filter(Boolean).join(" · ")}
            </div>
          </div>
          {w.status === "replay" ? (
            w.video_url ? (
              <a
                href={w.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm"
                style={{ textDecoration: "none" }}
              >
                <Icon name="play" size={12} /> Watch
              </a>
            ) : (
              <span
                className="mono"
                style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".06em" }}
              >
                processing
              </span>
            )
          ) : (
            <WebinarRegisterButton
              webinarId={w.id}
              defaultEmail={defaultEmail}
              joinLive={w.status === "live"}
            />
          )}
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 24px",
        border: "1px dashed var(--line)",
        borderRadius: 12,
        background: "var(--card)",
      }}
    >
      <Icon name="video" size={32} style={{ color: "var(--ink-3)", marginBottom: 12 }} />
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>No sessions found.</h3>
      <p style={{ color: "var(--ink-2)", fontSize: 14 }}>
        Try clearing the filter, or check back next week.
      </p>
    </div>
  );
}
