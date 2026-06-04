import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { Card, CardBody } from '../ui/card';
import { TaskPriorityBadge } from '../tasks/TaskPriorityBadge';
import { TaskStatusBadge } from '../tasks/TaskStatusBadge';
import { TaskCountdown } from '../tasks/TaskCountdown';

export function KanbanCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { task } });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined, opacity: isDragging ? 0.6 : 1 }}
      {...attributes}
      {...listeners}
    >
      <Card className="shadow-lg shadow-black/10">
        <CardBody>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-[rgb(var(--text))]">{task.title}</div>
              <div className="mt-1 text-xs text-slate-400">{task.projectName}</div>
            </div>
            <GripVertical className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <TaskPriorityBadge value={task.priority} />
            <TaskStatusBadge value={task.status} />
          </div>
          <div className="mt-3 text-xs text-slate-400">{task.assigneeName || 'Unassigned'}</div>
          <div className="mt-3">
            <TaskCountdown dueDate={task.dueDate} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

