import type { CSSProperties } from "react";
import { Icon, type IconName } from "./icon";

type Props = {
  icon?: IconName;
  code?: string;
  label?: string;
  style?: CSSProperties;
  className?: string;
};

export function GlassThumb({ icon = "leaf", code, label, style, className }: Props) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 8,
        background:
          "linear-gradient(135deg, #008037 0%, #014f24 55%, #003F1B 100%)",
        ...style,
      }}
    >
      <div style={{ position: "absolute", top: "-22%", left: "-12%", width: "68%", height: "68%", borderRadius: "50%", background: "rgba(255,255,255,0.18)", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", bottom: "-28%", right: "-18%", width: "82%", height: "82%", borderRadius: "50%", background: "rgba(88,150,48,0.45)", filter: "blur(3px)" }} />
      <div style={{ position: "absolute", top: "18%", right: "10%", width: "34%", height: "34%", borderRadius: "50%", background: "rgba(255,255,255,0.10)", filter: "blur(1px)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.20) 1px, transparent 1px)", backgroundSize: "20px 20px", opacity: 0.4 }} />

      <div
        style={{
          position: "absolute",
          inset: "12%",
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.28)",
          borderRadius: 14,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          color: "#fff",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        <Icon name={icon} size={56} stroke={1.4} />
        {(code || label) && (
          <div style={{ textAlign: "center", padding: "0 12px" }}>
            {code && (
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 10,
                  letterSpacing: ".22em",
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: label ? 6 : 0,
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
                  color: "rgba(255,255,255,0.92)",
                  lineHeight: 1.25,
                }}
              >
                {label}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
