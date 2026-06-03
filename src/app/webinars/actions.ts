"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type RegisterResult = { ok: true } | { ok: false; error: string };

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerForWebinar(
  webinarId: string,
  email: string,
  fullName?: string,
): Promise<RegisterResult> {
  const cleanEmail = String(email ?? "").trim().toLowerCase();
  if (!EMAIL_RX.test(cleanEmail)) {
    return { ok: false, error: "Enter a valid email." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("webinar_registrations").insert({
    webinar_id: webinarId,
    user_id: user?.id ?? null,
    email: cleanEmail,
    full_name: fullName?.trim() || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "You're already registered." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/webinars");
  return { ok: true };
}
