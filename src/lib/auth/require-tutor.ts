import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireTutor() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("user_id", user.id)
    .maybeSingle<{ role: string; full_name: string | null }>();

  if (profile?.role !== "tutor" && profile?.role !== "admin") redirect("/");

  return { user, profile, supabase };
}

export async function requireTutorForModule(moduleId: string) {
  const ctx = await requireTutor();
  // Admins pass-through.
  if (ctx.profile?.role === "admin") return ctx;
  const { data: assignment } = await ctx.supabase
    .from("tutor_assignments")
    .select("module_id")
    .eq("tutor_user_id", ctx.user.id)
    .eq("module_id", moduleId)
    .maybeSingle();
  if (!assignment) redirect("/tutor");
  return ctx;
}
