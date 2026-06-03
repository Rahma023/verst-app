import Link from "next/link";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import {
  LIBRARY_CATEGORIES,
  type LibraryCategory,
  type LibraryResource,
  formatFileSize,
  getLibraryCategoryCounts,
  listLibraryResources,
} from "@/lib/data/library";

export const metadata = {
  title: "Library — Verst Carbon Academy",
  description:
    "Methodology documents, datasets, financial-model templates and briefs — every resource a Verst instructor would put in your hands.",
};

const TYPE_COLORS: Record<string, string> = {
  PDF: "#A53A1E",
  XLSX: "#2E6B3D",
  DOCX: "#2A5780",
  ZIP: "#5B3A52",
  LINK: "#0E1612",
};

function isLibCat(v: string | undefined): v is LibraryCategory {
  return !!v && (LIBRARY_CATEGORIES as readonly string[]).includes(v);
}

export default async function LibraryPage(props: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat: catParam } = await props.searchParams;
  const cat: LibraryCategory = isLibCat(catParam) ? catParam : "All";

  const [resources, counts] = await Promise.all([
    listLibraryResources({ category: cat }),
    getLibraryCategoryCounts(),
  ]);
  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  // Featured = first 3 of current view, regardless of category
  const featured = resources.slice(0, 3);
  const rest = resources;

  return (
    <>
      <TopNav active="library" />

      {/* hero */}
      <section style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="container" style={{ padding: "56px 32px 28px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: 48,
              alignItems: "end",
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 14 }}>
                · Resource library · public + free
              </div>
              <h1
                className="display"
                style={{
                  fontSize: "clamp(40px, 6vw, 76px)",
                  letterSpacing: "-.03em",
                  marginBottom: 18,
                }}
              >
                The <em>field manual</em>.
              </h1>
              <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 560, lineHeight: 1.6 }}>
                Methodology documents, datasets, financial-model templates and briefs — every
                resource a Verst instructor would put in your hands.
              </p>
            </div>
            <div
              style={{
                padding: 18,
                background: "var(--card-2)",
                border: "1px solid var(--line)",
                borderRadius: 10,
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: ".14em",
                  fontWeight: 700,
                  color: "var(--ink-3)",
                  marginBottom: 10,
                }}
              >
                LIBRARY AT A GLANCE
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  rowGap: 8,
                  fontSize: 13,
                  color: "var(--ink-2)",
                }}
              >
                <span>Total resources</span>
                <span className="mono" style={{ fontWeight: 700, color: "var(--ink)" }}>
                  {total}
                </span>
                {(["Methodology", "Dataset", "Template", "Brief", "Reference"] as const).map(
                  (c) => (
                    <span
                      key={c}
                      style={{ display: "contents" }}
                    >
                      <span>{c}</span>
                      <span
                        className="mono"
                        style={{ fontWeight: 700, color: "var(--ink)" }}
                      >
                        {counts[c] ?? 0}
                      </span>
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* category tabs */}
          <div
            style={{
              display: "flex",
              gap: 0,
              marginTop: 36,
              borderBottom: "1px solid var(--ink)",
              flexWrap: "wrap",
            }}
          >
            {LIBRARY_CATEGORIES.map((c) => {
              const isOn = cat === c;
              const href = c === "All" ? "/library" : `/library?cat=${encodeURIComponent(c)}`;
              return (
                <Link
                  key={c}
                  href={href}
                  style={{
                    padding: "12px 22px",
                    background: isOn ? "var(--ink)" : "transparent",
                    color: isOn ? "var(--paper)" : "var(--ink-2)",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {c}
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      marginLeft: 8,
                      color: isOn ? "var(--moss)" : "var(--ink-3)",
                    }}
                  >
                    {c === "All" ? total : counts[c] ?? 0}
                  </span>
                </Link>
              );
            })}
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                padding: "12px 0",
                gap: 10,
              }}
            >
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".06em" }}
              >
                {resources.length} ITEMS
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* body */}
      <div className="container" style={{ padding: "32px 32px 80px" }}>
        {resources.length === 0 ? (
          <EmptyState cat={cat} />
        ) : (
          <>
            {featured.length > 0 && (
              <section style={{ marginBottom: 56 }}>
                <SectionHeader
                  num="A"
                  title={cat === "All" ? "Featured" : `${cat} — featured`}
                  meta={`${featured.length} of ${resources.length}`}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 18,
                  }}
                >
                  {featured.map((r) => (
                    <ResourceCard key={r.id} r={r} />
                  ))}
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section>
                <SectionHeader
                  num="B"
                  title="All resources"
                  meta="Sort: most recent"
                />
                <ResourceTable rows={rest} />
              </section>
            )}
          </>
        )}
      </div>

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

function TypeBadge({ type }: { type: LibraryResource["file_type"] }) {
  const color = TYPE_COLORS[type] ?? "var(--ink)";
  return (
    <div
      style={{
        width: 48,
        height: 60,
        background: "var(--paper)",
        border: "1px solid var(--line)",
        position: "relative",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 6,
        flexShrink: 0,
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 14,
          height: 14,
          background: "var(--paper-2)",
          borderLeft: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      />
      <div
        className="mono"
        style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".04em", color }}
      >
        {type}
      </div>
    </div>
  );
}

function downloadHref(r: LibraryResource): string {
  if (r.external_url && r.external_url !== "#") return r.external_url;
  if (r.file_path) return r.file_path;
  return "#";
}

function isExternal(r: LibraryResource): boolean {
  return !!r.external_url && r.external_url !== "#" && !r.file_path;
}

function ResourceCard({ r }: { r: LibraryResource }) {
  const href = downloadHref(r);
  const isStub = href === "#";
  const ext = isExternal(r);

  return (
    <article
      className="hover-lift"
      style={{
        padding: "22px 22px 18px",
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 220,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <TypeBadge type={r.file_type} />
        <span
          className="mono"
          style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".08em" }}
        >
          {formatFileSize(r.file_size_bytes)}
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <div
          className="mono"
          style={{
            fontSize: 10,
            color: "var(--ink-3)",
            letterSpacing: ".1em",
            marginBottom: 6,
            textTransform: "uppercase",
          }}
        >
          {r.category}
          {r.topic ? ` · ${r.topic}` : ""} · {formatPubDate(r.published_at)}
        </div>
        <h3
          style={{
            fontWeight: 700,
            fontSize: 19,
            lineHeight: 1.15,
            letterSpacing: "-.005em",
            color: "var(--ink)",
          }}
        >
          {r.title}
        </h3>
        {r.description && (
          <p
            style={{
              fontSize: 13,
              color: "var(--ink-2)",
              lineHeight: 1.55,
              marginTop: 8,
            }}
          >
            {r.description}
          </p>
        )}
      </div>
      {isStub ? (
        <span
          className="btn btn-sm"
          style={{
            justifyContent: "center",
            background: "var(--paper-2)",
            color: "var(--ink-3)",
            border: "1px solid var(--line)",
            cursor: "default",
          }}
        >
          Coming soon
        </span>
      ) : (
        <a
          href={href}
          target={ext ? "_blank" : undefined}
          rel={ext ? "noopener noreferrer" : undefined}
          className="btn btn-sm btn-pri"
          style={{ justifyContent: "center", textDecoration: "none" }}
        >
          <Icon name={ext ? "external" : "download"} size={13} />{" "}
          {ext ? "Open at source" : "Download"}
        </a>
      )}
    </article>
  );
}

function ResourceTable({ rows }: { rows: LibraryResource[] }) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "60px 1fr 130px 130px 110px 110px",
          gap: 18,
          padding: "14px 22px",
          borderBottom: "1px solid var(--line)",
          background: "var(--card-2)",
          alignItems: "center",
        }}
      >
        <div />
        {(["Name", "Category", "Type · size", "Updated", ""] as const).map((h, i) => (
          <div
            key={i}
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: ".14em",
              color: "var(--ink-3)",
              textTransform: "uppercase",
              fontWeight: 700,
              textAlign: i === 4 ? "right" : "left",
            }}
          >
            {h}
          </div>
        ))}
      </div>
      {rows.map((r, i) => {
        const href = downloadHref(r);
        const isStub = href === "#";
        const ext = isExternal(r);
        return (
          <div
            key={r.id}
            className="hover-lift"
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 130px 130px 110px 110px",
              gap: 18,
              padding: "14px 22px",
              borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : "none",
              alignItems: "center",
            }}
          >
            <TypeBadge type={r.file_type} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{r.title}</div>
              {r.topic && (
                <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)" }}>
                  {r.topic}
                </div>
              )}
            </div>
            <div>
              <span
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: ".08em",
                  padding: "3px 8px",
                  background: "var(--paper-2)",
                  border: "1px solid var(--line)",
                  borderRadius: 3,
                  color: "var(--ink-2)",
                  fontWeight: 600,
                }}
              >
                {r.category}
              </span>
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-2)" }}>
              {r.file_type} · {formatFileSize(r.file_size_bytes)}
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
              {formatPubDate(r.published_at)}
            </div>
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
              {isStub ? (
                <span
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: "var(--ink-3)",
                    letterSpacing: ".08em",
                    fontStyle: "italic",
                  }}
                >
                  coming soon
                </span>
              ) : (
                <a
                  href={href}
                  target={ext ? "_blank" : undefined}
                  rel={ext ? "noopener noreferrer" : undefined}
                  className="btn btn-sm btn-pri"
                  style={{ textDecoration: "none" }}
                >
                  <Icon name={ext ? "external" : "download"} size={13} />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyState({ cat }: { cat: LibraryCategory }) {
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
      <Icon name="file" size={32} style={{ color: "var(--ink-3)", marginBottom: 12 }} />
      <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
        {cat === "All" ? "The library is empty." : `Nothing in ${cat} yet.`}
      </h3>
      <p style={{ color: "var(--ink-2)", fontSize: 14 }}>
        Resources are added by Verst tutors and admins. Check back soon.
      </p>
    </div>
  );
}

function formatPubDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", year: "numeric" });
}
