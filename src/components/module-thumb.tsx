"use client";

import { useState, type CSSProperties } from "react";
import { GlassThumb } from "@/components/glass-thumb";
import type { IconName } from "@/components/icon";
import { MODULE_IMAGES } from "@/data/module-images";

type Props = {
  moduleId: string;
  icon: IconName;
  code: string;
  label?: string;
  style?: CSSProperties;
  className?: string;
};

export function ModuleThumb({
  moduleId,
  icon,
  code,
  label,
  style,
  className,
}: Props) {
  const imageUrl = MODULE_IMAGES[moduleId];
  const [errored, setErrored] = useState(false);

  // Fallback to the abstract glass thumbnail if no URL configured or image failed to load.
  if (!imageUrl || errored) {
    return (
      <GlassThumb
        icon={icon}
        code={code}
        label={label}
        style={style}
        className={className}
      />
    );
  }

  return (
    <div
      className={(className ? className + " " : "") + "thumb-moss-glow"}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 12,
        background: "var(--forest-2)",
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={label ?? `Module ${code} cover`}
        onError={() => setErrored(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      {/* Dark gradient overlay for legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,40,18,.05) 0%, rgba(0,40,18,.35) 55%, rgba(0,40,18,.85) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Glass label panel — only when we have a code or label to show */}
      {(code || label) && (
        <div
          style={{
            position: "absolute",
            inset: "auto 18px 18px 18px",
            background: "rgba(0,40,18,.55)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,.18)",
            borderRadius: 10,
            padding: "10px 14px",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {code && (
            <div
              style={{
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: ".22em",
                color: "rgba(255,255,255,.7)",
              }}
            >
              MODULE · {code}
            </div>
          )}
          {label && (
            <div
              style={{
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "-.005em",
                color: "rgba(255,255,255,.95)",
                lineHeight: 1.25,
              }}
            >
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
