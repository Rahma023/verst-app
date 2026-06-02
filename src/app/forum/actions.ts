"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FORUM_CATEGORIES } from "@/lib/data/forum";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function getUserOrReject(): Promise<
  | { ok: true; userId: string }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in to post." };
  return { ok: true, userId: user.id };
}

const VALID_CATS = new Set(FORUM_CATEGORIES.map((c) => c.id));

export async function createThread(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getUserOrReject();
  if (!auth.ok) return auth;

  const category = String(formData.get("category") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!VALID_CATS.has(category as never)) {
    return { ok: false, error: "Pick a category." };
  }
  if (title.length < 8 || title.length > 240) {
    return { ok: false, error: "Title must be 8–240 characters." };
  }
  if (body.length < 20) {
    return { ok: false, error: "Body must be at least 20 characters." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forum_threads")
    .insert({
      user_id: auth.userId,
      category,
      title,
      body,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };

  revalidatePath("/forum");
  redirect(`/forum/${data.id}`);
}

export async function postReply(
  threadId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await getUserOrReject();
  if (!auth.ok) return auth;

  const body = String(formData.get("body") ?? "").trim();
  if (body.length < 5) {
    return { ok: false, error: "Reply must be at least 5 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("forum_replies").insert({
    thread_id: threadId,
    user_id: auth.userId,
    body,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/forum/${threadId}`);
  revalidatePath("/forum");
  return { ok: true };
}

export async function acceptReply(
  threadId: string,
  replyId: string,
): Promise<ActionResult> {
  const auth = await getUserOrReject();
  if (!auth.ok) return auth;

  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_forum_reply", { p_reply_id: replyId });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/forum/${threadId}`);
  revalidatePath("/forum");
  return { ok: true };
}

export async function deleteThread(threadId: string): Promise<ActionResult> {
  const auth = await getUserOrReject();
  if (!auth.ok) return auth;

  const supabase = await createClient();
  const { error } = await supabase.from("forum_threads").delete().eq("id", threadId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/forum");
  redirect("/forum");
}
