"use client";

import type { ReactNode } from "react";
import { ModalProvider } from "@/lib/auth/modal-context";
import { ModalRoot } from "./modals/modal-root";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      {children}
      <ModalRoot />
    </ModalProvider>
  );
}
