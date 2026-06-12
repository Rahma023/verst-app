/**
 * HeroGlow — renders the layered glass-arc visual: top horizon glow + bottom
 * bleed + twinkling stars + 3 floating green orbs. Drop inside any
 * dark `<section>` that's `position: relative; overflow: hidden`.
 *
 * No JS state, no client component needed.
 */

type Props = {
  /** Show the top horizon arc. Default true. */
  arc?: boolean;
  /** Show the soft bottom bleed glow. Default true. */
  arcBottom?: boolean;
  /** Show the sparse star field. Default true. */
  stars?: boolean;
  /** How many big floating orbs (0–3). Default 3. */
  orbs?: number;
};

export function HeroGlow({
  arc = true,
  arcBottom = true,
  stars = true,
  orbs = 3,
}: Props) {
  return (
    <>
      {arc && <div className="hero-arc" aria-hidden="true" />}
      {arcBottom && <div className="hero-arc-bottom" aria-hidden="true" />}
      {stars && <div className="hero-stars" aria-hidden="true" />}
      {orbs >= 1 && <div className="hero-orb hero-orb-1" aria-hidden="true" />}
      {orbs >= 2 && <div className="hero-orb hero-orb-2" aria-hidden="true" />}
      {orbs >= 3 && <div className="hero-orb hero-orb-3" aria-hidden="true" />}
    </>
  );
}
