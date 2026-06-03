"use client";

import { useState, useTransition } from "react";
import { registerForWebinar } from "@/app/webinars/actions";
import { Icon } from "@/components/icon";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function WebinarRegisterButton({
  webinarId,
  defaultEmail = "",
  size = "sm",
  joinLive = false,
}: {
  webinarId: string;
  defaultEmail?: string;
  size?: "sm" | "lg";
  joinLive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const label = joinLive ? "Join the session" : "Register";
  const btnClass = joinLive
    ? `btn btn-pri ${size === "lg" ? "btn-lg" : "btn-sm"}`
    : `btn ${size === "lg" ? "btn-lg" : "btn-sm"}`;

  function submit() {
    setError(null);
    start(async () => {
      const res = await registerForWebinar(webinarId, email, name || undefined);
      if (res.ok) setDone(true);
      else setError(res.error);
    });
  }

  if (done) {
    return (
      <span
        className="mono"
        style={{
          fontSize: 11,
          letterSpacing: ".06em",
          color: "var(--forest)",
          fontWeight: 700,
        }}
      >
        ✓ REGISTERED · CHECK INBOX
      </span>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={btnClass}
        style={{ whiteSpace: "nowrap" }}
      >
        {label}
      </button>
    );
  }

  const canSubmit = EMAIL_RX.test(email) && !pending;

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input"
        style={{ width: 200, height: 36, fontSize: 13 }}
        autoFocus
      />
      <input
        type="text"
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input"
        style={{ width: 140, height: 36, fontSize: 13 }}
      />
      <button
        type="button"
        disabled={!canSubmit}
        onClick={submit}
        className="btn btn-pri btn-sm"
        style={{ whiteSpace: "nowrap" }}
      >
        {pending ? "Saving…" : <>Confirm <Icon name="arrow-r" size={12} /></>}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Cancel"
        className="btn btn-ghost btn-sm"
        style={{ padding: "0 10px" }}
      >
        <Icon name="x" size={12} />
      </button>
      {error && (
        <span style={{ color: "var(--clay)", fontSize: 12, marginLeft: 8 }}>{error}</span>
      )}
    </div>
  );
}
