"use client";
import { useState } from "react";
import { Settings, Volume2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
  onStopTone: () => void;
}

export function TimerConfig({
  workDuration, breakDuration, onSetWork, onSetBreak, tone, onSetTone, onPreviewTone, onStopTone,
}: Props) {
  const [open, setOpen] = useState(false);
  const [workInput, setWorkInput] = useState(String(workDuration));
  const [breakInput, setBreakInput] = useState(String(breakDuration));
  const [previewing, setPreviewing] = useState(false);

  function handleWorkBlur() {
    const val = parseInt(workInput, 10);
    if (!isNaN(val) && val >= 1) onSetWork(val);
    else setWorkInput(String(workDuration));
  }

  function handleBreakBlur() {
    const val = parseInt(breakInput, 10);
    if (!isNaN(val) && val >= 1) onSetBreak(val);
    else setBreakInput(String(breakDuration));
  }

  function togglePreview() {
    if (previewing) {
      onStopTone();
      setPreviewing(false);
    } else {
      onPreviewTone();
      setPreviewing(true);
    }
  }

  return (
    <div>
      <Separator className="mb-3" />
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 mx-auto text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
      >
        <Settings size={12} />
        Settings
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex justify-center gap-8 text-sm">
            <label className="flex items-center gap-2 text-foreground">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Work</span>
              <input
                type="number"
                min={1}
                value={workInput}
                onChange={(e) => setWorkInput(e.target.value)}
                onBlur={handleWorkBlur}
                className="w-14 px-2 py-1 rounded border text-center font-mono text-sm bg-background"
                style={{ borderColor: RED }}
              />
              <span className="text-xs text-muted-foreground">min</span>
            </label>
            <label className="flex items-center gap-2 text-foreground">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Break</span>
              <input
                type="number"
                min={1}
                value={breakInput}
                onChange={(e) => setBreakInput(e.target.value)}
                onBlur={handleBreakBlur}
                className="w-14 px-2 py-1 rounded border text-center font-mono text-sm bg-background"
                style={{ borderColor: GREEN }}
              />
              <span className="text-xs text-muted-foreground">min</span>
            </label>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm">
            <Volume2 size={13} className="text-muted-foreground" />
            <select
              value={tone}
              onChange={(e) => { onStopTone(); setPreviewing(false); onSetTone(e.target.value as AlarmTone); }}
              className="px-2 py-1 rounded border font-mono text-xs bg-background border-border text-foreground cursor-pointer"
            >
              {ALARM_TONE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={togglePreview}
              className="px-2.5 py-1 rounded text-xs border border-border hover:bg-muted transition-colors cursor-pointer"
            >
              {previewing ? "⏸" : "▶"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
