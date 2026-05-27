import Link from "next/link";
import type { Course } from "@/data/courses";
import { Avatar } from "./avatar";
import { GlassThumb } from "./glass-thumb";
import { Icon } from "./icon";

function durationTail(dur: string) {
  return dur.split("·")[1]?.trim() ?? dur;
}

export function ModuleCardFeatured({ c }: { c: Course }) {
  const href = `/program/${c.id}`;
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        className="hover-lift"
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          overflow: "hidden",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ position: "relative", height: 280 }}>
          <GlassThumb icon={c.glassIcon} code={c.code} label={c.title} style={{ height: "100%", borderRadius: 0 }} />
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              right: 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <span className="tag tag-cert">Certified</span>
              <span
                className="tag"
                style={{ background: "rgba(255,255,255,.92)", color: "var(--ink)", borderColor: "transparent" }}
              >
                Module {c.code}
              </span>
            </div>
            <span
              style={{
                padding: "5px 10px",
                background: "rgba(255,255,255,.92)",
                color: "var(--ink)",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".04em",
              }}
            >
              {c.lessons} lessons · {durationTail(c.dur)}
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              left: 24,
              bottom: 18,
              color: "rgba(255,255,255,0.65)",
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-.03em",
              opacity: 0.95,
              lineHeight: 1,
            }}
          >
            {c.code}.
          </div>
        </div>
        <div style={{ padding: "26px 28px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span
              className="mono"
              style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".12em", fontWeight: 700, textTransform: "uppercase" }}
            >
              {c.cat}
            </span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--ink-4)" }} />
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".06em", fontWeight: 600 }}>
              {c.lvl.toUpperCase()}
            </span>
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 32, lineHeight: 1.1, letterSpacing: "-.015em" }}>{c.title}</h3>
          <p style={{ fontSize: 15, color: "var(--ink-2)", lineHeight: 1.55, fontWeight: 500 }}>{c.sub}</p>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginTop: "auto",
              paddingTop: 18,
              borderTop: "1px dashed var(--line)",
            }}
          >
            <Avatar name={c.inst} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{c.inst}</div>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                {c.instRole}
              </div>
            </div>
            <span className="btn btn-pri btn-sm">
              View syllabus <Icon name="arrow-r" size={12} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function ModuleRow({ c }: { c: Course }) {
  const syllabus = c.syllabus ?? [];
  return (
    <Link href={`/program/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        className="hover-lift"
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "200px 1fr 220px",
        }}
      >
        <div style={{ position: "relative" }}>
          <GlassThumb
            icon={c.glassIcon}
            code={c.code}
            style={{ height: "100%", borderRadius: 0, minHeight: 200 }}
          />
        </div>
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--ink-3)",
                letterSpacing: ".14em",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {c.cat}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--ink-4)" }} />
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".06em", fontWeight: 600 }}>
              {c.lvl.toUpperCase()}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--ink-4)" }} />
            <span className="mono" style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".06em", fontWeight: 600 }}>
              {c.dur.toUpperCase()}
            </span>
            {c.cert && <span className="tag tag-cert" style={{ marginLeft: "auto" }}>Certified</span>}
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 24, lineHeight: 1.1, letterSpacing: "-.005em" }}>{c.title}</h3>
          <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>{c.sub}</p>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
            <Avatar name={c.inst} size={28} />
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{c.inst}</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{c.instRole}</span>
          </div>
          {syllabus.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 14, borderTop: "1px dashed var(--line)" }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: ".14em", color: "var(--ink-3)", marginBottom: 8, fontWeight: 600 }}>
                SYLLABUS
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {syllabus.slice(0, 4).map((l) => (
                  <span key={l.id} className="chip" style={{ height: 24, fontSize: 11 }}>
                    {l.t.length > 34 ? l.t.slice(0, 34) + "…" : l.t}
                  </span>
                ))}
                {syllabus.length > 4 && (
                  <span className="chip" style={{ height: 24, fontSize: 11 }}>
                    + {syllabus.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            padding: "24px",
            background: "var(--paper-2)",
            borderLeft: "1px solid var(--line)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 18,
          }}
        >
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: ".14em", color: "var(--ink-3)", fontWeight: 700, marginBottom: 8 }}>
              ENROLMENT
            </div>
            <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: "-.01em" }}>{c.price}</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
              {c.price === "Free" ? "No card required" : "Or included in the full program"}
            </div>
          </div>
          <div>
            <div className="bar bar-thick" style={{ marginBottom: 6 }}>
              <i style={{ width: c.progress > 0 ? `${c.progress}%` : "0%" }} />
            </div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: ".06em", color: "var(--ink-3)", fontWeight: 600 }}>
              {c.progress > 0 ? `${c.progress}% COMPLETE · IN PROGRESS` : "NOT STARTED"}
            </div>
          </div>
          <span className="btn btn-pri" style={{ justifyContent: "center" }}>
            {c.progress > 0 ? "Resume" : "Enroll"} <Icon name="arrow-r" size={12} />
          </span>
        </div>
      </article>
    </Link>
  );
}

export function ModuleCardCompact({ c }: { c: Course }) {
  return (
    <Link href={`/program/${c.id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <article
        className="hover-lift"
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 10,
          cursor: "pointer",
          padding: "18px 20px",
          display: "grid",
          gridTemplateColumns: "56px 1fr auto",
          gap: 18,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 8,
            background: "var(--paper-2)",
            border: "1px solid var(--line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 28,
            color: "var(--forest)",
            letterSpacing: "-.02em",
          }}
        >
          {c.code}
        </div>
        <div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
            <span
              className="mono"
              style={{ fontSize: 9, color: "var(--ink-3)", letterSpacing: ".14em", fontWeight: 700, textTransform: "uppercase" }}
            >
              {c.cat}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--ink-4)" }} />
            <span className="mono" style={{ fontSize: 9, color: "var(--ink-3)", letterSpacing: ".06em", fontWeight: 600 }}>
              {c.lessons} LESSONS
            </span>
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.2, letterSpacing: "-.005em" }}>{c.title}</h3>
          <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>
            <span>{c.inst}</span>
            <span style={{ margin: "0 6px" }}>·</span>
            <span>{durationTail(c.dur)}</span>
          </div>
        </div>
        <Icon name="arrow-r" size={16} style={{ color: "var(--ink-3)" }} />
      </article>
    </Link>
  );
}
