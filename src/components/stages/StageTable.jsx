import { format, parseISO } from 'date-fns';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DataTable } from '../shared/DataTable';

function formatDate(value) {
  if (!value) return '-';
  const date = typeof value === 'string' ? parseISO(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return format(date, 'dd MMM yyyy');
}

export function StageTable({ rows = [], onEdit, onDelete, onApprove, onReject }) {
  return (
    <DataTable
      columns={[
        { key: 'stageNo', label: 'Stage No', render: (row) => <span className="whitespace-nowrap">{row.stageNo}</span> },
        { key: 'stageName', label: 'Stage Name', render: (row) => <span className="font-medium text-[rgb(var(--text))]">{row.stageName}</span> },
        { key: 'stageDescription', label: 'Description', render: (row) => <span className="block max-w-[180px] truncate">{row.stageDescription || '-'}</span> },
        { key: 'stageStart', label: 'Start', render: (row) => <span className="whitespace-nowrap text-slate-400">{formatDate(row.stageStart)}</span> },
        { key: 'stageEndPlanned', label: 'End (Planned)', render: (row) => <span className="whitespace-nowrap text-slate-400">{formatDate(row.stageEndPlanned)}</span> },
        { key: 'stageEndActual', label: 'End (Actual)', render: (row) => <span className="whitespace-nowrap text-slate-400">{formatDate(row.stageEndActual)}</span> },
        {
          key: 'stageStatus',
          label: 'Status',
          render: (row) => <Badge tone={row.stageStatus === 'Completed' ? 'green' : row.stageStatus === 'In Progress' ? 'blue' : 'amber'}>{row.stageStatus}</Badge>,
        },
        { key: 'deliverable', label: 'Deliverable', render: (row) => <span className="block max-w-[160px] truncate">{row.deliverable || '-'}</span> },
        { key: 'submittedToClientOn', label: 'Submitted On', render: (row) => <span className="whitespace-nowrap text-slate-400">{formatDate(row.submittedToClientOn)}</span> },
        { key: 'clientApprovalStatus', label: 'Client Approval', render: (row) => <span className="whitespace-nowrap">{row.clientApprovalStatus || '-'}</span> },
        { key: 'clientApprovalDate', label: 'Approval Date', render: (row) => <span className="whitespace-nowrap text-slate-400">{formatDate(row.clientApprovalDate)}</span> },
        { key: 'clientComments', label: 'Client Comments', render: (row) => <span className="block max-w-[180px] truncate">{row.clientComments || '-'}</span> },
        { key: 'nextAction', label: 'Next Action', render: (row) => <span className="block max-w-[160px] truncate">{row.nextAction || '-'}</span> },
        {
          key: 'actions',
          label: 'Actions',
          render: (row) => (
            <div className="flex flex-wrap gap-2">
              {onApprove ? <Button size="sm" variant="secondary" onClick={() => onApprove(row)}>Approve</Button> : null}
              {onReject ? <Button size="sm" variant="secondary" onClick={() => onReject(row)}>Reject</Button> : null}
              {onEdit ? <Button size="sm" variant="secondary" onClick={() => onEdit(row)}>Edit</Button> : null}
              {onDelete ? <Button size="sm" variant="danger" onClick={() => onDelete(row)}>Delete</Button> : null}
            </div>
          ),
        },
      ]}
      rows={rows}
      rowKey={(row) => row.id}
      emptyMessage="No stage records yet."
    />
  );
}
