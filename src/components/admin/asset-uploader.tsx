"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AssetType = "slide_deck" | "voice_over" | "avatar_video" | "resource";

const BUCKETS: Record<AssetType, string> = {
  slide_deck: "lesson-slides",
  voice_over: "lesson-audio",
  avatar_video: "lesson-avatars",
  resource: "resources",
};

const TYPE_LABELS: Record<AssetType, string> = {
  slide_deck: "Slide deck (PDF, PPTX, images)",
  voice_over: "Voice-over audio (MP3, WAV)",
  avatar_video: "Avatar video (MP4)",
  resource: "Resource / handout (any file)",
};

const ACCEPT: Record<AssetType, string> = {
  slide_deck: ".pdf,.pptx,.ppt,.png,.jpg,.jpeg",
  voice_over: ".mp3,.wav,.m4a,.ogg",
  avatar_video: ".mp4,.mov,.webm",
  resource: "",
};

type Props = {
  lessonId: string;
};

export function AssetUploader({ lessonId }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [type, setType] = useState<AssetType>("slide_deck");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Pick a file first.");
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);

    const supabase = createClient();
    const bucket = BUCKETS[type];
    const path = `${lessonId}/${Date.now()}-${file.name.replace(/[^\w.-]+/g, "_")}`;

    const { error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (uploadErr) {
      setError(`Upload failed: ${uploadErr.message}`);
      setBusy(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    const { error: insertErr } = await supabase.from("lesson_assets").insert({
      lesson_id: lessonId,
      type,
      file_url: publicUrl,
      filename: file.name,
      size_bytes: file.size,
    });
    if (insertErr) {
      setError(`File saved to storage but database insert failed: ${insertErr.message}`);
      setBusy(false);
      return;
    }

    setSuccess(`Uploaded ${file.name}`);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setBusy(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleUpload}
      style={{
        padding: 24,
        border: "1px solid var(--line)",
        borderRadius: 12,
        background: "var(--card)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: "var(--forest)",
          letterSpacing: ".14em",
          fontWeight: 700,
        }}
      >
        UPLOAD ASSET
      </div>

      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span className="label">Asset type</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as AssetType)}
          className="input"
        >
          {(Object.keys(TYPE_LABELS) as AssetType[]).map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span className="label">File</span>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT[type] || undefined}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="input"
          style={{ padding: 10 }}
        />
      </label>

      {file && (
        <div
          style={{
            fontSize: 12.5,
            color: "var(--ink-3)",
            padding: "8px 12px",
            background: "var(--paper-2)",
            borderRadius: 6,
          }}
        >
          Selected: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}

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
      {success && (
        <div
          style={{
            fontSize: 12.5,
            color: "var(--forest)",
            background: "rgba(0, 128, 55, .08)",
            border: "1px solid rgba(0, 128, 55, .25)",
            borderRadius: 6,
            padding: "8px 12px",
          }}
        >
          ✓ {success}
        </div>
      )}

      <button
        type="submit"
        disabled={busy || !file}
        className="btn btn-pri"
        style={{
          justifyContent: "center",
          opacity: busy || !file ? 0.55 : 1,
        }}
      >
        {busy ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}
