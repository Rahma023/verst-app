"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";

type Msg = { role: "user" | "assistant"; content: string };

type Props = {
  moduleCode?: string;
  moduleTitle?: string;
  lessonCode?: string;
  lessonTitle?: string;
  /** Public guest mode (home-page demo). Free turns capped server-side at 3. */
  guestMode?: boolean;
  /** Override the in-chat suggestion chips. Useful for the guest demo. */
  suggestions?: readonly string[];
  /** Override the empty-state opening line. Useful for the guest demo. */
  emptyStateText?: string;
};

const DEFAULT_SUGGESTIONS = [
  "Quiz me on this lesson",
  "Summarise this lesson in 3 bullet points",
  "Give me a real-world example",
] as const;

export function AskAiChat(props: Props) {
  const suggestions = props.suggestions ?? DEFAULT_SUGGESTIONS;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestLimitHit, setGuestLimitHit] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function sendMessage(text: string) {
    if (busy) return;
    const trimmed = text.trim();
    if (trimmed.length === 0) return;

    const nextHistory: Msg[] = [
      ...messages,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ];
    setMessages(nextHistory);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/tutor-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory.slice(0, -1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          lessonContext: {
            moduleCode: props.moduleCode,
            moduleTitle: props.moduleTitle,
            lessonCode: props.lessonCode,
            lessonTitle: props.lessonTitle,
          },
          guestMode: props.guestMode === true,
        }),
      });

      if (res.status === 402) {
        // Guest reached the free-turn cap — show the sign-up paywall.
        setGuestLimitHit(true);
        setMessages((m) => m.slice(0, -1));
        setBusy(false);
        return;
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        setError(err.error ?? `HTTP ${res.status}`);
        setMessages((m) => m.slice(0, -1)); // drop the empty assistant placeholder
        setBusy(false);
        return;
      }

      if (!res.body) {
        setError("No response body.");
        setMessages((m) => m.slice(0, -1));
        setBusy(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = { role: "assistant", content: assistant };
          return copy;
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  return (
    <section
      style={{
        background: "var(--forest-2)",
        color: "#fff",
        borderRadius: 14,
        padding: 24,
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          paddingBottom: 14,
          borderBottom: "1px solid #2a4a37",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Icon name="sparkle" size={18} stroke={1.6} style={{ color: "var(--moss)" }} />
          <span
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: ".14em",
              fontWeight: 700,
              color: "var(--moss)",
            }}
          >
            ASK AI · VERST TUTOR
          </span>
        </div>
        {props.lessonCode && (
          <span className="mono" style={{ fontSize: 10, color: "#7A857F" }}>
            Module {props.moduleCode} · Lesson {props.lessonCode}
          </span>
        )}
      </div>

      <div
        ref={listRef}
        style={{
          position: "relative",
          maxHeight: 360,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 14,
        }}
      >
        {messages.length === 0 ? (
          <div style={{ fontSize: 13.5, color: "#D9DCD3", lineHeight: 1.55 }}>
            {props.emptyStateText ??
              "Ask anything about this lesson — additionality, scope 3 boundaries, ISO 14064-2 §6.4, Article 6.2 ITMOs, you name it. Cite sources or methodologies for follow-ups."}
          </div>
        ) : (
          messages.map((m, i) => {
            const isUser = m.role === "user";
            return (
              <div
                key={i}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "88%",
                  background: isUser ? "var(--forest)" : "#fff",
                  color: isUser ? "#fff" : "var(--ink)",
                  padding: "10px 14px",
                  borderRadius: isUser
                    ? "14px 14px 2px 14px"
                    : "14px 14px 14px 2px",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content || (
                  <span style={{ opacity: 0.6 }}>Thinking…</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {messages.length === 0 && !busy && !guestLimitHit && (
        <div
          style={{
            position: "relative",
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void sendMessage(s)}
              style={{
                padding: "5px 11px",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 500,
                background: "transparent",
                color: "#aab8a8",
                border: "1px solid #3a5547",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {guestLimitHit && (
        <div
          style={{
            position: "relative",
            padding: "16px 18px",
            background: "rgba(110,181,64,.12)",
            border: "1px solid rgba(110,181,64,.35)",
            borderRadius: 10,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              That&apos;s your 3 free questions for today.
            </div>
            <div style={{ fontSize: 12.5, color: "#D9DCD3", lineHeight: 1.5 }}>
              Sign up free in ~30 seconds to keep chatting — plus get module enrolment,
              certificates and the practitioner forum.
            </div>
          </div>
          <Link
            href="/?signup=1"
            className="btn-glass btn-glass-pri"
            style={{ height: 38, padding: "0 18px", fontSize: 12.5, textDecoration: "none" }}
          >
            Sign up free <Icon name="arrow-r" size={12} />
          </Link>
        </div>
      )}

      {error && (
        <div
          style={{
            position: "relative",
            fontSize: 12.5,
            color: "#FBC9B7",
            background: "rgba(165,58,30,.18)",
            border: "1px solid rgba(165,58,30,.4)",
            borderRadius: 6,
            padding: "8px 12px",
            marginBottom: 10,
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          position: "relative",
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: "rgba(0,0,0,.4)",
          border: "1px solid #2a4a37",
          borderRadius: 99,
          padding: "5px 5px 5px 16px",
        }}
      >
        <Icon name="sparkle" size={14} style={{ color: "var(--moss)" }} />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the tutor anything…"
          disabled={busy}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: 13,
            padding: "8px 0",
            fontFamily: "inherit",
          }}
        />
        <button
          type="submit"
          className="btn btn-accent btn-sm"
          style={{ height: 32, opacity: busy ? 0.6 : 1 }}
          disabled={busy || input.trim().length === 0}
        >
          {busy ? "…" : "Ask"} <Icon name="arrow-r" size={13} />
        </button>
      </form>
    </section>
  );
}
