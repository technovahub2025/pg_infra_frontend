import { useDroppable } from '@dnd-kit/core';
import { Badge } from '../ui/badge';
import { KanbanAddCard } from './KanbanAddCard';
import { KanbanCard } from './KanbanCard';

export function KanbanColumn({ id, title, color = '#2E83F5', tasks = [], count = 0, onAdd }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={`min-w-[320px] rounded-[1.4rem] border bg-white/5 p-3 ${isOver ? 'border-sky-400/40 ring-2 ring-sky-400/30' : 'border-white/10'}`}>
      <div className="flex items-center gap-3 border-b border-white/10 px-2 pb-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        <div className="text-sm font-semibold text-[rgb(var(--text))]">{title}</div>
        <Badge className="ml-auto">{count}</Badge>
      </div>
      <div className="mt-3 space-y-3">
        {tasks.map((task) => <KanbanCard key={task.id} task={task} />)}
        {onAdd ? <KanbanAddCard onAdd={onAdd} /> : null}
      </div>
    </div>
  );
}

