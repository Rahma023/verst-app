"use client";

import { useState, useTransition } from "react";
import { subscribeToPodcast } from "@/app/podcast/actions";
import { Icon } from "@/components/icon";

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function PodcastSubscribe({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [email, setEmail] = useState(defaultEmail);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (done) {
    return (
      <p
        className="mono"
        style={{
          fontSize: 12,
          letterSpacing: ".06em",
          color: "var(--forest)",
          fontWeight: 700,
        }}
      >
        ✓ SUBSCRIBED — NEW EPISODES LAND IN YOUR INBOX EVERY TUESDAY
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!EMAIL_RX.test(email)) {
          setError("Enter a valid email.");
          return;
        }
        setError(null);
        start(async () => {
          const res = await subscribeToPodcast(email);
          if (res.ok) setDone(true);
          else setError(res.error);
        });
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          style={{ flex: 1, height: 38, fontSize: 13 }}
        />
        <button
          type="submit"
          disabled={pending || !EMAIL_RX.test(email)}
          className="btn btn-pri btn-sm"
          style={{ whiteSpace: "nowrap" }}
        >
          {pending ? "Saving…" : <>Subscribe <Icon name="arrow-r" size={12} /></>}
        </button>
      </div>
      {error && (
        <p style={{ marginTop: 8, color: "var(--clay)", fontSize: 12 }}>{error}</p>
      )}
    </form>
  );
}
