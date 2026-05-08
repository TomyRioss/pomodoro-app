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
  onPhaseComplete?: (phase: "work" | "break") => void;
}

export function useTimer({ startAlarm, stopAlarm, onPhaseComplete }: AlarmControls): TimerState & TimerActions {
  const [workDuration, setWorkDurationState] = useState(25);
  const [breakDuration, setBreakDurationState] = useState(5);
  const [mode, setMode] = useState<Mode>("work");
  const [isRunning, setIsRunning] = useState(false);
  const [isPendingTransition, setIsPendingTransition] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const alarmFiredRef = useRef(false);
  const deadlineRef = useRef<number | null>(null);
  const secondsLeftRef = useRef(25 * 60);

  const workDurationRef = useRef(workDuration);
  const breakDurationRef = useRef(breakDuration);
  workDurationRef.current = workDuration;
  breakDurationRef.current = breakDuration;

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker("/timer-worker.js");
    workerRef.current.onmessage = () => {
      if (deadlineRef.current === null) return;
      const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      secondsLeftRef.current = remaining;
      setSecondsLeft(remaining);
    };
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    if (isRunning) {
      deadlineRef.current = Date.now() + secondsLeftRef.current * 1000;
      workerRef.current?.postMessage("start");
    } else {
      workerRef.current?.postMessage("stop");
    }
  }, [isRunning, mode]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning && !alarmFiredRef.current) {
      alarmFiredRef.current = true;
      setIsRunning(false);
      setIsPendingTransition(true);
      startAlarm();
      onPhaseComplete?.(mode);
    } else if (secondsLeft > 0) {
      alarmFiredRef.current = false;
    }
  }, [secondsLeft, isRunning, startAlarm, onPhaseComplete, mode]);

  const confirmTransition = useCallback(() => {
    stopAlarm();
    setIsPendingTransition(false);
    setMode((prev) => {
      const next: Mode = prev === "work" ? "break" : "work";
      const secs = next === "work" ? workDurationRef.current * 60 : breakDurationRef.current * 60;
      secondsLeftRef.current = secs;
      deadlineRef.current = Date.now() + secs * 1000;
      setSecondsLeft(secs);
      return next;
    });
    setIsRunning(true);
  }, [stopAlarm]);

  const skipToNext = useCallback(() => {
    stopAlarm();
    alarmFiredRef.current = false;
    deadlineRef.current = null;
    setIsRunning(false);
    setIsPendingTransition(false);
    setMode((prev) => {
      const next: Mode = prev === "work" ? "break" : "work";
      const secs = next === "work" ? workDurationRef.current * 60 : breakDurationRef.current * 60;
      secondsLeftRef.current = secs;
      setSecondsLeft(secs);
      return next;
    });
  }, [stopAlarm]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => { deadlineRef.current = null; setIsRunning(false); }, []);

  const reset = useCallback(() => {
    stopAlarm();
    deadlineRef.current = null;
    setIsRunning(false);
    setIsPendingTransition(false);
    setMode("work");
    alarmFiredRef.current = false;
    const secs = workDurationRef.current * 60;
    secondsLeftRef.current = secs;
    setSecondsLeft(secs);
  }, [stopAlarm]);

  const setWorkDuration = useCallback((minutes: number) => {
    const valid = Math.max(1, Math.floor(minutes));
    setWorkDurationState(valid);
    workDurationRef.current = valid;
    stopAlarm();
    deadlineRef.current = null;
    setIsRunning(false);
    setIsPendingTransition(false);
    setMode("work");
    alarmFiredRef.current = false;
    const secs = valid * 60;
    secondsLeftRef.current = secs;
    setSecondsLeft(secs);
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
