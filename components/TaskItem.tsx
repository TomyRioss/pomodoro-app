"use client";
import { useState } from "react";
import { X, CheckCircle2, Circle, Pencil, Check, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "./TaskForm";
import { remainingSeconds } from "@/hooks/useTasks";

const GREEN = "#A8D5A2";
const ICON_BTN =
  "flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => boolean;
}

export function TaskItem({ task, onToggle, onRemove, onRename }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  function startEditing() {
    setName(task.name);
    setEditing(true);
  }

  function saveName() {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Task name cannot be empty.");
      return;
    }
    if (onRename(task.id, trimmed)) setEditing(false);
  }

  const remainingMin = Math.ceil(remainingSeconds(task) / 60);

  return (
    <li
      ref={setNodeRef}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors bg-white/60 ${isDragging ? "relative z-10 shadow-md" : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        background: task.done ? `${GREEN}33` : undefined,
        borderColor: task.done ? `${GREEN}88` : "rgba(0,0,0,0.08)",
      }}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={`Reorder task: ${task.name}`}
        className={`${ICON_BTN} cursor-grab active:cursor-grabbing touch-none`}
      >
        <GripVertical size={14} />
      </button>
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 transition-colors cursor-pointer"
        style={{ color: task.done ? "#4a8a45" : "#aaa" }}
      >
        {task.done ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      </button>
      {editing ? (
        <input
          autoFocus
          aria-label="Task name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              saveName();
            }
            if (e.key === "Escape") setEditing(false);
          }}
          className="min-w-0 flex-1 rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      ) : (
        <span
          className="min-w-0 flex-1 text-sm"
          style={{
            color: task.done ? "#6b7280" : "#1a1a1a",
            textDecoration: task.done ? "line-through" : "none",
          }}
        >
          {task.name}
        </span>
      )}
      <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
        {task.workedSeconds > 0 && !task.done ? `${remainingMin}/${task.estimatedMinutes}m` : `${task.estimatedMinutes}m`}
      </span>
      {editing ? (
        <>
          <button type="button" onClick={saveName} aria-label="Save task name" title="Save task name" className={ICON_BTN}>
            <Check size={14} />
          </button>
          <button type="button" onClick={() => setEditing(false)} aria-label="Cancel editing task name" title="Cancel" className={ICON_BTN}>
            <X size={13} />
          </button>
        </>
      ) : (
        <>
          <button type="button" onClick={startEditing} aria-label={`Edit task name: ${task.name}`} title="Edit task name" className={ICON_BTN}>
            <Pencil size={13} />
          </button>
          <button type="button" onClick={() => onRemove(task.id)} aria-label={`Delete task: ${task.name}`} title="Delete task" className={ICON_BTN}>
            <X size={13} />
          </button>
        </>
      )}
    </li>
  );
}
