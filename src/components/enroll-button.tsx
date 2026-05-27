"use client";

import { useModal } from "@/lib/auth/modal-context";

type Props = {
  courseId: string;
  signedIn: boolean;
  progress?: number;
  label?: string;
  size?: "sm" | "lg";
};

export function EnrollButton({ courseId, signedIn, progress = 0, label, size = "lg" }: Props) {
  const { open } = useModal();
  const text = label ?? (progress > 0 ? "Resume module" : "Enroll in module");
  const cls = "btn btn-pri" + (size === "lg" ? " btn-lg" : " btn-sm");

  function handleClick() {
    if (!signedIn) {
      open("signup", { intent: "enrol", courseId });
      return;
    }
    open("enrol", { courseId });
  }

  return (
    <button type="button" className={cls} onClick={handleClick}>
      {text} →
    </button>
  );
}
