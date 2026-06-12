"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { sendEnrolmentEmail } from "@/app/program/[id]/enrol-actions";
import { useModal } from "@/lib/auth/modal-context";
import { createClient } from "@/lib/supabase/client";
import { ModalShell } from "./modal-shell";

type Profile = {
  full_name: string | null;
  organization: string | null;
  country: string | null;
  years_experience: number | null;
  job_role: string | null;
};

export function EnrolModal() {
  const { payload, close } = useModal();
  const router = useRouter();
  const courseId = (payload?.courseId as string) ?? "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [country, setCountry] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [goal, setGoal] = useState("");
  const [consented, setConsented] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Prefill from profile
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, organization, country, years_experience, job_role")
        .eq("user_id", user.id)
        .maybeSingle<Profile>();
      if (cancelled) return;
      setEmail(user.email ?? "");
      if (profile) {
        setFullName(profile.full_name ?? "");
        setOrganization(profile.organization ?? "");
        setCountry(profile.country ?? "");
        setYearsExperience(profile.years_experience?.toString() ?? "");
        setJobRole(profile.job_role ?? "");
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consented) {
      setError("Please confirm you agree to share these details.");
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You're not signed in. Refresh and try again.");
      setBusy(false);
      return;
    }

    const yearsExpNum = yearsExperience.trim() === "" ? null : Number(yearsExperience);

    const { error: profileErr } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        organization,
        country,
        years_experience: Number.isFinite(yearsExpNum) ? yearsExpNum : null,
        job_role: jobRole,
      })
      .eq("user_id", user.id);
    if (profileErr) {
      setError(`Couldn't update profile: ${profileErr.message}`);
      setBusy(false);
      return;
    }

    const { error: enrolErr } = await supabase.from("enrolments").insert({
      user_id: user.id,
      module_id: courseId,
      org_at_enrol: organization,
      country_at_enrol: country,
      goal_text: goal,
    });
    const wasAlreadyEnrolled = enrolErr?.code === "23505";
    if (enrolErr && !wasAlreadyEnrolled) {
      setError(`Couldn't enroll: ${enrolErr.message}`);
      setBusy(false);
      return;
    }

    // Fire-and-forget confirmation email (only on a fresh enrolment — don't
    // spam the inbox if they re-submit the same form).
    if (!wasAlreadyEnrolled) {
      void sendEnrolmentEmail(courseId).catch(() => {
        // Email failure must never block the UX — already logged server-side.
      });
    }

    setSuccess(true);
    setBusy(false);
    // Brief success state, then close and refresh
    setTimeout(() => {
      close();
      router.refresh();
    }, 1500);
  }

  if (success) {
    return (
      <ModalShell title="You're enrolled" width={420}>
        <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 20 }}>
          The module is now in your dashboard. We'll take you back to the syllabus in a moment.
        </p>
        <div
          style={{
            padding: "12px 14px",
            background: "rgba(0,128,55,.08)",
            border: "1px solid var(--forest)",
            borderRadius: 6,
            color: "var(--forest)",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ✓ Enrolment recorded
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      title="Enroll in this module"
      subtitle="A few details so the tutors can serve you better. We share this only with your instructor."
      width={520}
    >
      {loading ? (
        <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Loading…</div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="label">Full name</span>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="label">Email</span>
              <input type="email" readOnly value={email} className="input" style={{ background: "var(--paper-2)" }} />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="label">Organisation</span>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="input"
              placeholder="Where you work or study"
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="label">Country</span>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input"
                placeholder="Kenya, Nigeria, …"
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span className="label">Years of experience</span>
              <input
                type="number"
                min={0}
                max={60}
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="input"
                placeholder="0"
              />
            </label>
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="label">Current role</span>
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="input"
              placeholder="Project developer, analyst, student…"
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="label">What do you hope to get out of this module?</span>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="input"
              rows={3}
              placeholder="Optional — one or two sentences helps the instructor tailor sessions."
            />
          </label>

          <label className="chk">
            <input
              type="checkbox"
              checked={consented}
              onChange={(e) => setConsented(e.target.checked)}
            />
            <span className="box" />
            Share these details with the module instructor and Verst Carbon. I can update them anytime.
          </label>

          {error && (
            <div
              style={{
                fontSize: 12.5,
                color: "var(--bad)",
                background: "rgba(165, 58, 30, .08)",
                border: "1px solid rgba(165, 58, 30, .25)",
                borderRadius: 6,
                padding: "8px 12px",
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="btn btn-pri btn-lg"
            style={{ justifyContent: "center", width: "100%", opacity: busy ? 0.6 : 1, marginTop: 4 }}
          >
            {busy ? "Enrolling…" : "Enroll in module"}
          </button>
        </form>
      )}
    </ModalShell>
  );
}
