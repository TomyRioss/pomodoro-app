"use client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskForm, type Task } from "./TaskForm";
import { TaskItem } from "./TaskItem";

interface Props {
  tasks: Task[];
  onAdd: (task: Task) => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => boolean;
  onReorder: (tasks: Task[]) => void;
}

export function TaskList({ tasks, onAdd, onToggle, onRemove, onRename, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const from = tasks.findIndex((t) => t.id === active.id);
    const to = tasks.findIndex((t) => t.id === over.id);
    if (from !== -1 && to !== -1) onReorder(arrayMove(tasks, from, to));
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

      <TaskForm onAdd={onAdd} />

      {tasks.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col gap-1.5 mt-1">
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggle} onRemove={onRemove} onRename={onRename} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      {tasks.length === 0 && (
        <p className="text-xs text-center py-4 text-muted-foreground">No tasks yet, add one above</p>
      )}
    </div>
  );
}
