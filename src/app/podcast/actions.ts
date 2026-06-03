"use server";

import { createClient } from "@/lib/supabase/server";

export type SubscribeResult = { ok: true } | { ok: false; error: string };

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToPodcast(
  email: string,
  fullName?: string,
): Promise<SubscribeResult> {
  const cleanEmail = String(email ?? "").trim().toLowerCase();
  if (!EMAIL_RX.test(cleanEmail)) {
    return { ok: false, error: "Enter a valid email." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("podcast_subscribers").insert({
    user_id: user?.id ?? null,
    email: cleanEmail,
    full_name: fullName?.trim() || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "You're already subscribed." };
    }
    return { ok: false, error: error.message };
  }

  return { ok: true };
}
