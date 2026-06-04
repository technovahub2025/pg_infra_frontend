import { Badge } from '../ui/badge';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/card';

export function StageApprovalLog({ stages = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Log</CardTitle>
      </CardHeader>
      <CardBody className="space-y-3">
        {stages.map((stage) => (
          <div key={stage.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-[rgb(var(--text))]">{stage.stageName}</div>
                <div className="text-xs text-slate-400">{stage.clientComments || stage.nextAction || 'No comments'}</div>
              </div>
              <Badge tone={stage.clientApprovalStatus === 'Approved' ? 'green' : stage.clientApprovalStatus === 'In Review' ? 'blue' : 'amber'}>
                {stage.clientApprovalStatus || 'Pending'}
              </Badge>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}

