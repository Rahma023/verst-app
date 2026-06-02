"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "@/components/icon";
import { useModal } from "@/lib/auth/modal-context";
import { createClient } from "@/lib/supabase/client";
import { ModalShell } from "./modal-shell";

type Role = "learner" | "tutor" | "admin";

const ROLE_CARDS: {
  id: Role;
  title: string;
  blurb: string;
  icon: IconName;
}[] = [
  {
    id: "learner",
    title: "Sign up as a Learner",
    blurb:
      "Enrol in modules, take lessons, earn certificates. Open to anyone curious about climate-tech and carbon markets.",
    icon: "book",
  },
  {
    id: "tutor",
    title: "Sign up as a Tutor",
    blurb:
      "Upload lesson content for the modules you teach and answer learner questions. Module assignment is granted by an admin.",
    icon: "user",
  },
  {
    id: "admin",
    title: "Sign up as an Administrator",
    blurb:
      "Manage the full platform — modules, lessons, content uploads, tutor assignments. Reserved for the Verst Carbon core team.",
    icon: "shield",
  },
];

const ROLE_LABELS: Record<Role, string> = {
  learner: "Learner",
  tutor: "Tutor",
  admin: "Administrator",
};

export function SignupModal() {
  const { close, open } = useModal();
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [promoOptIn, setPromoOptIn] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- STEP 1: role picker ----------
  if (role === null) {
    return (
      <ModalShell
        title="Create your account"
        subtitle="Pick the role that best fits why you're here. You can change details later."
        width={520}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ROLE_CARDS.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => setRole(card.id)}
              style={{
                textAlign: "left",
                padding: "16px 18px",
                border: "1px solid var(--line)",
                background: "var(--card)",
                borderRadius: 10,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "grid",
                gridTemplateColumns: "40px 1fr auto",
                gap: 14,
                alignItems: "center",
                transition: "border-color .15s ease, background .15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--forest)";
                e.currentTarget.style.background = "rgba(0,128,55,.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--line)";
                e.currentTarget.style.background = "var(--card)";
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 99,
                  background: "var(--forest)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={card.icon} size={18} stroke={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
                  {card.title}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
                  {card.blurb}
                </div>
              </div>
              <Icon name="arrow-r" size={14} style={{ color: "var(--ink-3)" }} />
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 13,
            color: "var(--ink-3)",
            marginTop: 18,
          }}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => open("signin")}
            style={{
              marginLeft: 6,
              background: "transparent",
              border: "none",
              color: "var(--forest)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign in →
          </button>
        </div>
      </ModalShell>
    );
  }

  // ---------- STEP 2: account form ----------
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the terms to continue.");
      return;
    }
    if (role === null) return; // type narrowing
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          promo_opt_in: promoOptIn,
        },
      },
    });
    if (signUpErr) {
      setError(signUpErr.message);
      setBusy(false);
      return;
    }

    // Update profile role if not the default ('learner').
    if (role !== "learner") {
      const {
        data: { user: newUser },
      } = await supabase.auth.getUser();
      if (newUser) {
        const { error: roleErr } = await supabase
          .from("profiles")
          .update({ role })
          .eq("user_id", newUser.id);
        if (roleErr) {
          // Don't block signup — surface a warning but proceed.
          console.warn("Couldn't set role on profile:", roleErr.message);
        }
      }
    }

    setBusy(false);
    close();
    const dest = role === "admin" ? "/admin" : role === "tutor" ? "/tutor" : "/dashboard";
    router.push(dest);
    router.refresh();
  }

  return (
    <ModalShell
      title={`Sign up as ${ROLE_LABELS[role]}`}
      subtitle="A few details to get you started."
      width={480}
    >
      <button
        type="button"
        onClick={() => setRole(null)}
        style={{
          background: "transparent",
          border: "none",
          color: "var(--ink-3)",
          fontSize: 12.5,
          fontWeight: 600,
          cursor: "pointer",
          padding: 0,
          marginBottom: 8,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        ← Pick a different role
      </button>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="label">Full name</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input"
            placeholder="Ada Lovelace"
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="label">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@example.com"
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="label">Password</span>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="At least 6 characters"
              style={{ paddingRight: 64 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "var(--ink-3)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: ".05em",
                cursor: "pointer",
              }}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
        </label>

        <label className="chk">
          <input
            type="checkbox"
            checked={promoOptIn}
            onChange={(e) => setPromoOptIn(e.target.checked)}
          />
          <span className="box" />
          Send me occasional updates about new modules and webinars.
        </label>
        <label className="chk">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="box" />
          I agree to the Terms of Service and Privacy Policy.
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
          style={{ justifyContent: "center", width: "100%", opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Creating account…" : `Create ${ROLE_LABELS[role]} account`}
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 13,
            color: "var(--ink-3)",
            marginTop: 4,
          }}
        >
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => open("signin")}
            style={{
              marginLeft: 6,
              background: "transparent",
              border: "none",
              color: "var(--forest)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign in →
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
