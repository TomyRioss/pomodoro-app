"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAlarm } from "@/hooks/useAlarm";
import { useTimer } from "@/hooks/useTimer";
import { TimerDisplay } from "@/components/TimerDisplay";
import { TimerControls } from "@/components/TimerControls";
import { TimerConfig } from "@/components/TimerConfig";
import { TaskList } from "@/components/TaskList";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { SessionCounter } from "@/components/SessionCounter";
import { Separator } from "@/components/ui/separator";

const RED = "#E8A0A0";
const GREEN = "#A8D5A2";

export default function Home() {
  const [sessions, setSessions] = useState<number[]>([]);
  const pendingWorkRef = useRef(false);

  const onPhaseComplete = useCallback((phase: "work" | "break") => {
    if (phase === "work") {
      pendingWorkRef.current = true;
    } else if (phase === "break" && pendingWorkRef.current) {
      pendingWorkRef.current = false;
      setSessions((prev) => [...prev, Date.now()]);
    }
  }, []);

  const deleteSession = useCallback((id: number) => {
    setSessions((prev) => prev.filter((s) => s !== id));
  }, []);

  const resetSessions = useCallback(() => setSessions([]), []);

  const { startAlarm, stopAlarm, tone, setTone } = useAlarm();
  const {
    secondsLeft,
    mode,
    isRunning,
    isPendingTransition,
    workDuration,
    breakDuration,
    start,
    pause,
    reset,
    confirmTransition,
    skipToNext,
    setWorkDuration,
    setBreakDuration,
  } = useTimer({ startAlarm, stopAlarm, onPhaseComplete });

  const totalSeconds = mode === "work" ? workDuration * 60 : breakDuration * 60;
  const nextMode = mode === "work" ? "break" : "work";
  const nextAccent = nextMode === "break" ? GREEN : RED;
  const nextLabel = nextMode === "break" ? "Start Break" : "Start Work";

  useEffect(() => {
    const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const secs = (secondsLeft % 60).toString().padStart(2, "0");
    document.title = `${mins}:${secs} — Pomodoro`;
  }, [secondsLeft]);

  useEffect(() => {
    if (!isPendingTransition) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); confirmTransition(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPendingTransition, confirmTransition]);

  useEffect(() => {
    if (isPendingTransition) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && (e.target as HTMLElement).tagName !== "INPUT") {
        e.preventDefault();
        isRunning ? pause() : start();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPendingTransition, isRunning, start, pause]);

  return (
    <main
      className="min-h-screen transition-colors duration-700 px-4 py-10"
      style={{ background: mode === "work" ? `${RED}55` : `${GREEN}55` }}
    >
      {isPendingTransition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-5 px-10 py-8 rounded-2xl bg-white shadow-xl max-w-xs w-full mx-4">
            <span className="text-lg font-bold text-center text-[#1a1a1a]">
              {mode === "work" ? "Focus session complete!" : "Break time over!"}
            </span>
            <button
              onClick={confirmTransition}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
              style={{ background: nextAccent, color: "#1a1a1a", border: "none" }}
            >
              {nextLabel}
            </button>
            <span className="text-xs text-[#aaa]">
              or press <kbd className="bg-[#f0f0f0] px-1.5 py-0.5 rounded font-mono text-[10px]">Space</kbd>
            </span>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto flex flex-col gap-4">
        <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border border-white/60 px-6 py-4">
          <TimerDisplay secondsLeft={secondsLeft} totalSeconds={totalSeconds} mode={mode} />
          <TimerControls
            isRunning={isRunning}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSkip={skipToNext}
            mode={mode}
          />
          <TimerConfig
            workDuration={workDuration}
            breakDuration={breakDuration}
            onSetWork={setWorkDuration}
            onSetBreak={setBreakDuration}
            tone={tone}
            onSetTone={setTone}
            onPreviewTone={startAlarm}
          />
        </div>

        <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border border-white/60 px-6 py-5">
          <TaskList />
        </div>

        <div className="rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm border border-white/60 px-6 py-5">
          <SessionCounter
            sessions={sessions}
            onDelete={deleteSession}
            onReset={resetSessions}
          />
        </div>

        <Separator className="opacity-30" />
        <MotivationalQuote />
      </div>
    </main>
  );
}
