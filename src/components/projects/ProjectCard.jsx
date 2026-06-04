import { Badge } from '../ui/badge';
import { Card, CardBody } from '../ui/card';
import { ProjectStatusBadge } from './ProjectStatusBadge';

export function ProjectCard({ project, onClick, onEdit, onDelete }) {
  return (
    <Card className="cursor-pointer transition hover:translate-y-[-1px]" onClick={onClick}>
      <CardBody>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold text-[rgb(var(--text))]">{project.projectName}</div>
            <div className="mt-1 text-xs text-slate-400">{project.clientName}</div>
          </div>
          <Badge tone="slate">{project.companySegment || 'General'}</Badge>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <ProjectStatusBadge value={project.overallStatus} />
          <Badge tone="amber">{project.priority}</Badge>
        </div>
        <div className="mt-4 space-y-1 text-sm text-slate-400">
          <div>{project.location}</div>
          <div>{project.currentStage}</div>
        </div>
        {(onEdit || onDelete) ? (
          <div className="mt-4 flex gap-2">
            {onEdit ? <button type="button" className="text-xs text-sky-300" onClick={(event) => { event.stopPropagation(); onEdit(project); }}>Edit</button> : null}
            {onDelete ? <button type="button" className="text-xs text-rose-300" onClick={(event) => { event.stopPropagation(); onDelete(project); }}>Delete</button> : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

