"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useModal } from "@/lib/auth/modal-context";
import { createClient } from "@/lib/supabase/client";
import { ModalShell } from "./modal-shell";

export function AskTutorModal() {
  const { payload, close } = useModal();
  const router = useRouter();
  const moduleId = (payload?.moduleId as string) ?? "";
  const lessonId = (payload?.lessonId as string | undefined) ?? null;
  const moduleTitle = (payload?.moduleTitle as string | undefined) ?? "the module";
  const lessonTitle = (payload?.lessonTitle as string | undefined) ?? null;

  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed.length < 8) {
      setError("Add a little more detail (at least 8 characters).");
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
    const { error: insErr } = await supabase.from("learner_questions").insert({
      learner_user_id: user.id,
      module_id: moduleId,
      lesson_id: lessonId,
      question_text: trimmed,
    });
    setBusy(false);
    if (insErr) {
      setError(`Couldn't post your question: ${insErr.message}`);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      close();
      router.refresh();
    }, 1500);
  }

  if (success) {
    return (
      <ModalShell title="Question sent" width={420}>
        <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 14 }}>
          Your tutor will reply soon. You'll see the answer in your dashboard once it's posted.
        </p>
        <div
          style={{
            padding: "10px 14px",
            background: "rgba(0,128,55,.08)",
            border: "1px solid var(--forest)",
            borderRadius: 6,
            color: "var(--forest)",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ✓ Saved to your tutor's inbox
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell
      title="Ask a tutor"
      subtitle={
        lessonTitle
          ? `About “${lessonTitle}” — be specific so the tutor can answer well.`
          : `About “${moduleTitle}”.`
      }
      width={480}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span className="label">Your question</span>
          <textarea
            className="input"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Why does additionality matter for an avoidance project but not for a removal project?"
            required
            minLength={8}
          />
        </label>
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
        <button
          type="submit"
          disabled={busy}
          className="btn btn-pri btn-lg"
          style={{ justifyContent: "center", width: "100%", opacity: busy ? 0.6 : 1 }}
        >
          {busy ? "Sending…" : "Ask the tutor →"}
        </button>
      </form>
    </ModalShell>
  );
}
