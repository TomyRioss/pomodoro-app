"use client";
import { useState, useEffect, useCallback, useRef } from "react";

type Mode = "work" | "break";

export interface TimerState {
  secondsLeft: number;
  mode: Mode;
  isRunning: boolean;
  workDuration: number;
  breakDuration: number;
}

export interface TimerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  setWorkDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
}

export function useTimer(onAlarm: () => void): TimerState & TimerActions {
  const [workDuration, setWorkDurationState] = useState(25);
  const [breakDuration, setBreakDurationState] = useState(5);
  const [mode, setMode] = useState<Mode>("work");
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const onAlarmRef = useRef(onAlarm);
  const alarmFiredRef = useRef(false);
  onAlarmRef.current = onAlarm;

  // Countdown interval — restarts when isRunning or mode changes
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, mode]);

  // Detect natural completion (V1, V3)
  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      if (!alarmFiredRef.current) {
        alarmFiredRef.current = true;
        onAlarmRef.current();
        setMode((prev) => {
          const next: Mode = prev === "work" ? "break" : "work";
          setSecondsLeft(next === "work" ? workDuration * 60 : breakDuration * 60);
          return next;
        });
      }
    } else if (secondsLeft > 0) {
      alarmFiredRef.current = false;
    }
  }, [secondsLeft, isRunning, workDuration, breakDuration]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setMode("work");
    alarmFiredRef.current = false;
    setSecondsLeft(workDuration * 60);
  }, [workDuration]);

  const setWorkDuration = useCallback((minutes: number) => {
    const valid = Math.max(1, Math.floor(minutes));
    setWorkDurationState(valid);
    setIsRunning(false);
    setMode("work");
    alarmFiredRef.current = false;
    setSecondsLeft(valid * 60);
  }, []);

  const setBreakDuration = useCallback((minutes: number) => {
    const valid = Math.max(1, Math.floor(minutes));
    setBreakDurationState(valid);
  }, []);

  return {
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
  };
}
