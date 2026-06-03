"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icon";
import { formatDuration } from "@/lib/data/podcast-shared";

export function PodcastAudio({
  audioUrl,
  durationSeconds,
}: {
  audioUrl: string | null;
  durationSeconds: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setPos(Math.floor(a.currentTime));
    const onLoaded = () => setDuration(Math.floor(a.duration));
    const onEnded = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void a.play();
      setPlaying(true);
    }
  };

  const seek = (delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(duration, a.currentTime + delta));
  };

  const hasAudio = !!audioUrl;
  const pct = duration ? Math.min(100, (pos / duration) * 100) : 0;

  return (
    <div
      style={{
        background: "var(--forest-2)",
        border: "1px solid #2a4a37",
        borderRadius: 10,
        padding: "18px 20px",
      }}
    >
      {hasAudio && <audio ref={audioRef} src={audioUrl!} preload="metadata" />}

      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
        <button
          type="button"
          onClick={() => seek(-15)}
          disabled={!hasAudio}
          aria-label="Back 15 seconds"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid #3a5547",
            background: "transparent",
            color: "var(--paper)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: hasAudio ? "pointer" : "not-allowed",
            opacity: hasAudio ? 1 : 0.4,
          }}
        >
          <Icon name="fast-back" size={14} />
        </button>
        <button
          type="button"
          onClick={toggle}
          disabled={!hasAudio}
          aria-label={playing ? "Pause" : "Play"}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--moss)",
            border: "none",
            color: "var(--ink)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: hasAudio ? "pointer" : "not-allowed",
            opacity: hasAudio ? 1 : 0.4,
          }}
        >
          <Icon name={playing ? "pause" : "play"} size={20} />
        </button>
        <button
          type="button"
          onClick={() => seek(30)}
          disabled={!hasAudio}
          aria-label="Forward 30 seconds"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1px solid #3a5547",
            background: "transparent",
            color: "var(--paper)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: hasAudio ? "pointer" : "not-allowed",
            opacity: hasAudio ? 1 : 0.4,
          }}
        >
          <Icon name="fast-fwd" size={14} />
        </button>

        <div style={{ flex: 1, marginLeft: 8 }}>
          <div style={{ display: "flex", alignItems: "center", height: 36, gap: 2 }}>
            {Array.from({ length: 50 }, (_, i) => {
              const barPct = (i / 50) * 100;
              const active = barPct < pct;
              const h = 6 + Math.abs(Math.sin(i * 0.7)) * 22;
              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: h,
                    background: active ? "var(--moss)" : "#3a5547",
                    borderRadius: 1,
                  }}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span className="mono" style={{ fontSize: 11, color: "var(--paper)" }}>
              {formatDuration(pos)}
            </span>
            <span className="mono" style={{ fontSize: 11, color: "#aab8a8" }}>
              {hasAudio
                ? `${formatDuration(Math.max(0, duration - pos))} REMAINING`
                : "AUDIO COMING SOON"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
