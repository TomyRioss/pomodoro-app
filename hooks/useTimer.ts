"use client";
import { useState, useEffect, useCallback, useRef } from "react";

type Mode = "work" | "break";

export interface TimerState {
  secondsLeft: number;
  mode: Mode;
  isRunning: boolean;
  isPendingTransition: boolean;
  workDuration: number;
  breakDuration: number;
}

export interface TimerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  confirmTransition: () => void;
  skipToNext: () => void;
  setWorkDuration: (minutes: number) => void;
  setBreakDuration: (minutes: number) => void;
}

interface AlarmControls {
  startAlarm: () => void;
  stopAlarm: () => void;
}

export function useTimer({ startAlarm, stopAlarm }: AlarmControls): TimerState & TimerActions {
  const [workDuration, setWorkDurationState] = useState(25);
  const [breakDuration, setBreakDurationState] = useState(5);
  const [mode, setMode] = useState<Mode>("work");
  const [isRunning, setIsRunning] = useState(false);
  const [isPendingTransition, setIsPendingTransition] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const alarmFiredRef = useRef(false);

  const workDurationRef = useRef(workDuration);
  const breakDurationRef = useRef(breakDuration);
  workDurationRef.current = workDuration;
  breakDurationRef.current = breakDuration;

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, mode]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning && !alarmFiredRef.current) {
      alarmFiredRef.current = true;
      setIsRunning(false);
      setIsPendingTransition(true);
      startAlarm();
    } else if (secondsLeft > 0) {
      alarmFiredRef.current = false;
    }
  }, [secondsLeft, isRunning, startAlarm]);

  const confirmTransition = useCallback(() => {
    stopAlarm();
    setIsPendingTransition(false);
    setMode((prev) => {
      const next: Mode = prev === "work" ? "break" : "work";
      setSecondsLeft(next === "work" ? workDurationRef.current * 60 : breakDurationRef.current * 60);
      return next;
    });
    setIsRunning(true);
  }, [stopAlarm]);

  const skipToNext = useCallback(() => {
    stopAlarm();
    alarmFiredRef.current = false;
    setIsRunning(false);
    setIsPendingTransition(false);
    setMode((prev) => {
      const next: Mode = prev === "work" ? "break" : "work";
      setSecondsLeft(next === "work" ? workDurationRef.current * 60 : breakDurationRef.current * 60);
      return next;
    });
  }, [stopAlarm]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    stopAlarm();
    setIsRunning(false);
    setIsPendingTransition(false);
    setMode("work");
    alarmFiredRef.current = false;
    setSecondsLeft(workDurationRef.current * 60);
  }, [stopAlarm]);

  const setWorkDuration = useCallback((minutes: number) => {
    const valid = Math.max(1, Math.floor(minutes));
    setWorkDurationState(valid);
    workDurationRef.current = valid;
    stopAlarm();
    setIsRunning(false);
    setIsPendingTransition(false);
    setMode("work");
    alarmFiredRef.current = false;
    setSecondsLeft(valid * 60);
  }, [stopAlarm]);

  const setBreakDuration = useCallback((minutes: number) => {
    const valid = Math.max(1, Math.floor(minutes));
    setBreakDurationState(valid);
    breakDurationRef.current = valid;
  }, []);

  return {
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
  };
}
