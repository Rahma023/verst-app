"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/avatar";
import { Icon } from "@/components/icon";
import { useModal } from "@/lib/auth/modal-context";
import { createClient } from "@/lib/supabase/client";

export function AuthControls({ user }: { user: User | null }) {
  const { open } = useModal();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!user) {
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

  const fullName =
    (user.user_metadata?.full_name as string | undefined) ??
    user.email ??
    "Account";
  const firstName = fullName.split(" ")[0];

  async function handleSignOut() {
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <Link
        href="/dashboard"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: "var(--ink)",
        }}
      >
        <Avatar name={fullName} size={32} />
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{firstName}</span>
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
