import Link from "next/link";
import { Icon } from "./icon";

const ITEMS = [
  { id: "program", label: "Program", href: "/program" },
  { id: "forum", label: "Forum", href: "/forum" },
  { id: "webinars", label: "Webinars", href: "/webinars" },
  { id: "podcast", label: "Podcast", href: "/podcast" },
  { id: "library", label: "Library", href: "/library" },
  { id: "donate", label: "Donate", href: "/donate" },
] as const;

type Active = (typeof ITEMS)[number]["id"] | "home";

export function TopNav({ active = "home" }: { active?: Active }) {
  return (
    <nav className="topnav">
      <Link href="/" className="brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/verst-academy-logo.svg" alt="Verst Carbon Academy" />
      </Link>
      <div className="links">
        {ITEMS.map((it) => (
          <Link key={it.id} href={it.href} className={active === it.id ? "on" : ""}>
            {it.label}
          </Link>
        ))}
      </div>
      <div className="right">
        <button type="button" className="btn btn-ghost btn-sm">
          Sign in
        </button>
        <button type="button" className="btn btn-pri btn-sm">
          Get started <Icon name="arrow-r" size={14} />
        </button>
      </div>
    </nav>
  );
}
