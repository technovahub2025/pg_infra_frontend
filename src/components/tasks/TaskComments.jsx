import { useState } from 'react';
import { format } from 'date-fns';
import { MessageSquareText, SendHorizonal } from 'lucide-react';
import { Button } from '../ui/button';

export function TaskComments({ comments = [], onAdd, maxHeightClassName = 'max-h-80' }) {
  const [text, setText] = useState('');
  const sortedComments = [...comments].sort((left, right) => new Date(left.timestamp || left.createdAt || 0).getTime() - new Date(right.timestamp || right.createdAt || 0).getTime());

  async function handleAdd() {
    const nextText = text.trim();
    if (!nextText) return;
    await onAdd?.(nextText);
    setText('');
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/50">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded-2xl bg-sky-500/10 p-2 text-sky-600">
            <MessageSquareText className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[rgb(var(--text))]">Comments</div>
            <div className="text-xs text-slate-500">{sortedComments.length} update{sortedComments.length === 1 ? '' : 's'}</div>
          </div>
        </div>
      </div>

      <div className={`scrollbar-none overflow-y-auto px-4 py-3 ${maxHeightClassName}`}>
        {sortedComments.length ? (
          <div className="space-y-3">
            {sortedComments.map((comment, index) => {
              const author = comment.user?.name || comment.userName || 'Team member';
              const timestamp = formatCommentTime(comment.timestamp || comment.createdAt);
              return (
                <div key={`${comment.timestamp || comment.createdAt || index}-${index}`} className="rounded-2xl border border-slate-200/70 bg-white/80 p-3 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-slate-700">{author}</div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{timestamp}</div>
                  </div>
                  <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{comment.text}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-8 text-center text-sm text-slate-500">
            No comments yet. Add the first update for this task.
          </div>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-white/10 bg-white/80 p-3 backdrop-blur">
        <div className="flex gap-2">
          <input
            className="input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Add a clear task update..."
          />
          <Button type="button" disabled={!text.trim()} onClick={handleAdd}>
            <SendHorizonal className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatCommentTime(value) {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return format(date, 'dd MMM, hh:mm a');
}
