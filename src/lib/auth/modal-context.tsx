"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type ModalKind = "signin" | "signup" | "donate" | "enrol" | "ask-tutor" | null;

type ModalContextValue = {
  modal: ModalKind;
  payload: Record<string, unknown> | null;
  open: (kind: NonNullable<ModalKind>, payload?: Record<string, unknown>) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalKind>(null);
  const [payload, setPayload] = useState<Record<string, unknown> | null>(null);

  const open = useCallback((kind: NonNullable<ModalKind>, p?: Record<string, unknown>) => {
    setModal(kind);
    setPayload(p ?? null);
  }, []);

  const close = useCallback(() => {
    setModal(null);
    setPayload(null);
  }, []);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modal, close]);

  return (
    <ModalContext.Provider value={{ modal, payload, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside <ModalProvider>");
  return ctx;
}
