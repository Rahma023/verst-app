type Props = {
  name?: string;
  size?: number;
  color?: string;
  bg?: string;
};

const PALETTE = ["#008037", "#0E1612", "#2A5742", "#583520", "#3D2A48", "#23445A", "#589630"];

export function Avatar({ name, size = 32, color, bg }: Props) {
  const initials = name
    ? name.split(/\s+/).slice(0, 2).map((s) => s[0]).join("").toUpperCase()
    : "◯";
  const seed = (name ?? "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const bgc = bg ?? PALETTE[seed % PALETTE.length];
  const fg = color ?? "#589630";
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: bgc,
        color: fg,
        fontSize: Math.max(9, size * 0.36),
      }}
    >
      {initials}
    </div>
  );
}
