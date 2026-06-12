import { Check, Minus, Trash2 } from 'lucide-react';
import { DataTable } from '../shared/DataTable';
import { Badge } from '../ui/badge';
import { KanbanActionsMenu } from '../kanban/KanbanActionsMenu';
import { formatDuration } from '../../store/timerStore';

function safeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatDate(value) {
  const date = safeDate(value);
  return date ? date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
}

function formatTime(value) {
  const date = safeDate(value);
  return date ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-';
}

function SelectionCheckbox({ checked = false, indeterminate = false, onChange, label }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? 'mixed' : checked}
      aria-label={label}
      onClick={() => onChange?.(!checked)}
      className={`inline-flex h-5 w-5 items-center justify-center rounded-[6px] border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 ${
        checked || indeterminate
          ? 'border-sky-500 bg-sky-500 text-white shadow-[0_8px_18px_rgba(14,165,233,0.24)]'
          : 'border-[rgb(var(--line)/0.22)] bg-white text-transparent hover:border-sky-300 hover:bg-sky-50'
      }`}
    >
      {indeterminate ? <Minus className="h-3.5 w-3.5" /> : checked ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-[3px] bg-transparent" />}
    </button>
  );
}

export function TimesheetTable({
  rows = [],
  selectedIds = [],
  onToggleRow,
  onToggleAll,
  onDelete,
  onToggleBillable,
  canEditBillable = false,
  canDelete = false,
  showSelectionColumn = false,
  scrollClassName = '',
}) {
  const allSelected = rows.length > 0 && rows.every((row) => selectedIds.includes(String(row.id || row._id)));
  const someSelected = rows.some((row) => selectedIds.includes(String(row.id || row._id)));
  const selectionColumns = showSelectionColumn
    ? [
        {
          key: 'select',
          label: (
            <SelectionCheckbox
              checked={allSelected}
              indeterminate={!allSelected && someSelected}
              onChange={(nextChecked) => onToggleAll?.(nextChecked)}
              label="Select all rows"
            />
          ),
          render: (row) => (
            <SelectionCheckbox
              checked={selectedIds.includes(String(row.id || row._id))}
              onChange={() => onToggleRow?.(row.id || row._id)}
              label={`Select row ${row.id || row._id}`}
            />
          ),
          className: 'w-12',
        },
      ]
    : [];

  return (
    <DataTable
      columns={[
        ...selectionColumns,
        { key: 'date', label: 'Date', render: (row) => formatDate(row.date || row.startTime) },
        { key: 'project', label: 'Project', render: (row) => row.project?.projectName || row.projectName || '-' },
        { key: 'task', label: 'Task', render: (row) => row.task?.title || row.taskTitle || '-' },
        { key: 'start', label: 'Start', render: (row) => formatTime(row.startTime) },
        { key: 'end', label: 'Stop', render: (row) => formatTime(row.endTime) },
        { key: 'duration', label: 'Duration', render: (row) => formatDuration(row.duration) },
        { key: 'billable', label: 'Billable', render: (row) => <Badge tone={row.isBillable ? 'green' : 'slate'}>{row.isBillable ? 'Yes' : 'No'}</Badge> },
        { key: 'manual', label: 'Manual', hideOnMobile: true, render: (row) => <Badge tone={row.isManual ? 'amber' : 'slate'}>{row.isManual ? 'Yes' : 'No'}</Badge> },
        { key: 'note', label: 'Note', hideOnMobile: true, render: (row) => row.note || '-' },
        {
          key: 'actions',
          label: 'Actions',
          render: (row) => (
            <KanbanActionsMenu
              items={[
                canEditBillable
                  ? {
                      key: 'toggle-billable',
                      label: row.isBillable ? 'Mark non-billable' : 'Mark billable',
                      onClick: () => onToggleBillable?.(row),
                    }
                  : null,
                canDelete
                  ? {
                      key: 'delete',
                      label: 'Delete',
                      icon: Trash2,
                      tone: 'danger',
                      onClick: () => onDelete?.(row),
                    }
                  : null,
              ].filter(Boolean)}
              align="right"
              triggerClassName="h-10 w-10 rounded-xl border border-[rgb(var(--line)/0.18)] bg-white/95 px-0 text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
            />
          ),
        },
      ]}
      rows={rows}
      rowKey={(row) => row.id || row._id}
      emptyMessage="No time logs found."
      scrollClassName={scrollClassName}
      scrollAxis="y"
      stickyHeader
      onRowClick={(row) => onToggleRow?.(row.id || row._id)}
      rowClassName={(row) => (selectedIds.includes(String(row.id || row._id)) ? 'bg-sky-50/70' : '')}
    />
  );
}
