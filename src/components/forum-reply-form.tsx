"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Icon } from "@/components/icon";
import { postReply, type ActionResult } from "@/app/forum/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn btn-pri btn-sm"
      disabled={pending}
      style={{ minWidth: 120 }}
    >
      {pending ? "Posting…" : "Post reply"}
    </button>
  );
}

export function ForumReplyForm({
  threadId,
  signedIn,
}: {
  threadId: string;
  signedIn: boolean;
}) {
  const bound = postReply.bind(null, threadId);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction] = useActionState<ActionResult | null, FormData>(
    async (prev, data) => {
      const result = await bound(prev, data);
      if (result.ok) formRef.current?.reset();
      return result;
    },
    null,
  );

  if (!signedIn) {
    return (
      <div
        style={{
          marginTop: 32,
          padding: 24,
          border: "1px dashed var(--line)",
          borderRadius: 8,
          textAlign: "center",
          color: "var(--ink-2)",
          fontSize: 14,
        }}
      >
        Sign in to join the discussion.
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      style={{
        marginTop: 32,
        padding: 20,
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: 8,
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: ".14em",
          fontWeight: 700,
          color: "var(--ink-3)",
          marginBottom: 10,
        }}
      >
        YOUR REPLY
      </div>
      <textarea
        name="body"
        required
        minLength={5}
        placeholder="Add to the discussion…"
        className="input"
        style={{ minHeight: 100, fontSize: 14, width: "100%", resize: "vertical" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Icon name="shield" size={14} style={{ color: "var(--forest)" }} />
          <span
            className="mono"
            style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: ".08em" }}
          >
            REVIEWED WITHIN 24H
          </span>
        </div>
        <SubmitButton />
      </div>
      {state && !state.ok && (
        <p style={{ marginTop: 10, color: "var(--clay)", fontSize: 13 }}>
          {state.error}
        </p>
      )}
      {state && state.ok && (
        <p style={{ marginTop: 10, color: "var(--forest)", fontSize: 13 }}>
          ✓ Reply posted.
        </p>
      )}
    </form>
  );
}
