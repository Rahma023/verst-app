import Link from "next/link";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icon";
import { ModuleRow } from "@/components/module-card";
import { TopNav } from "@/components/top-nav";
import { getCoursesWithSyllabus } from "@/lib/data/courses";

const SECTIONS = [
  { id: "A" as const, title: "Carbon Markets", sub: "The science, accounting, finance and policy of carbon." },
  { id: "B" as const, title: "AI in Climate", sub: "How artificial intelligence is reshaping climate practice." },
];

export const metadata = {
  title: "Program — Verst Carbon Academy",
  description:
    "Two sections, one program. Section A covers AI in climate; Section B covers carbon markets. Take any module independently or work through the full curriculum.",
};

type SearchParams = { cat?: string };

export default async function ProgramPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const { cat: catParam } = await props.searchParams;
  const cat = catParam ?? "All";

  const courses = await getCoursesWithSyllabus();
  const categories = ["All", ...Array.from(new Set(courses.map((c) => c.cat)))];
  const filtered = courses.filter((c) => cat === "All" || c.cat === cat);

  return (
    <>
      <TopNav active="program" />

      {/* page header */}
      <section style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="container" style={{ padding: "56px 32px 36px" }}>
          <div style={{ marginBottom: 32, maxWidth: 880 }}>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              · The Verst Academy program · self-paced
            </div>
            <h1
              className="display"
              style={{ fontSize: "clamp(40px, 6vw, 72px)", maxWidth: 780, letterSpacing: "-.03em" }}
            >
              Two sections.
              <br />
              One <em>program</em>.
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "var(--ink-2)",
                maxWidth: 620,
                marginTop: 18,
                lineHeight: 1.55,
              }}
            >
              <strong>Section A · Carbon Markets</strong> covers the science, accounting, finance
              and policy of carbon.{" "}
              <strong>Section B · AI in Climate</strong> covers how artificial intelligence is
              reshaping measurement, modelling and operations. Take any module independently, or
              work through the full program.
            </p>
          </div>

          {/* category filter */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {categories.map((c) => {
              const isActive = cat === c;
              const href = c === "All" ? "/program" : `/program?cat=${encodeURIComponent(c)}`;
              return (
                <Link
                  key={c}
                  href={href}
                  className={"chip " + (isActive ? "on" : "")}
                  style={{ textDecoration: "none" }}
                >
                  {c}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* body — grouped by section */}
      <div className="container" style={{ padding: "24px 32px 80px" }}>
        {SECTIONS.map((sec, sIdx) => {
          const items = filtered.filter((c) => c.section === sec.id);
          if (!items.length) return null;
          return (
            <div key={sec.id} style={{ marginTop: sIdx === 0 ? 24 : 56 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 24,
                  alignItems: "baseline",
                  paddingBottom: 18,
                  borderBottom: "2px solid var(--ink)",
                  marginBottom: 28,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 64,
                    lineHeight: 1,
                    color: "var(--forest)",
                    letterSpacing: "-.03em",
                  }}
                >
                  Section {sec.id}.
                </span>
                <div>
                  <h2
                    style={{
                      fontWeight: 800,
                      fontSize: 32,
                      letterSpacing: "-.015em",
                      lineHeight: 1.05,
                    }}
                  >
                    {sec.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--ink-2)",
                      marginTop: 6,
                      maxWidth: 540,
                      lineHeight: 1.5,
                    }}
                  >
                    {sec.sub}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    className="mono"
                    style={{ fontSize: 10, color: "var(--ink-3)", letterSpacing: ".14em", fontWeight: 700 }}
                  >
                    MODULES
                  </div>
                  <div className="num" style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-.01em" }}>
                    {items.length}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {items.map((c) => (
                  <ModuleRow key={c.id} c={c} />
                ))}
              </div>
            </div>
          );
        })}

        {/* certificate strip */}
        <div
          style={{
            marginTop: 64,
            padding: "40px 48px",
            background: "var(--forest-2)",
            color: "#fff",
            borderRadius: 14,
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 36,
            alignItems: "center",
          }}
        >
          <Icon name="trophy" size={48} style={{ color: "var(--moss)" }} />
          <div>
            <div className="eyebrow" style={{ color: "var(--moss)" }}>
              · The final credential
            </div>
            <h3
              className="display"
              style={{ fontSize: "clamp(28px, 3vw, 36px)", marginTop: 8, color: "#fff" }}
            >
              Verst Academy <em style={{ color: "var(--moss)" }}>Certificate</em>
            </h3>
            <p style={{ color: "#D9DCD3", marginTop: 8, maxWidth: 560, fontSize: 14 }}>
              Complete the modules in either section (or both) with a minimum 75% pass score to earn
              a publicly-verifiable digital credential.
            </p>
          </div>
          <span className="btn btn-accent btn-lg">
            See sample <Icon name="arrow-r" size={14} />
          </span>
        </div>
      </div>

      <Footer />
    </>
  );
}
