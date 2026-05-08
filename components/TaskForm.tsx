"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    onAdd({ id: crypto.randomUUID(), name: trimmed, estimatedMinutes: mins, done: false });
    setName("");
    setMinutes("25");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Add a task…"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <input
        type="number"
        min={1}
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
        className="w-16 px-2 py-2 rounded-lg border border-border bg-background text-center text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        title="Estimated minutes"
      />
      <Button
        type="submit"
        size="sm"
        className="rounded-lg px-3 font-semibold"
        style={{ background: RED, color: "#1a1a1a", border: "none" }}
      >
        <Plus size={15} />
      </Button>
    </form>
  );
}
