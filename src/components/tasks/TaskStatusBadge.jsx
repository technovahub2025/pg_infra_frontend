import { Badge } from '../ui/badge';

export function TaskStatusBadge({ value }) {
  const tone = value === 'done' ? 'green' : value === 'in-progress' ? 'blue' : value === 'review' ? 'amber' : value === 'blocked' ? 'rose' : 'slate';
  const label = value === 'done' ? 'Done' : value === 'in-progress' ? 'In Progress' : value === 'review' ? 'In Review' : value === 'blocked' ? 'Blocked' : 'Todo';
  return <Badge tone={tone}>{label}</Badge>;
}

