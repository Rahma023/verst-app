export type PodcastChapter = { at_seconds: number; label: string };
export type PodcastLine = { at: string; speaker: string; text: string };

export type PodcastEpisode = {
  id: string;
  episode_number: number;
  series: string | null;
  title: string;
  description: string | null;
  host_name: string;
  guest_name: string;
  guest_role: string | null;
  guest_org: string | null;
  guest_quote: string | null;
  audio_url: string | null;
  duration_seconds: number;
  chapters: PodcastChapter[];
  transcript: PodcastLine[];
  cover_url: string | null;
  published_at: string;
  view_count: number;
};

export const PODCAST_SERIES = [
  "All",
  "African Innovators",
  "Methodology Deep-Dive",
  "Policy Watch",
  "Finance & Capital",
] as const;

export type PodcastSeries = (typeof PODCAST_SERIES)[number];

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatChapterTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
