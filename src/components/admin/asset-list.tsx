"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { createClient } from "@/lib/supabase/client";

type Asset = {
  id: string;
  type: "slide_deck" | "voice_over" | "avatar_video" | "resource";
  file_url: string;
  filename: string | null;
  size_bytes: number | null;
  uploaded_at: string;
};

const BUCKETS: Record<Asset["type"], string> = {
  slide_deck: "lesson-slides",
  voice_over: "lesson-audio",
  avatar_video: "lesson-avatars",
  resource: "resources",
};

const TYPE_BADGE: Record<Asset["type"], string> = {
  slide_deck: "Slides",
  voice_over: "Voice-over",
  avatar_video: "Avatar video",
  resource: "Resource",
};

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function pathFromUrl(url: string, bucket: string): string | null {
  const marker = `/${bucket}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return url.slice(i + marker.length);
}

export function AssetList({ assets }: { assets: Asset[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (assets.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          border: "1px dashed var(--line)",
          borderRadius: 10,
          textAlign: "center",
          color: "var(--ink-3)",
          fontSize: 13.5,
          background: "var(--paper-2)",
        }}
      >
        No assets uploaded for this lesson yet.
      </div>
    );
  }

  async function handleDelete(asset: Asset) {
    if (!confirm(`Delete "${asset.filename ?? "this file"}"? This is permanent.`)) return;
    setBusyId(asset.id);
    setError(null);
    const supabase = createClient();
    const bucket = BUCKETS[asset.type];
    const path = pathFromUrl(asset.file_url, bucket);

    if (path) {
      const { error: storageErr } = await supabase.storage.from(bucket).remove([path]);
      if (storageErr) {
        // Continue to delete the row anyway — orphan storage objects are harmless
        console.warn("Storage delete failed:", storageErr.message);
      }
    }

    const { error: dbErr } = await supabase
      .from("lesson_assets")
      .delete()
      .eq("id", asset.id);
    if (dbErr) {
      setError(`Couldn't delete asset row: ${dbErr.message}`);
      setBusyId(null);
      return;
    }

    setBusyId(null);
    router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {error && (
        <div
          style={{
            fontSize: 12.5,
            color: "var(--bad)",
            background: "rgba(165, 58, 30, .08)",
            border: "1px solid rgba(165, 58, 30, .25)",
            borderRadius: 6,
            padding: "8px 12px",
          }}
        >
          {error}
        </div>
      )}
      {assets.map((a) => (
        <div
          key={a.id}
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto auto auto",
            gap: 14,
            alignItems: "center",
            padding: "12px 16px",
            border: "1px solid var(--line)",
            borderRadius: 8,
            background: "var(--card)",
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: ".1em",
              fontWeight: 700,
              color: "var(--forest)",
              width: 90,
            }}
          >
            {TYPE_BADGE[a.type].toUpperCase()}
          </span>
          <a
            href={a.file_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 14,
              color: "var(--ink)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {a.filename ?? a.file_url}
          </a>
          <span className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
            {formatSize(a.size_bytes)}
          </span>
          <a
            href={a.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
            style={{ textDecoration: "none" }}
          >
            <Icon name="download" size={12} /> Open
          </a>
          <button
            type="button"
            onClick={() => handleDelete(a)}
            disabled={busyId === a.id}
            className="btn btn-ghost btn-sm"
            style={{ color: "var(--bad)", borderColor: "var(--line)" }}
          >
            {busyId === a.id ? "Deleting…" : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
