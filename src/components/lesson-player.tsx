"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { createClient } from "@/lib/supabase/client";
import type { LessonAsset, LessonPlayerData } from "@/lib/data/lessons";

type Props = {
  data: LessonPlayerData;
  initialPercent: number;
  initialPosition: number;
};

function pickLatest<T extends { uploaded_at: string }>(items: T[]): T | undefined {
  return items[0];
}

export function LessonPlayer({ data, initialPercent, initialPosition }: Props) {
  const { lesson, module: mod, siblings, assets } = data;
  const idx = siblings.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const slideAsset = useMemo(
    () => pickLatest(assets.filter((a) => a.type === "slide_deck")),
    [assets],
  );
  const audioAsset = useMemo(
    () => pickLatest(assets.filter((a) => a.type === "voice_over")),
    [assets],
  );
  const resources = useMemo(
    () => assets.filter((a) => a.type === "resource"),
    [assets],
  );

  const audioRef = useRef<HTMLAudioElement>(null);
  const [percent, setPercent] = useState(initialPercent);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Resume position on mount
  useEffect(() => {
    if (audioRef.current && initialPosition > 0) {
      audioRef.current.currentTime = initialPosition;
    }
  }, [initialPosition]);

  // Save progress every 10s while playing
  const saveProgress = useCallback(
    async (positionSeconds: number, totalSeconds: number) => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const pct = totalSeconds > 0
        ? Math.min(100, Math.round((positionSeconds / totalSeconds) * 100))
        : 0;
      await supabase
        .from("lesson_progress")
        .upsert(
          {
            user_id: user.id,
            lesson_id: lesson.id,
            percent_complete: pct,
            last_position_seconds: Math.floor(positionSeconds),
            completed_at: pct >= 95 ? new Date().toISOString() : null,
          },
          { onConflict: "user_id,lesson_id" },
        );
      setPercent(pct);
    },
    [lesson.id],
  );

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      const el = audioRef.current;
      if (!el) return;
      void saveProgress(el.currentTime, el.duration || 0);
    }, 10_000);
    return () => clearInterval(id);
  }, [playing, saveProgress]);

  return (
    <div style={{ padding: "24px 32px 80px", maxWidth: 1200, margin: "0 auto" }}>
      {/* breadcrumb */}
      <div
        className="mono"
        style={{
          fontSize: 11,
          color: "var(--ink-3)",
          letterSpacing: ".1em",
          fontWeight: 600,
          marginBottom: 16,
        }}
      >
        <Link href="/" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
          HOME
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link
          href={`/program/${mod.id}`}
          style={{ color: "var(--ink-3)", textDecoration: "none" }}
        >
          MODULE {mod.code}
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--ink)", fontWeight: 700 }}>
          LESSON {lesson.code}
        </span>
      </div>

      {/* header */}
      <header style={{ marginBottom: 28 }}>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--forest)",
            letterSpacing: ".18em",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          LESSON · {lesson.code}
        </div>
        <h1
          className="display"
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            letterSpacing: "-.02em",
            marginBottom: 6,
          }}
        >
          {lesson.title}
        </h1>
        <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
          From <strong style={{ color: "var(--ink-2)" }}>{mod.title}</strong>
          {" · "}
          {lesson.duration}
        </div>
      </header>

      {/* main playback area */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 24,
          marginBottom: 24,
        }}
      >
        {/* slide viewer */}
        <div
          style={{
            background: "var(--ink)",
            borderRadius: 12,
            overflow: "hidden",
            aspectRatio: "16/10",
            display: "grid",
            placeItems: "center",
            color: "#fff",
            position: "relative",
          }}
        >
          {slideAsset ? (
            <iframe
              title={slideAsset.filename ?? "Slide deck"}
              src={`${slideAsset.file_url}#toolbar=0&navpanes=0`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "#fff",
              }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: 28 }}>
              <Icon name="file" size={36} stroke={1.4} />
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10 }}>
                No slides uploaded yet
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#9aa19a",
                  marginTop: 4,
                  letterSpacing: ".06em",
                }}
              >
                The instructor will add slide content here.
              </div>
            </div>
          )}
        </div>

        {/* progress + meta side panel */}
        <aside
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div>
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: ".14em",
                color: "var(--ink-3)",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              YOUR PROGRESS
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600 }}>This lesson</span>
              <span
                className="mono"
                style={{ fontSize: 13, fontWeight: 700, color: "var(--forest)" }}
              >
                {percent}%
              </span>
            </div>
            <div className="bar bar-thick">
              <i style={{ width: `${percent}%` }} />
            </div>
          </div>

          <div>
            <div
              className="mono"
              style={{
                fontSize: 10,
                letterSpacing: ".14em",
                color: "var(--ink-3)",
                fontWeight: 700,
                marginBottom: 6,
              }}
            >
              IN THIS MODULE
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
              Lesson {idx + 1} of {siblings.length}
            </div>
          </div>

          {resources.length > 0 && (
            <div>
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: ".14em",
                  color: "var(--ink-3)",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                RESOURCES
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {resources.map((r: LessonAsset) => (
                  <li key={r.id}>
                    <a
                      href={r.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 12.5,
                        color: "var(--forest)",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Icon name="download" size={11} />
                      {r.filename ?? "Download"}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      {/* audio player */}
      <section
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: "var(--forest)",
            letterSpacing: ".14em",
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          NARRATION
        </div>
        {audioAsset ? (
          <audio
            ref={audioRef}
            controls
            preload="metadata"
            src={audioAsset.file_url}
            style={{ width: "100%" }}
            onPlay={() => setPlaying(true)}
            onPause={() => {
              setPlaying(false);
              const el = audioRef.current;
              if (el) void saveProgress(el.currentTime, el.duration || 0);
            }}
            onLoadedMetadata={() => {
              const el = audioRef.current;
              if (el) setDuration(el.duration || 0);
            }}
            onEnded={() => {
              setPlaying(false);
              const el = audioRef.current;
              if (el) void saveProgress(el.duration, el.duration);
            }}
          />
        ) : (
          <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
            No voice-over audio uploaded yet.
          </div>
        )}
        {audioAsset && duration > 0 && (
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--ink-3)",
              letterSpacing: ".08em",
              fontWeight: 600,
              marginTop: 8,
            }}
          >
            DURATION {Math.floor(duration / 60)}:
            {String(Math.floor(duration % 60)).padStart(2, "0")} · resumes from where you left off
          </div>
        )}
      </section>

      {/* transcript */}
      {lesson.transcript_text && (
        <section
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--forest)",
              letterSpacing: ".14em",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            TRANSCRIPT
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--ink-2)",
              lineHeight: 1.65,
              whiteSpace: "pre-wrap",
            }}
          >
            {lesson.transcript_text}
          </div>
        </section>
      )}

      {/* prev/next nav */}
      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        {prev ? (
          <Link
            href={`/lesson/${prev.id}`}
            className="card hover-lift"
            style={{
              padding: "14px 18px",
              textDecoration: "none",
              color: "var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--ink-3)",
                letterSpacing: ".14em",
                fontWeight: 600,
              }}
            >
              ← PREVIOUS · LESSON {prev.code}
            </span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/lesson/${next.id}`}
            className="card hover-lift"
            style={{
              padding: "14px 18px",
              textDecoration: "none",
              color: "var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              textAlign: "right",
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--ink-3)",
                letterSpacing: ".14em",
                fontWeight: 600,
              }}
            >
              NEXT · LESSON {next.code} →
            </span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{next.title}</span>
          </Link>
        ) : (
          <Link
            href={`/program/${mod.id}`}
            className="card hover-lift"
            style={{
              padding: "14px 18px",
              textDecoration: "none",
              color: "var(--ink)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              textAlign: "right",
              borderColor: "var(--forest)",
            }}
          >
            <span
              className="mono"
              style={{
                fontSize: 10,
                color: "var(--forest)",
                letterSpacing: ".14em",
                fontWeight: 600,
              }}
            >
              END OF MODULE
            </span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              Back to module overview →
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
