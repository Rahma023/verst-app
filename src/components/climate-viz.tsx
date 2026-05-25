import type { CSSProperties, ReactElement } from "react";

export type ClimateVizVariant =
  | "orbit"
  | "leaf"
  | "grid"
  | "wave"
  | "map"
  | "stack"
  | "map2";

type Props = {
  variant?: ClimateVizVariant;
  className?: string;
  style?: CSSProperties;
};

const svgFill: CSSProperties = { width: "100%", height: "100%", display: "block" };

const orbit = (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={svgFill}>
    <defs>
      <pattern id="dotsg" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="#589630" opacity=".25" />
      </pattern>
    </defs>
    <rect width="400" height="300" fill="#008037" />
    <rect width="400" height="300" fill="url(#dotsg)" />
    <circle cx="200" cy="150" r="120" fill="none" stroke="#589630" strokeOpacity=".35" strokeDasharray="2 6" />
    <circle cx="200" cy="150" r="80" fill="none" stroke="#589630" strokeOpacity=".5" />
    <circle cx="200" cy="150" r="40" fill="#589630" fillOpacity=".12" stroke="#589630" />
    <circle cx="200" cy="150" r="6" fill="#589630" />
    <circle cx="320" cy="150" r="4" fill="#589630" />
    <circle cx="80" cy="150" r="4" fill="#589630" />
    <circle cx="240" cy="80" r="3" fill="#589630" opacity=".7" />
    <circle cx="150" cy="220" r="3" fill="#589630" opacity=".7" />
    <path d="M120 250 Q200 200 280 250" stroke="#589630" strokeOpacity=".4" fill="none" />
  </svg>
);

const leaf = (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={svgFill}>
    <rect width="400" height="300" fill="#F1ECDF" />
    <g transform="translate(200,150)">
      <path d="M-120 0 C-120 -80 -40 -120 0 -120 C40 -120 120 -80 120 0 C120 80 40 120 0 120 C-40 120 -120 80 -120 0z" fill="#008037" />
      <path d="M-90 0 C-90 -60 -30 -90 0 -90 C30 -90 90 -60 90 0 C90 60 30 90 0 90 C-30 90 -90 60 -90 0z" fill="none" stroke="#589630" strokeOpacity=".4" />
      <path d="M0 -120 L0 120 M-100 -50 Q0 0 100 -50 M-100 50 Q0 0 100 50" stroke="#589630" strokeOpacity=".5" fill="none" />
    </g>
  </svg>
);

const grid = (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={svgFill}>
    <rect width="400" height="300" fill="#0E1612" />
    <g stroke="#589630" strokeOpacity=".3" fill="none">
      {Array.from({ length: 15 }).map((_, i) => (
        <line key={i} x1={i * 30} y1="0" x2={i * 30 - 60} y2="300" />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={"h" + i} x1="0" y1={i * 40} x2="400" y2={i * 40 + 20} />
      ))}
    </g>
    <circle cx="200" cy="150" r="50" fill="#589630" />
    <circle cx="200" cy="150" r="48" fill="#0E1612" />
    <text x="200" y="160" textAnchor="middle" fill="#589630" fontSize="22" fontFamily="Raleway" fontWeight="800" fontStyle="italic">
      +1.5°
    </text>
  </svg>
);

const wave = (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={svgFill}>
    <rect width="400" height="300" fill="#008037" />
    <g stroke="#589630" fill="none" strokeOpacity=".6">
      {Array.from({ length: 20 }).map((_, i) => (
        <path key={i} d={`M0 ${50 + i * 12} Q100 ${30 + i * 12} 200 ${50 + i * 12} T400 ${50 + i * 12}`} />
      ))}
    </g>
  </svg>
);

const map = (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={svgFill}>
    <rect width="400" height="300" fill="#F1ECDF" />
    <path d="M180 60 C 130 60 120 100 130 140 C 110 170 130 200 150 220 C 160 250 200 280 230 270 C 260 250 280 220 280 180 C 290 140 270 100 240 80 C 220 65 200 60 180 60z" fill="#008037" />
    <g stroke="#589630" strokeWidth="0.8" fill="none" opacity=".5">
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1="120" y1={70 + i * 30} x2="290" y2={70 + i * 30} />
      ))}
    </g>
    <circle cx="200" cy="160" r="6" fill="#589630" stroke="#008037" strokeWidth="2" />
    <circle cx="240" cy="200" r="5" fill="#589630" stroke="#008037" strokeWidth="2" />
    <circle cx="180" cy="120" r="4" fill="#589630" stroke="#008037" strokeWidth="2" />
  </svg>
);

const stack = (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={svgFill}>
    <rect width="400" height="300" fill="#F6F2E5" />
    <g>
      <rect x="80" y="60" width="240" height="40" fill="#008037" />
      <rect x="80" y="110" width="240" height="40" fill="#003F1B" />
      <rect x="80" y="160" width="240" height="40" fill="#589630" />
      <rect x="80" y="210" width="240" height="40" fill="#589630" />
      <text x="200" y="86" textAnchor="middle" fill="#589630" fontFamily="Raleway" fontWeight="700" fontSize="11" letterSpacing="2">METHODOLOGY</text>
      <text x="200" y="136" textAnchor="middle" fill="#589630" fontFamily="Raleway" fontWeight="700" fontSize="11" letterSpacing="2">MEASUREMENT</text>
      <text x="200" y="186" textAnchor="middle" fill="#589630" fontFamily="Raleway" fontWeight="700" fontSize="11" letterSpacing="2">VERIFICATION</text>
      <text x="200" y="236" textAnchor="middle" fill="#0E1612" fontFamily="Raleway" fontWeight="700" fontSize="11" letterSpacing="2">CREDITS</text>
    </g>
  </svg>
);

const map2 = (
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style={svgFill}>
    <rect width="400" height="300" fill="#0E1612" />
    {Array.from({ length: 12 }).map((_, i) => (
      <circle key={i} cx={50 + i * 30} cy={150 + Math.sin(i * 0.6) * 60} r={3 + (i % 4)} fill="#589630" opacity={0.4 + (i % 4) * 0.15} />
    ))}
    <path d="M30 200 Q200 100 380 200" stroke="#589630" strokeOpacity=".4" fill="none" strokeWidth="1" />
    <path d="M30 220 Q200 140 380 220" stroke="#589630" strokeOpacity=".3" fill="none" strokeWidth="1" />
  </svg>
);

const VARIANTS: Record<ClimateVizVariant, ReactElement> = {
  orbit,
  leaf,
  grid,
  wave,
  map,
  stack,
  map2,
};

export function ClimateViz({ variant = "orbit", className = "", style }: Props) {
  return (
    <div className={className} style={{ overflow: "hidden", borderRadius: 8, ...style }}>
      {VARIANTS[variant]}
    </div>
  );
}
