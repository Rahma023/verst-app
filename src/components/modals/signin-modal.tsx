"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useModal } from "@/lib/auth/modal-context";
import { createClient } from "@/lib/supabase/client";
import { ModalShell } from "./modal-shell";

export function SigninModal() {
  const { close, open } = useModal();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
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
      title="Welcome back"
      subtitle="Sign in to your Verst Carbon Academy account."
      width={440}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
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
          {busy ? "Signing in…" : "Sign in"}
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
          New here?{" "}
          <button
            type="button"
            onClick={() => open("signup")}
            style={{
              marginLeft: 6,
              background: "transparent",
              border: "none",
              color: "var(--forest)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Create an account →
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
