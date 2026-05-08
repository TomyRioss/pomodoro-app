"use client";
import { Trash2 } from "lucide-react";

const RED = "#E8A0A0";

interface Props {
  sessions: number[];
  onDelete: (id: number) => void;
  onReset: () => void;
}

const MAX_DISPLAY = 8;

export function SessionCounter({ sessions, onDelete, onReset }: Props) {
  const count = sessions.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sessions
        </span>
        <div className="flex items-center gap-2">
          {count > 0 && (
            <span className="text-xs font-mono text-muted-foreground">{count} completed</span>
          )}
          {count > 0 && (
            <button
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Reset sessions"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {count === 0 ? (
        <p className="text-xs text-muted-foreground">Complete a full work + break cycle to earn a session.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {sessions.slice(0, MAX_DISPLAY).map((id, idx) => (
            <button
              key={id}
              onClick={() => onDelete(id)}
              title={`Session ${idx + 1} — click to remove`}
              className="w-6 h-6 rounded-full transition-transform hover:scale-110 active:scale-95"
              style={{ background: RED, border: "none" }}
            />
          ))}
          {count > MAX_DISPLAY && (
            <span className="text-xs font-mono text-muted-foreground self-center">
              +{count - MAX_DISPLAY} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
