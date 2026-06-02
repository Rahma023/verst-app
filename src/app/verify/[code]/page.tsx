import Link from "next/link";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icon";
import { TopNav } from "@/components/top-nav";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;
  return {
    title: `Verify ${code} — Verst Carbon Academy`,
    description: `Verify a Verst Carbon Academy certificate by code.`,
  };
}

type VerifyRow = {
  module_code: string | null;
  module_title: string | null;
  issued_at: string;
  verify_code: string;
  learner_full_name: string | null;
};

export default async function VerifyPage(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;

  // get_cert_by_verify_code is SECURITY DEFINER; returns only public proof
  // fields, no user_id leakage. Anon-callable.
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_cert_by_verify_code", {
    p_code: code,
  });
  const cert = ((data ?? [])[0] ?? null) as VerifyRow | null;
  const learnerName = cert?.learner_full_name ?? null;
  const verified = !!cert && !error;

  return (
    <>
      <TopNav active="home" />
      <main
        className="container"
        style={{ padding: "56px 32px 80px", maxWidth: 760 }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--ink-3)",
            letterSpacing: ".18em",
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          CERTIFICATE VERIFICATION
        </div>
        <h1
          className="display"
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            letterSpacing: "-.025em",
            marginBottom: 18,
          }}
        >
          {verified ? (
            <>
              This certificate is <em>verified</em>.
            </>
          ) : (
            <>
              Certificate <em style={{ color: "var(--bad)" }}>not found</em>.
            </>
          )}
        </h1>

        {verified && cert ? (
          <>
            <p
              style={{
                fontSize: 16,
                color: "var(--ink-2)",
                lineHeight: 1.55,
                marginBottom: 28,
                maxWidth: 560,
              }}
            >
              Issued by Verst Carbon Academy on completion of the module
              assessment with a passing score.
            </p>

            <section
              style={{
                border: "1px solid var(--ink)",
                background: "var(--card)",
                padding: "26px 30px",
                marginBottom: 24,
              }}
            >
              {(
                [
                  ["Awarded to", learnerName ?? "(name on file)"],
                  ["Module", `${cert.module_code ?? "—"} · ${cert.module_title ?? "Verst Carbon Academy"}`],
                  [
                    "Issued",
                    new Date(cert.issued_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }),
                  ],
                  ["Verify code", cert.verify_code],
                ] as const
              ).map(([k, v], i, a) => (
                <div
                  key={k}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "150px 1fr",
                    gap: 18,
                    padding: "12px 0",
                    borderBottom:
                      i < a.length - 1 ? "1px dashed var(--line)" : "none",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--ink-3)",
                      letterSpacing: ".14em",
                      fontWeight: 700,
                    }}
                  >
                    {k.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: k === "Verify code" ? 700 : 500,
                      color: "var(--ink)",
                      fontFamily:
                        k === "Verify code" ? "monospace" : "inherit",
                      letterSpacing: k === "Verify code" ? ".05em" : "normal",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </section>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Icon
                name="shield"
                size={18}
                stroke={1.6}
                style={{ color: "var(--forest)" }}
              />
              <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
                Anyone with this URL can confirm authenticity. Verst Carbon
                Academy maintains the underlying record.
              </span>
            </div>
          </>
        ) : (
          <>
            <p
              style={{
                fontSize: 15,
                color: "var(--ink-2)",
                lineHeight: 1.55,
                marginBottom: 24,
              }}
            >
              We couldn&apos;t find a certificate with the code{" "}
              <strong style={{ fontFamily: "monospace" }}>{code}</strong>. The
              code might be mistyped, or the certificate may have been revoked.
            </p>
            <Link href="/" className="btn btn-pri btn-lg">
              Back to homepage →
            </Link>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
