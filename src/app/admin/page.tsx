import Link from "next/link";
import { Icon } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import { requireAdmin } from "@/lib/auth/require-admin";

type ModuleWithLessons = {
  id: string;
  code: string;
  title: string;
  section: "A" | "B";
  category: string;
  order_index: number;
  lessons: {
    id: string;
    code: string;
    title: string;
    order_index: number;
    state: string;
  }[];
};

export const metadata = {
  title: "Admin · Studio — Verst Carbon Academy",
};

export default async function AdminLanding() {
  const { profile, supabase } = await requireAdmin();

  const { data: modules } = await supabase
    .from("modules")
    .select(
      "id, code, title, section, category, order_index, lessons (id, code, title, order_index, state)",
    )
    .order("order_index");

  const { data: assetCounts } = await supabase
    .from("lesson_assets")
    .select("lesson_id");

  const assetsByLesson = new Map<string, number>();
  (assetCounts ?? []).forEach((a) => {
    assetsByLesson.set(a.lesson_id, (assetsByLesson.get(a.lesson_id) ?? 0) + 1);
  });

  const rows = ((modules ?? []) as ModuleWithLessons[]).map((m) => ({
    ...m,
    lessons: m.lessons.slice().sort((a, b) => a.order_index - b.order_index),
  }));

  return (
    <>
      <TopNav active="home" />
      <div
        className="container"
        style={{ padding: "32px 32px 80px", maxWidth: 1100 }}
      >
        <div style={{ marginBottom: 28 }}>
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
            STUDIO · ADMIN
          </div>
          <h1
            className="display"
            style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-.02em" }}
          >
            Welcome back, {profile?.full_name?.split(" ")[0] ?? "admin"}.
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--ink-2)",
              marginTop: 10,
              maxWidth: 620,
              lineHeight: 1.55,
            }}
          >
            Pick a lesson below to upload slides, voice-over audio, avatar
            videos, or supplementary resources. Anything you upload becomes
            available to enrolled learners immediately.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {rows.map((m) => {
            const moduleAssetCount = m.lessons.reduce(
              (sum, l) => sum + (assetsByLesson.get(l.id) ?? 0),
              0,
            );
            return (
              <section
                key={m.id}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "var(--card)",
                }}
              >
                <header
                  style={{
                    padding: "18px 22px",
                    background: "var(--paper-2)",
                    borderBottom: "1px solid var(--line)",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    gap: 18,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: 28,
                      color: "var(--forest)",
                      letterSpacing: "-.02em",
                      width: 44,
                    }}
                  >
                    {m.code}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{m.title}</div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: "var(--ink-3)",
                        marginTop: 2,
                        letterSpacing: ".12em",
                        fontWeight: 600,
                      }}
                    >
                      SECTION {m.section} · {m.category.toUpperCase()}
                    </div>
                  </div>
                  <span
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--ink-3)",
                      fontWeight: 600,
                    }}
                  >
                    {m.lessons.length} lessons · {moduleAssetCount} asset
                    {moduleAssetCount === 1 ? "" : "s"}
                  </span>
                </header>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {m.lessons.map((l, j) => {
                    const count = assetsByLesson.get(l.id) ?? 0;
                    return (
                      <li
                        key={l.id}
                        style={{
                          borderBottom:
                            j < m.lessons.length - 1
                              ? "1px solid var(--line-2)"
                              : "none",
                        }}
                      >
                        <Link
                          href={`/admin/lessons/${l.id}`}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr auto auto",
                            gap: 16,
                            alignItems: "center",
                            padding: "14px 22px",
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <span
                            className="mono"
                            style={{
                              fontSize: 12,
                              color: "var(--forest)",
                              fontWeight: 700,
                              width: 44,
                            }}
                          >
                            {l.code}
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>
                            {l.title}
                          </span>
                          <span
                            className="mono"
                            style={{
                              fontSize: 10,
                              color:
                                count > 0 ? "var(--forest)" : "var(--ink-4)",
                              fontWeight: 700,
                              letterSpacing: ".1em",
                            }}
                          >
                            {count > 0
                              ? `${count} ASSET${count === 1 ? "" : "S"}`
                              : "NO ASSETS"}
                          </span>
                          <Icon
                            name="arrow-r"
                            size={14}
                            style={{ color: "var(--ink-3)" }}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
