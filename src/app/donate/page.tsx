import { AmbientBackdrop } from "@/components/ambient-backdrop";
import { DonateWidget } from "@/components/donate-widget";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Donate — Verst Carbon Academy",
  description:
    "Every gift funds a scholarship for a learner in East, West or Southern Africa. Climate education that opens jobs.",
};

const IMPACT = [
  { stat: "$50", label: "Funds one learner for a month" },
  { stat: "$250", label: "Sponsors a full Module + cohort" },
  { stat: "$1,000", label: "Underwrites a tutor's quarter" },
];

const WHERE_IT_GOES = [
  {
    icon: "users" as const,
    title: "Scholarships",
    body:
      "70% of every gift goes directly to learner scholarships — full module access, certificate fees waived, mentor calls included.",
  },
  {
    icon: "leaf" as const,
    title: "African content",
    body:
      "20% funds production of new lessons featuring African case studies — voice-over, slides, transcripts, peer review.",
  },
  {
    icon: "shield" as const,
    title: "Platform & moderation",
    body:
      "10% keeps the forum reviewed within 24h, the AI tutor accurate, and the certificate verification public and free forever.",
  },
];

const FAQ = [
  {
    q: "Where exactly does my money go?",
    a:
      "Every quarter we publish a transparency report listing total raised, total scholarships awarded, recipient countries, and content produced. The report ships to every donor's email.",
  },
  {
    q: "Is my donation tax-deductible?",
    a:
      "Verst Carbon is a Kenyan-incorporated mission-led company. We're working on US 501(c)(3) fiscal-sponsorship for 2026 to make US gifts deductible. UK and EU donor advised funds can already give via specific routes — email charles.m.waweru@gmail.com to set that up.",
  },
  {
    q: "Can my organization sponsor a cohort?",
    a:
      "Yes. We run sponsored cohorts of 25–100 learners with branded onboarding for corporates, foundations and multilaterals. Email us with your target geography and team size and we'll send a proposal.",
  },
  {
    q: "Will I get a receipt?",
    a:
      "Immediately on completion. PDF receipt with our address and tax ID, sent to the email you enter on the form.",
  },
];

export default async function DonatePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let defaultEmail = "";
  let defaultName = "";
  if (user) {
    defaultEmail = user.email ?? "";
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle<{ full_name: string | null }>();
    defaultName = profile?.full_name ?? "";
  }

  return (
    <>
      <TopNav active="donate" />

      {/* hero */}
      <section
        style={{
          background: "var(--forest-2)",
          color: "#fff",
          borderBottom: "1px solid var(--ink)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <AmbientBackdrop particles={8} />
        <div
          className="container"
          style={{
            position: "relative",
            padding: "72px 32px 56px",
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 56,
            alignItems: "start",
          }}
        >
          <div className="anim-fade-in-up">
            <div
              className="eyebrow"
              style={{ color: "var(--moss)", marginBottom: 14 }}
            >
              · Donate · 100% open access
            </div>
            <h1
              className="display"
              style={{
                fontSize: "clamp(40px, 6vw, 76px)",
                color: "#fff",
                letterSpacing: "-.03em",
                lineHeight: 1.02,
                marginBottom: 22,
              }}
            >
              Africa is building the
              <br />
              next climate workforce.{" "}
              <em style={{ color: "var(--moss)" }}>Fund it.</em>
            </h1>
            <p
              style={{
                fontSize: 18,
                color: "#D9DCD3",
                maxWidth: 600,
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              Every Verst Academy module is taught by an African practitioner, costs
              less than a coffee per lesson, and ends in a publicly-verifiable certificate.
              Donations keep it free for the learners who can't afford even that.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 0,
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 10,
                overflow: "hidden",
                maxWidth: 600,
              }}
            >
              {IMPACT.map((it, i, a) => (
                <div
                  key={it.stat}
                  style={{
                    padding: "20px 18px",
                    borderRight:
                      i < a.length - 1 ? "1px solid rgba(255,255,255,0.18)" : "none",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 30,
                      fontWeight: 800,
                      color: "var(--moss)",
                      letterSpacing: "-.01em",
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {it.stat}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#C9CCC4",
                      lineHeight: 1.4,
                    }}
                  >
                    {it.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* sticky donate panel */}
          <div style={{ position: "sticky", top: 80 }}>
            <DonateWidget defaultEmail={defaultEmail} defaultName={defaultName} />
          </div>
        </div>
      </section>

      {/* where your gift goes */}
      <section className="container" style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 720, marginBottom: 56 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            · Where your gift goes
          </div>
          <h2
            className="display"
            style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-.02em" }}
          >
            Three pots. <em>Transparent.</em>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--ink-2)",
              marginTop: 14,
              lineHeight: 1.6,
            }}
          >
            Every quarter we publish exactly how the money was spent — names withheld, totals
            published. No overhead bloat.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
        >
          {WHERE_IT_GOES.map((b) => (
            <div
              key={b.title}
              style={{
                padding: 28,
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  background: "var(--forest-2)",
                  color: "var(--moss)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Icon name={b.icon} size={24} />
              </div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: "-.01em",
                  marginBottom: 10,
                }}
              >
                {b.title}
              </h3>
              <p style={{ fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* story strip */}
      <section
        style={{
          background: "var(--paper-2)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div
          className="container"
          style={{
            padding: "72px 32px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              · One learner's story
            </div>
            <blockquote
              className="display"
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                lineHeight: 1.25,
                letterSpacing: "-.01em",
                fontStyle: "italic",
                color: "var(--ink)",
                marginBottom: 20,
              }}
            >
              "I was a soil scientist before this. Now I lead carbon MRV for three biochar
              projects in northern Tanzania. Verst was the bridge."
            </blockquote>
            <div style={{ fontSize: 14, color: "var(--ink-2)", fontWeight: 500 }}>
              Mariam Hassan
            </div>
            <div
              className="mono"
              style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}
            >
              VERST MODULE I & III · 2025 COHORT
            </div>
          </div>

          <div
            style={{
              padding: 32,
              border: "1px solid var(--ink)",
              background: "var(--card)",
            }}
          >
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              · Year-1 goal
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-.025em",
                color: "var(--forest)",
                marginBottom: 6,
              }}
            >
              500
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>
              fully-sponsored African learners
            </div>
            <div
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: ".1em",
                color: "var(--ink-3)",
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              YOU CAN UNDERWRITE 5–25 OF THEM
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: 14,
                color: "var(--ink-2)",
                lineHeight: 1.8,
              }}
            >
              <li>· $50 / month × 12 = 12 learner-months</li>
              <li>· $250 one-off = 1 full module sponsorship</li>
              <li>· $1,000 one-off = a tutor's quarter</li>
              <li>· Corporate sponsors: 25–100 seats with branding</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container" style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 720, marginBottom: 40 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            · Questions
          </div>
          <h2
            className="display"
            style={{ fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-.02em" }}
          >
            Common questions.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            maxWidth: 1000,
          }}
        >
          {FAQ.map((f) => (
            <div
              key={f.q}
              style={{
                padding: 24,
                border: "1px solid var(--line)",
                background: "var(--card)",
                borderRadius: 10,
              }}
            >
              <h4
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                  letterSpacing: "-.005em",
                  marginBottom: 10,
                  color: "var(--ink)",
                }}
              >
                {f.q}
              </h4>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.65 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* footer CTA strip */}
      <section
        style={{
          background: "var(--forest-2)",
          color: "#fff",
          padding: "56px 32px",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 32,
            alignItems: "center",
          }}
        >
          <div>
            <h3
              className="display"
              style={{
                fontSize: "clamp(28px, 3vw, 40px)",
                color: "#fff",
                marginBottom: 10,
                letterSpacing: "-.015em",
              }}
            >
              Got a foundation, fund or corporate budget?
            </h3>
            <p style={{ fontSize: 15, color: "#D9DCD3", maxWidth: 620, lineHeight: 1.6 }}>
              Sponsored cohorts of 25–100 learners with branded onboarding. We design the cohort
              around your team's geography, sector and goals.
            </p>
          </div>
          <a
            href="mailto:charles.m.waweru@gmail.com?subject=Cohort%20sponsorship%20inquiry"
            className="btn btn-accent btn-lg"
            style={{ textDecoration: "none" }}
          >
            Email us <Icon name="arrow-r" size={14} />
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
