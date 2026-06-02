import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AppRole = "learner" | "tutor" | "admin";

export async function getUserAndRole(): Promise<{
  userId: string | null;
  email: string | null;
  role: AppRole;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { userId: null, email: null, role: "learner" };
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle<{ role: AppRole }>();
  return {
    userId: user.id,
    email: user.email ?? null,
    role: profile?.role ?? "learner",
  };
}

export function portalPathForRole(role: AppRole): string {
  if (role === "admin") return "/admin";
  if (role === "tutor") return "/tutor";
  return "/dashboard";
}
