"use client";
import { useState, useEffect } from "react";
import { X, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { TaskForm, type Task } from "./TaskForm";

const GREEN = "#A8D5A2";
const STORAGE_KEY = "pomodoro-tasks";

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch (err) {
    console.error("Failed to load tasks:", err);
    toast.error("Could not load saved tasks.");
    return [];
  }
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  function save(updated: Task[]) {
    try {
      setTasks(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save tasks:", err);
      toast.error("Could not save tasks.");
    }
  }

  function addTask(task: Task) {
    save([...tasks, task]);
  }

  function toggleTask(id: string) {
    save(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id: string) {
    save(tasks.filter((t) => t.id !== id));
  }

  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Tasks</h2>
        {tasks.length > 0 && (
          <span className="text-xs text-muted-foreground font-mono">{done}/{tasks.length}</span>
        )}
      </div>

      <TaskForm onAdd={addTask} />

      {tasks.length > 0 && (
        <ul className="flex flex-col gap-1.5 mt-1">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors"
              style={{
                background: task.done ? `${GREEN}33` : "transparent",
                borderColor: task.done ? `${GREEN}88` : "rgba(0,0,0,0.08)",
              }}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="flex-shrink-0 transition-colors cursor-pointer"
                style={{ color: task.done ? "#4a8a45" : "#aaa" }}
              >
                {task.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
              </button>
              <span
                className="flex-1 text-sm"
                style={{
                  color: task.done ? "#6b7280" : "#1a1a1a",
                  textDecoration: task.done ? "line-through" : "none",
                }}
              >
                {task.name}
              </span>
              <span className="text-xs font-mono text-muted-foreground">{task.estimatedMinutes}m</span>
              <button
                onClick={() => removeTask(task.id)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {tasks.length === 0 && (
        <p className="text-xs text-center py-4 text-muted-foreground">No tasks yet — add one above</p>
      )}
    </div>
  );
}
