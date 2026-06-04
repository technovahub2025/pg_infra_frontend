import { Badge } from '../ui/badge';

export function ProjectStatusBadge({ value }) {
  const tone =
    value === 'Completed' || value === 'done'
      ? 'green'
      : value === 'On Hold' || value === 'hold'
        ? 'amber'
        : value === 'Cancelled'
          ? 'rose'
          : 'blue';

  return <Badge tone={tone}>{value}</Badge>;
}

