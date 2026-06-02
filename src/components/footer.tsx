import Link from "next/link";
import { Icon, type IconName } from "./icon";

const SOCIALS: { i: IconName; label: string; url: string }[] = [
  { i: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/verst-carbon/posts/?feedView=all" },
  { i: "youtube", label: "YouTube", url: "https://www.youtube.com/@VerstCarbon/playlists" },
  { i: "instagram", label: "Instagram", url: "https://www.instagram.com/verstcarbon/" },
];

const COLS: { heading: string; items: { label: string; href?: string; external?: boolean }[] }[] = [
  {
    heading: "Learn",
    items: [
      { label: "The Program", href: "/program" },
      { label: "Webinars", href: "/webinars" },
      { label: "Podcasts", href: "/podcast" },
      { label: "Resource Library", href: "/library" },
    ],
  },
  {
    heading: "Community",
    items: [
      { label: "Experts Forum", href: "/forum" },
      { label: "Events" },
      { label: "Newsletter" },
    ],
  },
  {
    heading: "Verst Carbon",
    items: [
      { label: "Visit verst.earth", href: "https://www.verst.earth", external: true },
      { label: "About" },
      { label: "Methodology" },
      { label: "Donate", href: "/donate" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { label: "Terms" },
      { label: "Privacy" },
      { label: "Cookies" },
      { label: "Accessibility" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="ft-grid">
        <div>
          <div className="ft-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/verst-academy-logo.svg" alt="Verst Carbon Academy" />
          </div>
          <p style={{ color: "#C9CCC4", fontSize: 14, maxWidth: 340, lineHeight: 1.55 }}>
            A learning ecosystem for climate-tech, carbon markets and the next generation of African project developers.
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 22 }}>
            {SOCIALS.map((s) => (
              <a
                key={s.i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "1px solid #3A4540",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#C9CCC4",
                  textDecoration: "none",
                  transition: "all .15s ease",
                }}
              >
                <Icon name={s.i} size={16} />
              </a>
            ))}
          </div>
        </div>
        {COLS.map((col) => (
          <div key={col.heading}>
            <h6>{col.heading}</h6>
            <ul>
              {col.items.map((it) => (
                <li key={it.label}>
                  {it.href ? (
                    it.external ? (
                      <a href={it.href} target="_blank" rel="noopener noreferrer">
                        {it.label}
                      </a>
                    ) : (
                      <Link href={it.href}>{it.label}</Link>
                    )
                  ) : (
                    <a>{it.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="ft-bot">
        <span>© 2026 · VERST CARBON · ALL RIGHTS RESERVED</span>
        <span>
          Visit our main site at{" "}
          <a
            href="https://www.verst.earth"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--moss)", textDecoration: "none" }}
          >
            www.verst.earth
          </a>
        </span>
      </div>
    </footer>
  );
}
