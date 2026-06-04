import { Badge } from '../ui/badge';

export function StageTimeline({ stages = [] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {stages.map((stage, index) => (
        <div key={`${stage.stageNo}-${stage.stageName}-${index}`} className="min-w-[220px] rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="font-semibold text-[rgb(var(--text))]">{stage.stageNo}</div>
            <Badge tone={stage.stageStatus === 'Completed' ? 'green' : stage.stageStatus === 'In Progress' ? 'blue' : 'amber'}>{stage.stageStatus}</Badge>
          </div>
          <div className="mt-2 text-sm text-slate-300">{stage.stageName}</div>
          <div className="mt-2 text-xs text-slate-400">{stage.stageDescription || stage.deliverable || 'No description'}</div>
        </div>
      ))}
    </div>
  );
}

