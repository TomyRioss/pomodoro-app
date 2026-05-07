"use client";
import { useState } from "react";
import { type AlarmTone, ALARM_TONE_OPTIONS } from "@/hooks/useAlarm";

const RED = "#E8A0A0";
const GREEN = "#A8D5A2";

interface Props {
  workDuration: number;
  breakDuration: number;
  onSetWork: (minutes: number) => void;
  onSetBreak: (minutes: number) => void;
  tone: AlarmTone;
  onSetTone: (t: AlarmTone) => void;
  onPreviewTone: () => void;
}

export function TimerConfig({ workDuration, breakDuration, onSetWork, onSetBreak, tone, onSetTone, onPreviewTone }: Props) {
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
    <div className="flex flex-col items-center gap-3 mt-4">
      <div className="flex gap-6 text-sm">
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

      <div className="flex items-center gap-2 text-sm" style={{ color: "#1a1a1a" }}>
        <span>Alarm</span>
        <select
          value={tone}
          onChange={(e) => onSetTone(e.target.value as AlarmTone)}
          className="px-2 py-1 rounded-sm border font-mono text-xs"
          style={{ borderColor: "rgba(0,0,0,0.18)", background: "#ffffff", color: "#1a1a1a" }}
        >
          {ALARM_TONE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button
          onClick={onPreviewTone}
          className="px-2 py-1 rounded text-xs"
          style={{ background: "transparent", border: "1px solid rgba(0,0,0,0.18)", color: "#1a1a1a" }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
