import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  type PodcastEpisode,
  type PodcastSeries,
} from "./podcast-shared";

export {
  PODCAST_SERIES,
  formatDuration,
  formatChapterTime,
} from "./podcast-shared";
export type {
  PodcastChapter,
  PodcastLine,
  PodcastEpisode,
  PodcastSeries,
} from "./podcast-shared";

export async function listEpisodes(opts?: {
  series?: PodcastSeries | null;
}): Promise<PodcastEpisode[]> {
  const supabase = await createClient();
  let q = supabase
    .from("podcast_episodes")
    .select(
      "id, episode_number, series, title, description, host_name, guest_name, guest_role, guest_org, guest_quote, audio_url, duration_seconds, chapters, transcript, cover_url, published_at, view_count",
    )
    .eq("is_published", true)
    .order("episode_number", { ascending: false });
  if (opts?.series && opts.series !== "All") q = q.eq("series", opts.series);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as PodcastEpisode[];
}

export async function getEpisode(id: string): Promise<PodcastEpisode | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("podcast_episodes")
    .select(
      "id, episode_number, series, title, description, host_name, guest_name, guest_role, guest_org, guest_quote, audio_url, duration_seconds, chapters, transcript, cover_url, published_at, view_count",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as PodcastEpisode | null;
}
