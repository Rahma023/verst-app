"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { useModal } from "@/lib/auth/modal-context";
import { createClient } from "@/lib/supabase/client";

type Props = {
  userId: string | null;
  email: string | null;
  role: "learner" | "tutor" | "admin";
  portalHref: string;
};

export function AuthControls({ userId, email, role, portalHref }: Props) {
  const { open } = useModal();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [displayName, setDisplayName] = useState<string>(email ?? "Account");

  // The TopNav server component knows the role/email but doesn't have access
  // to the metadata (full_name lives on user_metadata or profile). Fetch a
  // friendlier display name client-side once we know we're signed in.
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      const meta = (user?.user_metadata?.full_name as string | undefined) ?? null;
      if (meta) {
        setDisplayName(meta);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", userId)
        .maybeSingle<{ full_name: string | null }>();
      if (!cancelled && profile?.full_name) setDisplayName(profile.full_name);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!userId) {
    return (
      <>
        <button
          type="button"
          onClick={() => open("signin")}
          className="btn btn-ghost btn-sm"
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => open("signup")}
          className="btn btn-pri btn-sm"
        >
          Get started <Icon name="arrow-r" size={14} />
        </button>
      </>
    );
  }

  const firstName = displayName.split(" ")[0];
  const portalLabel =
    role === "admin" ? "Studio" : role === "tutor" ? "Portal" : "Dashboard";

  async function handleSignOut() {
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <Link
        href={portalHref}
        title={`Open ${portalLabel}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: "var(--ink)",
        }}
      >
        <Avatar name={displayName} size={32} />
        <span
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "flex-start",
            lineHeight: 1.1,
          }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>{firstName}</span>
          {role !== "learner" && (
            <span
              className="mono"
              style={{
                fontSize: 9,
                color: "var(--moss)",
                letterSpacing: ".14em",
                fontWeight: 700,
              }}
            >
              {role.toUpperCase()}
            </span>
          )}
        </span>
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={busy}
        className="btn btn-ghost btn-sm"
      >
        {busy ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}
