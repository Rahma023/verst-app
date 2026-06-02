"use client";

import { Icon } from "@/components/icon";
import { useModal } from "@/lib/auth/modal-context";

type Props = {
  moduleId: string;
  moduleTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  variant?: "primary" | "ghost" | "compact";
};

export function AskTutorButton({
  moduleId,
  moduleTitle,
  lessonId,
  lessonTitle,
  variant = "ghost",
}: Props) {
  const { open } = useModal();

  function handleClick() {
    open("ask-tutor", { moduleId, moduleTitle, lessonId, lessonTitle });
  }

  const cls =
    variant === "primary"
      ? "btn btn-pri btn-sm"
      : variant === "compact"
        ? "btn btn-ghost btn-sm"
        : "btn btn-ghost";

  return (
    <button type="button" className={cls} onClick={handleClick}>
      <Icon name="msg" size={12} /> Ask a tutor
    </button>
  );
}
