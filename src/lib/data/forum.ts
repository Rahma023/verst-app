import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  FORUM_CATEGORIES,
  type AuthorRole,
  type ForumAuthor,
  type ForumCategory,
  type ForumReply,
  type ForumThreadDetail,
  type ForumThreadListItem,
} from "./forum-shared";

export {
  FORUM_CATEGORIES,
  categoryLabel,
} from "./forum-shared";
export type {
  AuthorRole,
  ForumAuthor,
  ForumCategory,
  ForumReply,
  ForumThreadDetail,
  ForumThreadListItem,
} from "./forum-shared";

type ThreadRow = {
  id: string;
  user_id: string;
  category: ForumCategory;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  reply_count: number;
  view_count: number;
  status: "open" | "answered" | "closed";
  accepted_reply_id: string | null;
};

type ReplyRow = {
  id: string;
  thread_id: string;
  user_id: string;
  parent_reply_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
  is_accepted: boolean;
};

type ProfileRow = {
  user_id: string;
  full_name: string | null;
  role: AuthorRole;
};

async function fetchAuthors(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ids: string[],
): Promise<Map<string, ForumAuthor>> {
  const unique = Array.from(new Set(ids));
  if (unique.length === 0) return new Map();
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, full_name, role")
    .in("user_id", unique);
  if (error) throw error;
  const map = new Map<string, ForumAuthor>();
  (data ?? []).forEach((p: ProfileRow) => {
    map.set(p.user_id, { user_id: p.user_id, full_name: p.full_name, role: p.role });
  });
  for (const id of unique) {
    if (!map.has(id)) {
      map.set(id, { user_id: id, full_name: null, role: "learner" });
    }
  }
  return map;
}

export async function listThreads(opts?: {
  category?: ForumCategory | null;
  limit?: number;
}): Promise<ForumThreadListItem[]> {
  const supabase = await createClient();
  let q = supabase
    .from("forum_threads")
    .select(
      "id, user_id, category, title, body, created_at, updated_at, reply_count, view_count, status, accepted_reply_id",
    )
    .order("updated_at", { ascending: false })
    .limit(opts?.limit ?? 50);
  if (opts?.category) q = q.eq("category", opts.category);

  const { data, error } = await q;
  if (error) throw error;
  const rows = (data ?? []) as ThreadRow[];
  const authors = await fetchAuthors(supabase, rows.map((r) => r.user_id));
  return rows.map((r) => ({
    id: r.id,
    category: r.category,
    title: r.title,
    body: r.body,
    created_at: r.created_at,
    updated_at: r.updated_at,
    reply_count: r.reply_count,
    view_count: r.view_count,
    status: r.status,
    author: authors.get(r.user_id)!,
  }));
}

export async function getThread(id: string): Promise<ForumThreadDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forum_threads")
    .select(
      "id, user_id, category, title, body, created_at, updated_at, reply_count, view_count, status, accepted_reply_id",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = data as ThreadRow;
  const authors = await fetchAuthors(supabase, [r.user_id]);
  return {
    id: r.id,
    category: r.category,
    title: r.title,
    body: r.body,
    created_at: r.created_at,
    updated_at: r.updated_at,
    reply_count: r.reply_count,
    view_count: r.view_count,
    status: r.status,
    accepted_reply_id: r.accepted_reply_id,
    author: authors.get(r.user_id)!,
  };
}

export async function getReplies(threadId: string): Promise<ForumReply[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forum_replies")
    .select(
      "id, thread_id, user_id, parent_reply_id, body, created_at, updated_at, is_accepted",
    )
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  const rows = (data ?? []) as ReplyRow[];
  const authors = await fetchAuthors(supabase, rows.map((r) => r.user_id));
  return rows.map((r) => ({
    id: r.id,
    thread_id: r.thread_id,
    parent_reply_id: r.parent_reply_id,
    body: r.body,
    created_at: r.created_at,
    updated_at: r.updated_at,
    is_accepted: r.is_accepted,
    author: authors.get(r.user_id)!,
  }));
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forum_threads")
    .select("category");
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const c of FORUM_CATEGORIES) counts[c.id] = 0;
  (data ?? []).forEach((r: { category: string }) => {
    counts[r.category] = (counts[r.category] ?? 0) + 1;
  });
  return counts;
}
