import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { Clock3, TimerReset } from 'lucide-react';
import { Badge } from '../ui/badge';

export function TaskCountdown({ dueDate }) {
  if (!dueDate) return <Badge tone="slate">No due date</Badge>;
  const parsed = parseISO(dueDate);
  if (Number.isNaN(parsed.getTime())) return <Badge tone="slate">No due date</Badge>;
  const diff = parsed.getTime() - Date.now();
  const label = diff < 0 ? `Overdue by ${formatDistanceToNowStrict(parsed)}` : `Due in ${formatDistanceToNowStrict(parsed)}`;
  const tone = diff < 0 ? 'rose' : diff <= 48 * 60 * 60 * 1000 ? 'amber' : 'blue';
  const Icon = diff < 0 ? TimerReset : Clock3;
  return (
    <Badge tone={tone}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}

