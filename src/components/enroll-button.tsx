"use client";

import { useModal } from "@/lib/auth/modal-context";

type Props = {
  courseId: string;
  signedIn: boolean;
  enrolled?: boolean;
  progress?: number;
  size?: "sm" | "lg";
};

export function EnrollButton({
  courseId,
  signedIn,
  enrolled = false,
  progress = 0,
  size = "lg",
}: Props) {
  const { open } = useModal();
  const isResume = enrolled || progress > 0;
  const text = isResume ? "Resume module" : "Enroll in module";
  const cls = "btn btn-pri" + (size === "lg" ? " btn-lg" : " btn-sm");

  function handleClick() {
    if (!signedIn) {
      open("signup", { intent: "enrol", courseId });
      return;
    }
    if (isResume) {
      // TODO: link to lesson player when built
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
