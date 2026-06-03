import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { ClimateViz } from "@/components/climate-viz";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icon";
import { PodcastAudio } from "@/components/podcast-audio";
import { PodcastSubscribe } from "@/components/podcast-subscribe";
import { TopNav } from "@/components/top-nav";
import {
  PODCAST_SERIES,
  type PodcastEpisode,
  type PodcastSeries,
  formatChapterTime,
  formatDuration,
  listEpisodes,
} from "@/lib/data/podcast";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Podcast — Verst Carbon Academy",
  description:
    "The Verst podcast — weekly field-recordings from the carbon economy. Guest interviews, methodology deep-dives, and policy walkthroughs.",
};

function isSeries(v: string | undefined): v is PodcastSeries {
  return !!v && (PODCAST_SERIES as readonly string[]).includes(v);
}

export default async function PodcastPage(props: {
  searchParams: Promise<{ series?: string }>;
}) {
  const { series: seriesParam } = await props.searchParams;
  const series: PodcastSeries = isSeries(seriesParam) ? seriesParam : "All";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const defaultEmail = user?.email ?? "";

  const episodes = await listEpisodes({ series });
  const featured = episodes[0] ?? null;
  const rest = episodes.slice(1);

  return (
    <>
      <TopNav active="podcast" />

      {/* featured episode hero */}
      {featured ? (
        <section
          style={{
            background: "var(--ink)",
            color: "var(--paper)",
            borderBottom: "1px solid var(--ink)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{ position: "absolute", inset: 0, opacity: 0.15 }}
          >
            <ClimateViz variant="wave" style={{ height: "100%", width: "100%", borderRadius: 0 }} />
          </div>
          <div
            className="container"
            style={{
              padding: "64px 32px",
              position: "relative",
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: 56,
              alignItems: "center",
            }}
          >
            {/* cover */}
            <div
              style={{
                aspectRatio: "1 / 1",
                background: "var(--forest-2)",
                borderRadius: 12,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 48,
                overflow: "hidden",
                border: "1px solid #2a4a37",
              }}
            >
              <Icon name="podcast" size={88} style={{ color: "var(--moss)" }} />
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  fontWeight: 700,
                  fontSize: 10,
                  color: "var(--moss)",
                  letterSpacing: ".18em",
                }}
              >
                VERST PODCAST
              </div>
              <div
                className="mono"
                style={{
                  position: "absolute",
                  bottom: 18,
                  left: 18,
                  fontSize: 10,
                  color: "#aab8a8",
                  letterSpacing: ".14em",
                  fontWeight: 600,
                }}
              >
                EP. {featured.episode_number} ·{" "}
                {new Date(featured.published_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div>
              <div className="eyebrow" style={{ color: "var(--moss)" }}>
                · The Verst podcast · weekly · field-recordings from the carbon economy
              </div>
              <h1
                className="display"
                style={{
                  fontSize: "clamp(32px, 4.5vw, 52px)",
                  marginTop: 14,
                  marginBottom: 18,
                  color: "var(--paper)",
                  maxWidth: 720,
                  letterSpacing: "-.02em",
                  lineHeight: 1.1,
                }}
              >
                EP {featured.episode_number} — {featured.title}
              </h1>
              <div
                style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 28 }}
              >
                <Avatar name={featured.guest_name} size={40} bg="var(--moss)" color="var(--ink)" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{featured.guest_name}</div>
                  <div className="mono" style={{ fontSize: 11, color: "#aab8a8" }}>
                    {[featured.guest_role, featured.guest_org]
                      .filter(Boolean)
                      .join(" · ")
                      .toUpperCase()}
                  </div>
                </div>
                <span style={{ width: 1, height: 32, background: "#3a4540" }} />
                <div>
                  <div
                    className="mono"
                    style={{ fontSize: 11, color: "#aab8a8", letterSpacing: ".06em" }}
                  >
                    HOST
                  </div>
                  <div style={{ fontSize: 13 }}>{featured.host_name}</div>
                </div>
                <span style={{ width: 1, height: 32, background: "#3a4540" }} />
                <div>
                  <div
                    className="mono"
                    style={{ fontSize: 11, color: "#aab8a8", letterSpacing: ".06em" }}
                  >
                    DURATION
                  </div>
                  <div className="mono" style={{ fontSize: 13 }}>
                    {formatDuration(featured.duration_seconds)}
                  </div>
                </div>
              </div>

              <PodcastAudio
                audioUrl={featured.audio_url}
                durationSeconds={featured.duration_seconds}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* series chips */}
      <div
        className="container"
        style={{
          padding: "20px 32px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: ".14em",
            fontWeight: 700,
            color: "var(--ink-3)",
          }}
        >
          SERIES
        </span>
        {PODCAST_SERIES.map((s) => {
          const isOn = series === s;
          const href = s === "All" ? "/podcast" : `/podcast?series=${encodeURIComponent(s)}`;
          return (
            <Link
              key={s}
              href={href}
              className={"chip " + (isOn ? "on" : "")}
              style={{ textDecoration: "none" }}
            >
              {s}
            </Link>
          );
        })}
      </div>

      <div
        className="container"
        style={{
          padding: "40px 32px 80px",
          display: "grid",
          gridTemplateColumns: "1.6fr 360px",
          gap: 48,
        }}
      >
        {/* episode list + transcript */}
        <div>
          <SectionHeader
            num="A"
            title="Episodes"
            meta={`${episodes.length} episode${episodes.length === 1 ? "" : "s"}`}
          />

          {episodes.length === 0 ? (
            <EmptyState />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {episodes.map((ep, i) => (
                <EpisodeRow
                  key={ep.id}
                  ep={ep}
                  isLast={i === episodes.length - 1}
                  isFeatured={featured?.id === ep.id}
                />
              ))}
            </div>
          )}

          {featured && featured.transcript.length > 0 && (
            <>
              <SectionHeader num="B" title="Transcript · current episode" meta="auto · edited" />
              <div
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  padding: "24px 28px",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "var(--ink-2)",
                  maxHeight: 460,
                  overflowY: "auto",
                }}
              >
                {featured.transcript.map((l, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "56px 80px 1fr",
                      gap: 14,
                      paddingBottom: 14,
                    }}
                  >
                    <span
                      className="mono"
                      style={{ fontSize: 11, color: "var(--ink-3)", paddingTop: 4 }}
                    >
                      {l.at}
                    </span>
                    <span
                      className="mono"
                      style={{
                        fontSize: 11,
                        color: "var(--forest)",
                        fontWeight: 600,
                        letterSpacing: ".06em",
                        paddingTop: 4,
                      }}
                    >
                      {l.speaker}
                    </span>
                    <p style={{ margin: 0 }}>{l.text}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* right rail */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {featured && (
            <div>
              <RailHeader>GUEST · EP. {featured.episode_number}</RailHeader>
              <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                <Avatar name={featured.guest_name} size={56} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 2 }}>
                    {featured.guest_name}
                  </div>
                  <div
                    className="mono"
                    style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".08em" }}
                  >
                    {[featured.guest_role, featured.guest_org]
                      .filter(Boolean)
                      .join(" · ")
                      .toUpperCase()}
                  </div>
                </div>
              </div>
              {featured.guest_quote && (
                <p
                  style={{
                    fontWeight: 700,
                    fontStyle: "italic",
                    fontSize: 15,
                    lineHeight: 1.5,
                    color: "var(--ink-2)",
                  }}
                >
                  &ldquo;{featured.guest_quote}&rdquo;
                </p>
              )}
            </div>
          )}

          {featured && featured.chapters.length > 0 && (
            <div>
              <RailHeader>CHAPTERS</RailHeader>
              {featured.chapters.map((c, i, a) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "56px 1fr",
                    gap: 14,
                    padding: "10px 0",
                    borderBottom:
                      i < a.length - 1 ? "1px dashed var(--line)" : "none",
                  }}
                >
                  <span className="mono" style={{ fontSize: 11, color: "var(--forest)" }}>
                    {formatChapterTime(c.at_seconds)}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{c.label}</span>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              padding: 20,
              borderRadius: 8,
              background: "var(--sand)",
              border: "1px solid var(--line)",
            }}
          >
            <RailHeader>SUBSCRIBE</RailHeader>
            <p
              style={{
                fontSize: 12.5,
                color: "var(--ink-2)",
                lineHeight: 1.5,
                marginBottom: 12,
              }}
            >
              New episode every Tuesday. Transcript and show-notes straight to your inbox.
            </p>
            <PodcastSubscribe defaultEmail={defaultEmail} />
          </div>
        </aside>
      </div>

      <Footer />
    </>
  );
}

// ──────────── components ────────────

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
        marginTop: 0,
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

function RailHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mono"
      style={{
        fontSize: 10,
        letterSpacing: ".14em",
        fontWeight: 700,
        color: "var(--ink-3)",
        paddingBottom: 12,
        borderBottom: "1px solid var(--ink)",
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

function EpisodeRow({
  ep,
  isLast,
  isFeatured,
}: {
  ep: PodcastEpisode;
  isLast: boolean;
  isFeatured: boolean;
}) {
  return (
    <div
      className="hover-lift"
      style={{
        display: "grid",
        gridTemplateColumns: "60px 60px 1fr auto auto",
        gap: 16,
        alignItems: "center",
        padding: "18px 22px",
        borderBottom: isLast ? "none" : "1px solid var(--line)",
        background: isFeatured ? "var(--card-2)" : "transparent",
      }}
    >
      <span
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "var(--ink-3)",
        }}
      >
        {String(ep.episode_number).padStart(2, "0")}
      </span>
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 6,
          background: "var(--forest)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="wave" size={22} style={{ color: "var(--moss)" }} />
      </div>
      <div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1.15,
            letterSpacing: "-.005em",
            marginBottom: 4,
          }}
        >
          {ep.title}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            fontSize: 11,
            color: "var(--ink-3)",
            flexWrap: "wrap",
          }}
        >
          <span className="mono">{ep.guest_name}</span>
          {ep.guest_role && (
            <>
              <span>·</span>
              <span className="mono">{ep.guest_role}</span>
            </>
          )}
          {ep.series && (
            <>
              <span>·</span>
              <span className="mono" style={{ color: "var(--forest)" }}>
                {ep.series}
              </span>
            </>
          )}
        </div>
      </div>
      <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
        {formatDuration(ep.duration_seconds)}
      </span>
      <span
        className="mono"
        style={{
          fontSize: 10,
          color: isFeatured ? "var(--forest)" : "var(--ink-3)",
          letterSpacing: ".08em",
          fontWeight: 700,
        }}
      >
        {isFeatured ? "▶ PLAYING ABOVE" : ep.audio_url ? "TAP COVER ABOVE" : "COMING SOON"}
      </span>
    </div>
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
      <Icon name="podcast" size={32} style={{ color: "var(--ink-3)", marginBottom: 12 }} />
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
        No episodes in this series.
      </h3>
      <p style={{ color: "var(--ink-2)", fontSize: 14 }}>
        Try clearing the filter, or check back next Tuesday.
      </p>
    </div>
  );
}
