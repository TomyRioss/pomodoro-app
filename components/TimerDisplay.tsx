"use client";

const RED = "#E8A0A0";
const GREEN = "#A8D5A2";

interface Props {
  secondsLeft: number;
  mode: "work" | "break";
}

export function TimerDisplay({ secondsLeft, mode }: Props) {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const accent = mode === "work" ? RED : GREEN;

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded"
        style={{ background: accent, color: "#1a1a1a" }}
      >
        {mode === "work" ? "Focus" : "Break"}
      </span>
      <span className="text-8xl font-mono font-bold tabular-nums" style={{ color: "#1a1a1a" }}>
        {mm}:{ss}
      </span>
    </div>
  );
}
