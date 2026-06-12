/**
 * AmbientBackdrop — drop into any dark `<section style={{ position: 'relative',
 * overflow: 'hidden' }}>` to get the POA-inspired ambient motion layer:
 *   - 4-corner glow pools with a slow hue-shift
 *   - "breathing" radial that gently pulses in scale + opacity
 *   - orbiting blurred glow blob that drifts in a slow loop
 *   - 6-12 moss particles drifting diagonally with a glow trail
 *   - subtle dot grid texture
 *   - optional centre-transparent vignette
 *
 * Adapted to the Verst forest/moss palette. Visual sugar only — no JS state.
 */

type Props = {
  /** Number of drifting "particle" dots. Default 8. Set to 0 to disable. */
  particles?: number;
  /** Show the corner vignette (darkens corners to focus content). Default true. */
  vignette?: boolean;
  /** Show the slow breathing radial. Default true. */
  breathe?: boolean;
  /** Show the orbiting blurred blob. Default true. */
  orbit?: boolean;
};

const PARTICLE_POSITIONS = [
  { top: "10%", left: "6%",  delay: "0s"  },
  { top: "82%", left: "14%", delay: "1.5s" },
  { top: "20%", left: "86%", delay: "3s"  },
  { top: "64%", left: "78%", delay: "4.5s" },
  { top: "42%", left: "42%", delay: "1s"  },
  { top: "88%", left: "58%", delay: "2.5s" },
  { top: "30%", left: "62%", delay: "5s"  },
  { top: "72%", left: "32%", delay: "3.5s" },
  { top: "12%", left: "48%", delay: "6s"  },
  { top: "56%", left: "10%", delay: "2s"  },
  { top: "94%", left: "92%", delay: "4s"  },
  { top: "8%",  left: "76%", delay: "5.5s" },
];

export function AmbientBackdrop({
  particles = 8,
  vignette = true,
  breathe = true,
  orbit = true,
}: Props) {
  const dots = PARTICLE_POSITIONS.slice(0, Math.min(particles, PARTICLE_POSITIONS.length));
  return (
    <>
      <div className="ambient-backdrop" aria-hidden="true">
        {breathe && <div className="ambient-breath" />}
        {orbit && <div className="ambient-orbit" style={{ top: "20%", left: "55%" }} />}
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
