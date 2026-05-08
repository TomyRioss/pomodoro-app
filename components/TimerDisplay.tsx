"use client";

const RED = "#E8A0A0";
const GREEN = "#A8D5A2";
const RING_BG = "#e8e5e0";

interface Props {
  secondsLeft: number;
  totalSeconds: number;
  mode: "work" | "break";
}

export function TimerDisplay({ secondsLeft, totalSeconds, mode }: Props) {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const accent = mode === "work" ? RED : GREEN;
  const progress = totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0;

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <span
        className="text-xs font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
        style={{ background: accent, color: "#1a1a1a" }}
      >
        {mode === "work" ? "Focus" : "Break"}
      </span>

      <div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 240,
          height: 240,
          background: `conic-gradient(${accent} ${progress}turn, ${RING_BG} 0turn)`,
          padding: 10,
        }}
      >
        <div
          className="flex flex-col items-center justify-center rounded-full w-full h-full"
          style={{ background: "#faf9f7" }}
        >
          <span
            className="font-mono font-bold tabular-nums tracking-tight leading-none"
            style={{ fontSize: "3.75rem", color: "#1a1a1a" }}
          >
            {mm}:{ss}
          </span>
        </div>
      </div>
    </div>
  );
}
