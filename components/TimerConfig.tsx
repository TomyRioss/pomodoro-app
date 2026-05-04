"use client";
import { useState } from "react";

const RED = "#E8A0A0";
const GREEN = "#A8D5A2";

interface Props {
  workDuration: number;
  breakDuration: number;
  onSetWork: (minutes: number) => void;
  onSetBreak: (minutes: number) => void;
}

export function TimerConfig({ workDuration, breakDuration, onSetWork, onSetBreak }: Props) {
  const [workInput, setWorkInput] = useState(String(workDuration));
  const [breakInput, setBreakInput] = useState(String(breakDuration));

  function handleWorkBlur() {
    const val = parseInt(workInput, 10);
    if (!isNaN(val) && val >= 1) {
      onSetWork(val);
    } else {
      setWorkInput(String(workDuration));
    }
  }

  function handleBreakBlur() {
    const val = parseInt(breakInput, 10);
    if (!isNaN(val) && val >= 1) {
      onSetBreak(val);
    } else {
      setBreakInput(String(breakDuration));
    }
  }

  return (
    <div className="flex gap-6 mt-4 text-sm">
      <label className="flex items-center gap-2" style={{ color: "#1a1a1a" }}>
        Work
        <input
          type="number"
          min={1}
          value={workInput}
          onChange={(e) => setWorkInput(e.target.value)}
          onBlur={handleWorkBlur}
          className="w-14 px-2 py-1 rounded-sm border text-center font-mono"
          style={{ borderColor: RED, background: "#ffffff", color: "#1a1a1a" }}
        />
        min
      </label>
      <label className="flex items-center gap-2" style={{ color: "#1a1a1a" }}>
        Break
        <input
          type="number"
          min={1}
          value={breakInput}
          onChange={(e) => setBreakInput(e.target.value)}
          onBlur={handleBreakBlur}
          className="w-14 px-2 py-1 rounded-sm border text-center font-mono"
          style={{ borderColor: GREEN, background: "#ffffff", color: "#1a1a1a" }}
        />
        min
      </label>
    </div>
  );
}
