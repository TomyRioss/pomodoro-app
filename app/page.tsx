"use client";
import { useEffect } from "react";
import { useAlarm } from "@/hooks/useAlarm";
import { useTimer } from "@/hooks/useTimer";
import { TimerDisplay } from "@/components/TimerDisplay";
import { TimerControls } from "@/components/TimerControls";
import { TimerConfig } from "@/components/TimerConfig";
import { TaskList } from "@/components/TaskList";
import { MotivationalQuote } from "@/components/MotivationalQuote";

const RED = "#E8A0A0";
const GREEN = "#A8D5A2";

export default function Home() {
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
  } = useTimer({ startAlarm, stopAlarm });

  const pageBg = mode === "work" ? RED : GREEN;

  useEffect(() => {
    const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const secs = (secondsLeft % 60).toString().padStart(2, "0");
    document.title = `${mins}:${secs} — Pomodoro`;
  }, [secondsLeft]);

  useEffect(() => {
    if (!isPendingTransition) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        confirmTransition();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isPendingTransition, confirmTransition]);

  const nextMode = mode === "work" ? "break" : "work";
  const nextLabel = nextMode === "break" ? "Iniciar descanso" : "Iniciar trabajo";

  return (
    <main
      className="flex flex-col items-center min-h-screen px-4 py-12 transition-colors duration-500"
      style={{ background: pageBg }}
    >
      {isPendingTransition && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <div
            className="flex flex-col items-center gap-6 px-12 py-10 rounded-xl"
            style={{ background: "#fff", maxWidth: "360px", width: "90%" }}
          >
            <span className="text-2xl font-bold text-center" style={{ color: "#1a1a1a" }}>
              {mode === "work" ? "¡Tiempo de trabajo completado!" : "¡Descanso terminado!"}
            </span>
            <button
              onClick={confirmTransition}
              className="w-full py-3 rounded-lg font-semibold text-base transition-colors"
              style={{ background: nextMode === "break" ? GREEN : RED, color: "#1a1a1a", border: "none" }}
            >
              {nextLabel}
            </button>
            <span className="text-xs" style={{ color: "#999" }}>
              o presioná <kbd style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>Space</kbd>
            </span>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-md flex flex-col gap-6">
        <section
          className="flex flex-col items-center px-10 py-8 rounded-md"
          style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }}
        >
          <TimerDisplay secondsLeft={secondsLeft} mode={mode} />
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
        </section>

        <section
          className="px-6 py-6 rounded-md"
          style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }}
        >
          <TaskList />
        </section>

        <aside
          className="hidden lg:block absolute top-0"
          style={{ left: "calc(100% + 6rem)", width: "24rem", color: "#1a1a1a", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem", lineHeight: "1.7rem" }}
        >
          <MotivationalQuote />
        </aside>
      </div>
    </main>
  );
}
