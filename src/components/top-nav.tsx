import Link from "next/link";
import { getUserAndRole, portalPathForRole } from "@/lib/auth/role-helpers";
import { AuthControls } from "./auth-controls";

const ITEMS = [
  { id: "program", label: "Program", href: "/program" },
  { id: "forum", label: "Forum", href: "/forum" },
  { id: "webinars", label: "Webinars", href: "/webinars" },
  { id: "podcast", label: "Podcast", href: "/podcast" },
  { id: "library", label: "Library", href: "/library" },
  { id: "donate", label: "Donate", href: "/donate" },
] as const;

type Active = (typeof ITEMS)[number]["id"] | "home";

export async function TopNav({ active = "home" }: { active?: Active }) {
  const { userId, email, role } = await getUserAndRole();
  const portalHref = portalPathForRole(role);

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
        <AuthControls
          userId={userId}
          email={email}
          role={role}
          portalHref={portalHref}
        />
      </div>
    </nav>
  );
}
