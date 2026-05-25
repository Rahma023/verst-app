"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useModal } from "@/lib/auth/modal-context";
import { createClient } from "@/lib/supabase/client";
import { ModalShell } from "./modal-shell";

export function SignupModal() {
  const { close, open } = useModal();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [promoOptIn, setPromoOptIn] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the terms to continue.");
      return;
    }
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          promo_opt_in: promoOptIn,
        },
      },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    close();
    router.refresh();
  }

  return (
    <ModalShell
      title="Create your account"
      subtitle="Join 1,420 learners building Africa's climate-tech future."
      width={460}
    >
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
          {busy ? "Creating account…" : "Create account"}
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
