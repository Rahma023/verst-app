"use client";

import { useState, useTransition } from "react";
import { submitAnswer } from "@/app/tutor/questions/[id]/actions";

export function TutorAnswerForm({ questionId }: { questionId: string }) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await submitAnswer(questionId, text);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone(true);
    });
  }

  if (done) {
    return (
      <div
        style={{
          padding: 16,
          border: "1px solid var(--forest)",
          borderRadius: 10,
          background: "rgba(0,128,55,.06)",
          color: "var(--forest)",
          fontSize: 13.5,
          fontWeight: 600,
        }}
      >
        ✓ Answer sent. The learner will see this in their dashboard.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <textarea
        className="input"
        rows={6}
        placeholder="Write your answer here. Be specific and link to a methodology or source where useful."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
        minLength={5}
      />
      {error && (
        <div
          style={{
            fontSize: 12.5,
            color: "var(--bad)",
            background: "rgba(165,58,30,.08)",
            border: "1px solid rgba(165,58,30,.25)",
            borderRadius: 6,
            padding: "8px 12px",
          }}
        >
          {error}
        </div>
      )}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button
          type="submit"
          disabled={pending}
          className="btn btn-pri"
          style={{ opacity: pending ? 0.6 : 1 }}
        >
          {pending ? "Sending…" : "Send answer →"}
        </button>
      </div>
    </form>
  );
}
