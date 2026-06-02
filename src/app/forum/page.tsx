import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import {
  FORUM_CATEGORIES,
  type ForumCategory,
  categoryLabel,
  getCategoryCounts,
  listThreads,
} from "@/lib/data/forum";
import { timeAgo } from "@/lib/time";

export const metadata = {
  title: "Forum — Verst Carbon Academy",
  description:
    "Where practitioners trade field-notes on carbon markets, methodologies and MRV.",
};

const FORUM_RULES = [
  'Be specific. "Carbon credits?" is not a question.',
  "Cite sources where you can.",
  "Disagreement is welcome; ad-hominem is not.",
  "Mark an answer accepted to close threads.",
];

function isCategory(v: string | undefined): v is ForumCategory {
  return !!v && FORUM_CATEGORIES.some((c) => c.id === v);
}

export default async function ForumIndexPage(props: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat: catParam } = await props.searchParams;
  const activeCat: ForumCategory | null = isCategory(catParam) ? catParam : null;

  const [threads, counts] = await Promise.all([
    listThreads({ category: activeCat, limit: 50 }),
    getCategoryCounts(),
  ]);
  const totalThreads = Object.values(counts).reduce((s, n) => s + n, 0);
  const featured = threads[0];
  const rest = threads.slice(1);

  return (
    <>
      <TopNav active="forum" />

      {/* hero */}
      <section style={{ borderBottom: "1px solid var(--line)", background: "var(--card-2)" }}>
        <div
          className="container"
          style={{
            padding: "48px 32px 36px",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 48,
            alignItems: "end",
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              · The forum · expert-moderated
            </div>
            <h1
              className="display"
              style={{
                fontSize: "clamp(40px, 6vw, 72px)",
                letterSpacing: "-.03em",
                marginBottom: 14,
              }}
            >
              Where <em>practitioners</em> trade
              <br />
              field-notes.
            </h1>
            <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 520, lineHeight: 1.55 }}>
              Every question is reviewed within 24h. Every answer from a verified expert is
              flagged. Signal-to-noise is the only metric that matters.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Link
              href="/forum/new"
              className="btn btn-pri btn-lg"
              style={{ textDecoration: "none" }}
            >
              <Icon name="plus" size={14} /> Ask a question
            </Link>
          </div>
        </div>

        {/* stats strip */}
        <div className="container" style={{ padding: "0 32px 32px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              border: "1px solid var(--ink)",
              background: "var(--paper)",
            }}
          >
            {(
              [
                [totalThreads.toLocaleString(), "Open threads"],
                ["Public", "Community"],
                ["24h", "Moderation SLA"],
              ] as const
            ).map(([n, l], i, a) => (
              <div
                key={i}
                style={{
                  padding: "18px 22px",
                  borderRight: i < a.length - 1 ? "1px solid var(--line)" : "none",
                  display: "flex",
                  alignItems: "baseline",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 32,
                    lineHeight: 1,
                    color: "var(--ink)",
                    letterSpacing: "-.02em",
                  }}
                >
                  {n}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: ".12em",
                    color: "var(--ink-3)",
                    textTransform: "uppercase",
                  }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* moderation banner */}
      <div style={{ background: "var(--sand)", borderBottom: "1px solid var(--line)" }}>
        <div
          className="container"
          style={{ padding: "12px 32px", display: "flex", gap: 12, alignItems: "center", fontSize: 13 }}
        >
          <Icon name="shield" size={16} />
          <span>
            <strong>Moderation notice.</strong> Posts are reviewed by Verst tutors within 24h to
            keep the signal high.
          </span>
        </div>
      </div>

      {/* body */}
      <div
        className="container"
        style={{
          padding: "32px 32px 80px",
          display: "grid",
          gridTemplateColumns: "240px 1fr 280px",
          gap: 32,
        }}
      >
        {/* categories sidebar */}
        <aside>
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
            CATEGORIES
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <CategoryLink
              href="/forum"
              label="All discussions"
              count={totalThreads}
              active={!activeCat}
            />
            {FORUM_CATEGORIES.map((c) => (
              <CategoryLink
                key={c.id}
                href={`/forum?cat=${c.id}`}
                label={c.label}
                count={counts[c.id] ?? 0}
                active={activeCat === c.id}
              />
            ))}
          </div>
        </aside>

        {/* threads */}
        <div>
          {threads.length === 0 ? (
            <EmptyState activeCat={activeCat} />
          ) : (
            <>
              {featured && (
                <>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: ".14em",
                      fontWeight: 700,
                      color: "var(--ink-3)",
                      marginBottom: 14,
                    }}
                  >
                    <Icon
                      name="flame"
                      size={12}
                      style={{ verticalAlign: -1, marginRight: 6, color: "var(--clay)" }}
                    />
                    FEATURED
                  </div>
                  <ThreadCard t={featured} big />
                </>
              )}

              {rest.length > 0 && (
                <>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: ".14em",
                      fontWeight: 700,
                      color: "var(--ink-3)",
                      marginTop: 24,
                      marginBottom: 14,
                    }}
                  >
                    LATEST
                  </div>
                  {rest.map((t) => (
                    <ThreadCard key={t.id} t={t} />
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {/* right rail */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
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
              FORUM RULES
            </div>
            <ol
              style={{
                listStyle: "decimal",
                paddingLeft: 18,
                fontSize: 12.5,
                color: "var(--ink-2)",
                lineHeight: 1.65,
              }}
            >
              {FORUM_RULES.map((r) => (
                <li key={r} style={{ marginBottom: 6 }}>{r}</li>
              ))}
            </ol>
          </div>

          <div
            style={{
              padding: 22,
              borderRadius: 8,
              background: "var(--forest-2)",
              color: "#fff",
            }}
          >
            <Icon name="sparkle" size={16} style={{ color: "var(--moss)" }} />
            <h4
              style={{
                fontWeight: 700,
                fontSize: 22,
                marginTop: 10,
                marginBottom: 8,
                color: "#fff",
              }}
            >
              Try the AI tutor first.
            </h4>
            <p style={{ fontSize: 12.5, color: "#C9CCC4", lineHeight: 1.5, marginBottom: 14 }}>
              For factual climate-tech questions, the Verst tutor answers in seconds — open any
              lesson to ask it directly.
            </p>
            <Link
              href="/program"
              className="btn btn-accent btn-sm"
              style={{ textDecoration: "none" }}
            >
              Browse modules
            </Link>
          </div>
        </aside>
      </div>

      <Footer />
    </>
  );
}

// ────────────────── components ──────────────────

function CategoryLink({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 12px",
        background: active ? "var(--ink)" : "transparent",
        color: active ? "var(--paper)" : "var(--ink-2)",
        borderRadius: 4,
        textDecoration: "none",
        fontSize: 13,
      }}
    >
      <span>{label}</span>
      <span
        className="mono"
        style={{
          fontSize: 10,
          color: active ? "var(--moss)" : "var(--ink-3)",
        }}
      >
        {count}
      </span>
    </Link>
  );
}

function ThreadCard({
  t,
  big = false,
}: {
  t: Awaited<ReturnType<typeof listThreads>>[number];
  big?: boolean;
}) {
  const isExpert = t.author.role === "tutor" || t.author.role === "admin";
  return (
    <Link
      href={`/forum/${t.id}`}
      className="hover-lift"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: 18,
        padding: big ? "22px 24px" : "18px 24px",
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        marginBottom: 10,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div
          style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}
        >
          <span
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--ink-3)",
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            {categoryLabel(t.category)}
          </span>
          {t.status === "answered" && (
            <span
              className="mono"
              style={{
                fontSize: 9,
                letterSpacing: ".1em",
                padding: "2px 7px",
                background: "var(--forest)",
                color: "#fff",
                borderRadius: 3,
                fontWeight: 700,
              }}
            >
              ✓ ANSWERED
            </span>
          )}
          {isExpert && (
            <span
              className="mono"
              style={{
                fontSize: 9,
                letterSpacing: ".1em",
                padding: "2px 7px",
                background: "var(--sand)",
                color: "var(--ink)",
                borderRadius: 3,
                fontWeight: 700,
              }}
            >
              ASKED BY EXPERT
            </span>
          )}
        </div>
        <h3
          style={{
            fontWeight: 700,
            fontSize: big ? 24 : 18,
            lineHeight: 1.2,
            letterSpacing: "-.005em",
            marginBottom: 10,
            color: "var(--ink)",
          }}
        >
          {t.title}
        </h3>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Avatar name={t.author.full_name ?? "Member"} size={24} />
          <span style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 500 }}>
            {t.author.full_name ?? "Member"}
          </span>
          <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
            {t.author.role.toUpperCase()}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "space-between",
          color: "var(--ink-3)",
        }}
      >
        <div className="mono" style={{ fontSize: 10, letterSpacing: ".06em" }}>
          {timeAgo(t.updated_at)}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink-2)" }}>
          <Icon name="msg" size={13} />
          <span className="mono" style={{ fontSize: 12 }}>
            {t.reply_count}
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ activeCat }: { activeCat: ForumCategory | null }) {
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
      <Icon name="msg" size={32} style={{ color: "var(--ink-3)", marginBottom: 12 }} />
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
        {activeCat
          ? `No threads in ${categoryLabel(activeCat)} yet.`
          : "No threads yet."}
      </h3>
      <p style={{ color: "var(--ink-2)", fontSize: 14, marginBottom: 18 }}>
        Be the first to ask a question — your peers will see it within minutes.
      </p>
      <Link
        href="/forum/new"
        className="btn btn-pri btn-lg"
        style={{ textDecoration: "none" }}
      >
        <Icon name="plus" size={14} /> Start a thread
      </Link>
    </div>
  );
}
