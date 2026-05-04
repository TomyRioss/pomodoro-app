"use client";
import { useState, useEffect } from "react";
import { TaskForm, type Task } from "./TaskForm";

const GREEN = "#A8D5A2";

const STORAGE_KEY = "pomodoro-tasks";

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  function save(updated: Task[]) {
    setTasks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

  return (
    <div className="w-full">
      <h2 className="font-semibold text-base mb-3" style={{ color: "#1a1a1a" }}>
        Tasks
      </h2>
      <TaskForm onAdd={addTask} />
      <ul className="mt-4 flex flex-col gap-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 px-3 py-2 rounded"
            style={{
              background: task.done ? GREEN : "#ffffff",
              border: `1px solid ${task.done ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.1)"}`,
            }}
          >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task.id)}
              className="w-4 h-4 cursor-pointer"
              style={{ accentColor: GREEN }}
            />
            <span
              className="flex-1 text-sm"
              style={{
                color: "#1a1a1a",
                textDecoration: task.done ? "line-through" : "none",
              }}
            >
              {task.name}
            </span>
            <span className="text-xs font-mono" style={{ color: "#1a1a1a" }}>
              {task.estimatedMinutes}m
            </span>
            <button
              onClick={() => removeTask(task.id)}
              className="text-xs px-1 font-bold"
              style={{ color: "#1a1a1a", background: "transparent", border: "none" }}
              title="Remove"
            >
              ✕
            </button>
          </li>
        ))}
        {tasks.length === 0 && (
          <li className="text-sm text-center py-4" style={{ color: "#1a1a1a" }}>
            No tasks yet
          </li>
        )}
      </ul>
    </div>
  );
}
