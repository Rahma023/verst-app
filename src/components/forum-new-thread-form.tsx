"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createThread, type ActionResult } from "@/app/forum/actions";
import { FORUM_CATEGORIES } from "@/lib/data/forum-shared";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn btn-pri btn-lg" disabled={pending}>
      {pending ? "Posting…" : "Post thread"}
    </button>
  );
}

export function ForumNewThreadForm() {
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    async (prev, data) => createThread(prev, data),
    null,
  );

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <label
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: ".14em",
            fontWeight: 700,
            color: "var(--ink-3)",
            display: "block",
            marginBottom: 8,
          }}
        >
          CATEGORY
        </label>
        <select
          name="category"
          required
          defaultValue="general"
          className="input"
          style={{ width: "100%", fontSize: 14, height: 44 }}
        >
          {FORUM_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: ".14em",
            fontWeight: 700,
            color: "var(--ink-3)",
            display: "block",
            marginBottom: 8,
          }}
        >
          TITLE
        </label>
        <input
          name="title"
          required
          minLength={8}
          maxLength={240}
          placeholder="e.g. What makes a biochar credit additional under VM0044?"
          className="input"
          style={{ width: "100%", fontSize: 16, height: 48 }}
        />
        <div
          className="mono"
          style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 6, letterSpacing: ".06em" }}
        >
          8–240 CHARACTERS. BE SPECIFIC — VAGUE TITLES GET FEWER GOOD ANSWERS.
        </div>
      </div>

      <div>
        <label
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: ".14em",
            fontWeight: 700,
            color: "var(--ink-3)",
            display: "block",
            marginBottom: 8,
          }}
        >
          BODY
        </label>
        <textarea
          name="body"
          required
          minLength={20}
          placeholder="Describe the context, what you've tried, and what specifically you're stuck on. Add links to methodology sections if relevant."
          className="input"
          style={{ width: "100%", minHeight: 200, fontSize: 14, resize: "vertical" }}
        />
        <div
          className="mono"
          style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 6, letterSpacing: ".06em" }}
        >
          MIN 20 CHARACTERS. POSTS ARE REVIEWED BY VERST TUTORS WITHIN 24H.
        </div>
      </div>

      {state && !state.ok && (
        <p style={{ color: "var(--clay)", fontSize: 13 }}>{state.error}</p>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <SubmitButton />
        <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
          Your name and role will show next to the post.
        </span>
      </div>
    </form>
  );
}
