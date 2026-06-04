import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardBody } from '../ui/card';

export function TeamMemberCard({ member, onEdit, onChangeRole, onRemove }) {
  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold text-white">
            {(member.name || 'T')[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-[rgb(var(--text))]">{member.name}</div>
            <div className="mt-1 text-xs text-slate-500">{member.designation || 'Member'}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="blue">{member.role}</Badge>
              <Badge tone="slate">{member.department || 'Unassigned'}</Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => onEdit?.(member)}>Edit</Button>
          <Button size="sm" variant="secondary" onClick={() => onChangeRole?.(member)}>Role</Button>
          <Button size="sm" variant="danger" onClick={() => onRemove?.(member)}>Remove</Button>
        </div>
      </CardBody>
    </Card>
  );
}
