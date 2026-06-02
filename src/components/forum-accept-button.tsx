"use client";

import { useTransition } from "react";
import { acceptReply } from "@/app/forum/actions";

export function ForumAcceptButton({
  threadId,
  replyId,
  alreadyAccepted,
}: {
  threadId: string;
  replyId: string;
  alreadyAccepted: boolean;
}) {
  const [pending, start] = useTransition();

  if (alreadyAccepted) {
    return (
      <span
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: ".12em",
          color: "var(--forest)",
          fontWeight: 700,
        }}
      >
        ✓ ACCEPTED
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => void acceptReply(threadId, replyId))}
      className="btn btn-sm"
      style={{
        border: "1px solid var(--forest)",
        color: "var(--forest)",
        background: "transparent",
        fontSize: 11,
      }}
    >
      {pending ? "Accepting…" : "Mark as accepted"}
    </button>
  );
}
