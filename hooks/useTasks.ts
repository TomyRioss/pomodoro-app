"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { Task } from "@/components/TaskForm";

const STORAGE_KEY = "pomodoro-tasks";
const RESET_DAY_KEY = "pomodoro-tasks-reset-day";
const RESET_HOUR = 4; // tasks reset daily at 4am local time

function currentResetDay(): string {
  const d = new Date(Date.now() - RESET_HOUR * 60 * 60 * 1000);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const today = currentResetDay();
    const lastDay = localStorage.getItem(RESET_DAY_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    const tasks: Task[] = (raw ? (JSON.parse(raw) as Task[]) : []).map((t) => ({
      ...t,
      workedSeconds: t.workedSeconds ?? 0,
    }));
    if (lastDay !== today) {
      localStorage.setItem(RESET_DAY_KEY, today);
      const reset = tasks.map((t) => ({ ...t, done: false, workedSeconds: 0 }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
      return reset;
    }
    return tasks;
  } catch (err) {
    console.error("Failed to load tasks:", err);
    toast.error("Could not load saved tasks.");
    return [];
  }
}

export function remainingSeconds(task: Task): number {
  return Math.max(0, task.estimatedMinutes * 60 - task.workedSeconds);
}

/** Spends worked seconds on pending tasks top -> bottom, completing each one that reaches 0. */
export function applyWork(tasks: Task[], seconds: number): Task[] {
  let left = seconds;
  return tasks.map((t) => {
    if (t.done || left <= 0) return t;
    const spent = Math.min(left, remainingSeconds(t));
    left -= spent;
    const workedSeconds = t.workedSeconds + spent;
    return { ...t, workedSeconds, done: workedSeconds >= t.estimatedMinutes * 60 };
  });
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const tasksRef = useRef<Task[]>([]);

  useEffect(() => {
    const loaded = loadTasks();
    tasksRef.current = loaded;
    setTasks(loaded);
  }, []);

  const save = useCallback((updated: Task[]): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      tasksRef.current = updated;
      setTasks(updated);
      return true;
    } catch (err) {
      console.error("Failed to save tasks:", err);
      toast.error("Could not save tasks.");
      return false;
    }
  }, []);

  const addTask = useCallback((task: Task) => save([...tasksRef.current, task]), [save]);

  const toggleTask = useCallback(
    (id: string) => save(tasksRef.current.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    [save],
  );

  const removeTask = useCallback(
    (id: string) => save(tasksRef.current.filter((t) => t.id !== id)),
    [save],
  );

  const renameTask = useCallback(
    (id: string, name: string) => save(tasksRef.current.map((t) => (t.id === id ? { ...t, name } : t))),
    [save],
  );

  const reorderTasks = useCallback((updated: Task[]) => save(updated), [save]);

  const addWorkedSeconds = useCallback(
    (seconds: number) => {
      if (seconds <= 0 || !tasksRef.current.some((t) => !t.done)) return;
      save(applyWork(tasksRef.current, seconds));
    },
    [save],
  );

  /** Remaining minutes of the first pending task, or null if none. */
  const getNextTaskMinutes = useCallback((): number | null => {
    const next = tasksRef.current.find((t) => !t.done);
    return next ? Math.max(1, Math.ceil(remainingSeconds(next) / 60)) : null;
  }, []);

  return { tasks, addTask, toggleTask, removeTask, renameTask, reorderTasks, addWorkedSeconds, getNextTaskMinutes };
}
