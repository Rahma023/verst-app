import "server-only";

import { createClient } from "@/lib/supabase/server";

export type WebinarStatus = "upcoming" | "live" | "replay" | "cancelled";
export type WebinarTopic = "Carbon" | "Finance" | "Policy" | "MRV" | "Africa" | "General";
export type WebinarVisual = "orbit" | "wave" | "stack" | "leaf" | "map" | "grid";

export const WEBINAR_TOPICS: WebinarTopic[] = [
  "Carbon",
  "Finance",
  "Policy",
  "MRV",
  "Africa",
  "General",
];

export type Webinar = {
  id: string;
  title: string;
  description: string | null;
  topic: WebinarTopic;
  speaker_name: string;
  speaker_role: string | null;
  speaker_org: string | null;
  starts_at: string;
  duration_minutes: number;
  status: WebinarStatus;
  video_url: string | null;
  registration_url: string | null;
  attendees_count: number;
  visual_variant: WebinarVisual;
};

export async function listWebinars(opts?: {
  status?: WebinarStatus | null;
  topic?: WebinarTopic | null;
}): Promise<Webinar[]> {
  const supabase = await createClient();
  let q = supabase
    .from("webinars")
    .select(
      "id, title, description, topic, speaker_name, speaker_role, speaker_org, starts_at, duration_minutes, status, video_url, registration_url, attendees_count, visual_variant",
    )
    .eq("is_published", true)
    .order("starts_at", { ascending: false });
  if (opts?.status) q = q.eq("status", opts.status);
  if (opts?.topic) q = q.eq("topic", opts.topic);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Webinar[];
}

export async function getWebinar(id: string): Promise<Webinar | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("webinars")
    .select(
      "id, title, description, topic, speaker_name, speaker_role, speaker_org, starts_at, duration_minutes, status, video_url, registration_url, attendees_count, visual_variant",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as Webinar | null;
}

export function formatWebinarDate(iso: string, durationMinutes: number): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date} · ${time} · ${durationMinutes} min`;
}
