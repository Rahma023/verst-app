export const FORUM_CATEGORIES = [
  { id: "carbon", label: "Carbon Markets" },
  { id: "method", label: "Methodologies" },
  { id: "mrv", label: "MRV" },
  { id: "biochar", label: "Biochar" },
  { id: "blue", label: "Blue Carbon" },
  { id: "fin", label: "Finance" },
  { id: "policy", label: "Policy & Regulation" },
  { id: "africa", label: "Africa Focus" },
  { id: "general", label: "General" },
] as const;

export type ForumCategory = (typeof FORUM_CATEGORIES)[number]["id"];

export function categoryLabel(id: string | null | undefined): string {
  return FORUM_CATEGORIES.find((c) => c.id === id)?.label ?? "General";
}

export type AuthorRole = "learner" | "tutor" | "admin";

export type ForumAuthor = {
  user_id: string;
  full_name: string | null;
  role: AuthorRole;
};

export type ForumThreadListItem = {
  id: string;
  category: ForumCategory;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  reply_count: number;
  view_count: number;
  status: "open" | "answered" | "closed";
  author: ForumAuthor;
};

export type ForumThreadDetail = ForumThreadListItem & {
  accepted_reply_id: string | null;
};

export type ForumReply = {
  id: string;
  thread_id: string;
  parent_reply_id: string | null;
  body: string;
  created_at: string;
  updated_at: string;
  is_accepted: boolean;
  author: ForumAuthor;
};
