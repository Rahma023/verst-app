import "server-only";

import { createClient } from "@/lib/supabase/server";

export const LIBRARY_CATEGORIES = [
  "All",
  "Methodology",
  "Dataset",
  "Template",
  "Brief",
  "Reference",
] as const;

export type LibraryCategory = (typeof LIBRARY_CATEGORIES)[number];

export type LibraryResource = {
  id: string;
  title: string;
  description: string | null;
  category: Exclude<LibraryCategory, "All">;
  topic: string | null;
  file_type: "PDF" | "XLSX" | "DOCX" | "ZIP" | "LINK";
  file_size_bytes: number | null;
  file_path: string | null;
  external_url: string | null;
  published_at: string;
  download_count: number;
};

export async function listLibraryResources(opts?: {
  category?: LibraryCategory | null;
}): Promise<LibraryResource[]> {
  const supabase = await createClient();
  let q = supabase
    .from("library_resources")
    .select(
      "id, title, description, category, topic, file_type, file_size_bytes, file_path, external_url, published_at, download_count",
    )
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (opts?.category && opts.category !== "All") {
    q = q.eq("category", opts.category);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as LibraryResource[];
}

export async function getLibraryCategoryCounts(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("library_resources")
    .select("category")
    .eq("is_published", true);
  if (error) throw error;
  const counts: Record<string, number> = {
    Methodology: 0,
    Dataset: 0,
    Template: 0,
    Brief: 0,
    Reference: 0,
  };
  (data ?? []).forEach((r: { category: string }) => {
    counts[r.category] = (counts[r.category] ?? 0) + 1;
  });
  return counts;
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
