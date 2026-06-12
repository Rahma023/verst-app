/**
 * AmbientBackdrop — drop into any dark `<section style={{ position: 'relative',
 * overflow: 'hidden' }}>` to get the POA-inspired layered glow + dot grid +
 * drifting particles + corner vignette. Adapted to the Verst forest/moss
 * palette. Visual sugar only — no JS state, no client component needed.
 */

type Props = {
  /** Number of drifting "particle" dots. Default 6. Set to 0 to disable. */
  particles?: number;
  /** Show the corner vignette (darkens corners to focus content). Default true. */
  vignette?: boolean;
};

const PARTICLE_POSITIONS = [
  { top: "12%", left: "8%",  delay: "0s" },
  { top: "78%", left: "16%", delay: "3s" },
  { top: "22%", left: "84%", delay: "6s" },
  { top: "62%", left: "78%", delay: "9s" },
  { top: "44%", left: "42%", delay: "2s" },
  { top: "88%", left: "58%", delay: "5s" },
  { top: "32%", left: "62%", delay: "11s" },
  { top: "72%", left: "32%", delay: "7s" },
];

export function AmbientBackdrop({ particles = 6, vignette = true }: Props) {
  const dots = PARTICLE_POSITIONS.slice(0, Math.min(particles, PARTICLE_POSITIONS.length));
  return (
    <>
      <div className="ambient-backdrop" aria-hidden="true">
        {dots.map((d, i) => (
          <span
            key={i}
            className="ambient-drift-particle"
            style={{
              top: d.top,
              left: d.left,
              animationDelay: d.delay,
            }}
          />
        ))}
      </div>
      {vignette && <div className="ambient-vignette" aria-hidden="true" />}
    </>
  );
}
