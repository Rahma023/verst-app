"use client";

import Link from "next/link";
import { useModal } from "@/lib/auth/modal-context";

type Props = {
  courseId: string;
  signedIn: boolean;
  enrolled?: boolean;
  progress?: number;
  resumeHref?: string;
  size?: "sm" | "lg";
};

export function EnrollButton({
  courseId,
  signedIn,
  enrolled = false,
  progress = 0,
  resumeHref,
  size = "lg",
}: Props) {
  const { open } = useModal();
  const isResume = enrolled || progress > 0;
  const cls = "btn btn-pri" + (size === "lg" ? " btn-lg" : " btn-sm");

  // Resume: real anchor, normal browser nav. No JS click handler to silently swallow.
  if (isResume && resumeHref) {
    return (
      <Link href={resumeHref} className={cls} style={{ textDecoration: "none" }}>
        Resume module →
      </Link>
    );
  }

  // Signed out: open signup
  if (!signedIn) {
    return (
      <button
        type="button"
        className={cls}
        onClick={() => open("signup", { intent: "enrol", courseId })}
      >
        Enroll in module →
      </button>
    );
  }

  // Signed in, not enrolled: open enrol modal
  return (
    <button
      type="button"
      className={cls}
      onClick={() => open("enrol", { courseId })}
    >
      Enroll in module →
    </button>
  );
}
