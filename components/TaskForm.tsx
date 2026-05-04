"use client";
import { useState } from "react";

const RED = "#E8A0A0";

export interface Task {
  id: string;
  name: string;
  estimatedMinutes: number;
  done: boolean;
}

interface Props {
  onAdd: (task: Task) => void;
}

export function TaskForm({ onAdd }: Props) {
  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState("25");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    const mins = parseInt(minutes, 10);
    if (!trimmed || isNaN(mins) || mins < 1) return;
    onAdd({
      id: crypto.randomUUID(),
      name: trimmed,
      estimatedMinutes: mins,
      done: false,
    });
    setName("");
    setMinutes("25");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        type="text"
        placeholder="Task name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-3 py-1.5 rounded-sm border text-sm"
        style={{ borderColor: "rgba(0,0,0,0.15)", background: "#ffffff", color: "#1a1a1a" }}
      />
      <input
        type="number"
        min={1}
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        className="w-16 px-2 py-1.5 rounded-sm border text-center text-sm font-mono"
        style={{ borderColor: "rgba(0,0,0,0.15)", background: "#ffffff", color: "#1a1a1a" }}
        title="Estimated minutes"
      />
      <button
        type="submit"
        className="px-4 py-1.5 rounded font-semibold text-sm"
        style={{ background: RED, color: "#1a1a1a", border: "none" }}
      >
        Add
      </button>
    </form>
  );
}
