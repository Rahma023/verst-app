import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { ForumNewThreadForm } from "@/components/forum-new-thread-form";
import { Icon } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Ask a question — Verst Forum",
};

export default async function NewThreadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/?signin=1");

  return (
    <>
      <TopNav active="forum" />

      <div className="container" style={{ padding: "18px 32px 0" }}>
        <div
          className="mono"
          style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".1em", fontWeight: 600 }}
        >
          <Link href="/forum" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
            FORUM
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "var(--ink)", fontWeight: 700 }}>NEW THREAD</span>
        </div>
      </div>

      <section
        className="container"
        style={{
          padding: "32px 32px 80px",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 48,
        }}
      >
        <div>
          <h1
            className="display"
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              letterSpacing: "-.025em",
              marginBottom: 14,
            }}
          >
            Ask a <em>question</em>.
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "var(--ink-2)",
              maxWidth: 560,
              marginBottom: 32,
              lineHeight: 1.55,
            }}
          >
            Practitioners on the platform have <strong>12+ years</strong> of field experience on
            average. Be specific and they'll be specific back.
          </p>
          <ForumNewThreadForm />
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              padding: 22,
              border: "1px solid var(--line)",
              borderRadius: 8,
              background: "var(--card)",
            }}
          >
            <Icon name="sparkle" size={16} style={{ color: "var(--forest)" }} />
            <h4 style={{ fontWeight: 700, fontSize: 18, marginTop: 8, marginBottom: 10 }}>
              Tips for a great question
            </h4>
            <ul
              style={{
                paddingLeft: 18,
                fontSize: 13,
                color: "var(--ink-2)",
                lineHeight: 1.65,
                listStyle: "disc",
              }}
            >
              <li style={{ marginBottom: 6 }}>
                State the methodology, geography and project scale up-front.
              </li>
              <li style={{ marginBottom: 6 }}>
                Quote specific sections of the spec rather than paraphrasing.
              </li>
              <li style={{ marginBottom: 6 }}>
                Tell us what you've already tried — saves everyone time.
              </li>
              <li>End with a single, clear, answerable question.</li>
            </ul>
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
                fontSize: 18,
                marginTop: 10,
                marginBottom: 8,
                color: "#fff",
              }}
            >
              Try the AI tutor first?
            </h4>
            <p style={{ fontSize: 12.5, color: "#C9CCC4", lineHeight: 1.55, marginBottom: 14 }}>
              For factual climate-tech questions, the Verst tutor answers in seconds. Open any
              lesson and use the chat panel.
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
      </section>

      <Footer />
    </>
  );
}
