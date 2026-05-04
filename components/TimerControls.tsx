"use client";
import { Play, Pause, RotateCcw } from "lucide-react";

const RED = "#E8A0A0";
const GREEN = "#A8D5A2";

interface Props {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  mode: "work" | "break";
}

export function TimerControls({ isRunning, onStart, onPause, onReset, mode }: Props) {
  const accent = mode === "work" ? RED : GREEN;

  return (
    <div className="flex gap-3 mt-6">
      {isRunning ? (
        <button
          onClick={onPause}
          className="flex items-center gap-2 px-6 py-2 rounded font-semibold text-sm transition-colors"
          style={{ background: accent, color: "#1a1a1a", border: "none" }}
        >
          <Pause size={15} /> Pause
        </button>
      ) : (
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-6 py-2 rounded font-semibold text-sm transition-colors"
          style={{ background: accent, color: "#1a1a1a", border: "none" }}
        >
          <Play size={15} /> Start
        </button>
      )}
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-5 py-2 rounded text-sm font-semibold transition-colors"
        style={{ background: "#1a1a1a", color: "#ffffff", border: "none" }}
      >
        <RotateCcw size={14} /> Reset
      </button>
    </div>
  );
}
