"use client";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const RED = "#E8A0A0";
const GREEN = "#A8D5A2";

interface Props {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  mode: "work" | "break";
}

export function TimerControls({ isRunning, onStart, onPause, onReset, onSkip, mode }: Props) {
  const accent = mode === "work" ? RED : GREEN;

  return (
    <div className="flex items-center gap-3 justify-center pb-2">
      <Tooltip>
        <TooltipTrigger
          onClick={isRunning ? onPause : onStart}
          className="flex items-center gap-2 px-7 py-2.5 rounded-full font-semibold text-sm transition-all active:scale-95 shadow-sm cursor-pointer"
          style={{ background: accent, color: "#1a1a1a", border: "none" }}
        >
          {isRunning ? <Pause size={15} /> : <Play size={15} />}
          {isRunning ? "Pause" : "Start"}
        </TooltipTrigger>
        <TooltipContent>{isRunning ? "Pause timer" : "Start timer"}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger render={<span />}>
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="rounded-full h-9 w-9"
          >
            <RotateCcw size={14} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Reset</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger render={<span />}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onSkip}
            className="rounded-full h-9 w-9"
          >
            <SkipForward size={14} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{mode === "work" ? "Skip to break" : "Skip to work"}</TooltipContent>
      </Tooltip>
    </div>
  );
}
