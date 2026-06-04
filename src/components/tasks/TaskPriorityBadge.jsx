import { Badge } from '../ui/badge';

export function TaskPriorityBadge({ value }) {
  const tone = String(value).toLowerCase() === 'critical' ? 'rose' : String(value).toLowerCase() === 'high' ? 'amber' : String(value).toLowerCase() === 'low' ? 'green' : 'blue';
  return <Badge tone={tone}>{value}</Badge>;
}

