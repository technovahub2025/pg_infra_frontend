import { useState } from 'react';
import { Button } from '../ui/button';

export function KanbanAddCard({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  if (!open) {
    return (
      <button type="button" className="flex w-full items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400" onClick={() => setOpen(true)}>
        + Add task
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <input className="input" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" />
      <div className="mt-3 flex gap-2">
        <Button type="button" size="sm" onClick={() => { onAdd?.(title); setTitle(''); setOpen(false); }}>Add</Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}

