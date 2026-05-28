"use client";

import { useModal } from "@/lib/auth/modal-context";
import { EnrolModal } from "./enrol-modal";
import { SigninModal } from "./signin-modal";
import { SignupModal } from "./signup-modal";

export function ModalRoot() {
  const { modal } = useModal();
  if (modal === "signin") return <SigninModal />;
  if (modal === "signup") return <SignupModal />;
  if (modal === "enrol") return <EnrolModal />;
  return null;
}
