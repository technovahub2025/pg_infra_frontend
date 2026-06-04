import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DataTable } from '../shared/DataTable';
import { formatDuration } from '../../store/timerStore';

function safeDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date;
}

export function TimerLog({ logs = [], onDelete }) {
  return (
    <DataTable
      columns={[
        { key: 'date', label: 'Date', render: (row) => format(safeDate(row.date || row.startTime), 'dd MMM yyyy') },
        { key: 'task', label: 'Task', render: (row) => row.task?.title || row.task?.name || '-' },
        { key: 'project', label: 'Project', render: (row) => row.project?.projectName || row.project?.name || '-' },
        { key: 'start', label: 'Start', render: (row) => format(safeDate(row.startTime), 'hh:mm a') },
        { key: 'end', label: 'Stop', render: (row) => (row.endTime ? format(safeDate(row.endTime), 'hh:mm a') : '-') },
        { key: 'duration', label: 'Duration', render: (row) => formatDuration(row.duration) },
        { key: 'note', label: 'Note', hideOnMobile: true, render: (row) => row.note || '-' },
        { key: 'manual', label: 'Manual', hideOnMobile: true, render: (row) => <Badge tone={row.isManual ? 'amber' : 'slate'}>{row.isManual ? 'Yes' : 'No'}</Badge> },
        {
          key: 'actions',
          label: 'Delete',
          render: (row) => (
            <Button size="sm" variant="danger" onClick={() => onDelete?.(row)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          ),
        },
      ]}
      rows={logs}
      rowKey={(row) => row.id || row._id}
      emptyMessage="No time logs found."
    />
  );
}
