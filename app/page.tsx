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
  const { playAlarm } = useAlarm();
  const {
    secondsLeft,
    mode,
    isRunning,
    workDuration,
    breakDuration,
    start,
    pause,
    reset,
    setWorkDuration,
    setBreakDuration,
  } = useTimer(playAlarm);

  const pageBg = mode === "work" ? RED : GREEN;

  useEffect(() => {
    const mins = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
    const secs = (secondsLeft % 60).toString().padStart(2, "0");
    document.title = `${mins}:${secs} — Pomodoro`;
  }, [secondsLeft]);

  return (
    <main
      className="flex flex-col items-center min-h-screen px-4 py-12 transition-colors duration-500"
      style={{ background: pageBg }}
    >
      {/* Wrapper: relative so quote can escape to the right */}
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
            mode={mode}
          />
          <TimerConfig
            workDuration={workDuration}
            breakDuration={breakDuration}
            onSetWork={setWorkDuration}
            onSetBreak={setBreakDuration}
          />
        </section>

        <section
          className="px-6 py-6 rounded-md"
          style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.08)" }}
        >
          <TaskList />
        </section>

        {/* Quote — anchored to right edge of timer wrapper */}
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
