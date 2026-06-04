import { useState } from 'react';
import { Button } from '../ui/button';

export function TaskComments({ comments = [], onAdd }) {
  const [text, setText] = useState('');

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {comments.map((comment, index) => (
          <div key={`${comment.timestamp || index}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
            {comment.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="input" value={text} onChange={(event) => setText(event.target.value)} placeholder="Add comment" />
        <Button type="button" onClick={() => { onAdd?.(text); setText(''); }}>Add</Button>
      </div>
    </div>
  );
}

