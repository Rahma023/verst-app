"use client";

import type { ReactNode } from "react";
import { useModal } from "@/lib/auth/modal-context";
import { Icon } from "@/components/icon";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: number;
};

export function ModalShell({ title, subtitle, children, width = 480 }: Props) {
  const { close } = useModal();
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(14, 22, 18, 0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        overflowY: "auto",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "5vh 20px 20px",
      }}
    >
      <div
        style={{
          background: "var(--paper)",
          color: "var(--ink)",
          width: "100%",
          maxWidth: width,
          borderRadius: 14,
          boxShadow: "var(--shadow-modal)",
          border: "1px solid var(--line)",
          padding: "28px 30px 30px",
          position: "relative",
        }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={close}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--line)",
            background: "var(--card)",
            borderRadius: 999,
            cursor: "pointer",
            color: "var(--ink-3)",
          }}
        >
          <Icon name="x" size={14} />
        </button>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-.01em",
            marginBottom: subtitle ? 6 : 18,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginBottom: 22, lineHeight: 1.5 }}>
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
