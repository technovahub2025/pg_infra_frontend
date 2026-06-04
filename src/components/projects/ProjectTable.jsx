import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { DataTable } from '../shared/DataTable';
import { ProjectStatusBadge } from './ProjectStatusBadge';

export function ProjectTable({ rows = [], onEdit, onDelete }) {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const columns = useMemo(() => ([
    {
      key: 'projectName',
      label: 'Project',
      render: (row) => (
        <button type="button" onClick={() => navigate(`/projects/${row.id}`)} className="text-left">
          <div className="font-semibold text-[rgb(var(--text))]">{row.projectName}</div>
          <div className="text-xs text-slate-400">{row.clientName}</div>
        </button>
      ),
    },
    { key: 'companySegment', label: 'Segment', hideOnMobile: true },
    { key: 'location', label: 'Location', hideOnMobile: true },
    {
      key: 'overallStatus',
      label: 'Status',
      render: (row) => <ProjectStatusBadge value={row.overallStatus} />,
    },
    {
      key: 'priority',
      label: 'Priority',
      hideOnMobile: true,
      render: (row) => <Badge tone={row.priority === 'Critical' ? 'rose' : row.priority === 'High' ? 'amber' : row.priority === 'Low' ? 'green' : 'blue'}>{row.priority}</Badge>,
    },
    { key: 'currentStage', label: 'Stage' },
    { key: 'stageCompletion', label: 'Completion', hideOnMobile: true, render: (row) => `${row.stageCompletion}%` },
    { key: 'invoiceStatus', label: 'Billing', hideOnMobile: true },
    {
      key: 'actions',
      label: 'Actions',
      className: 'w-[72px] whitespace-nowrap text-right',
      render: (row) => {
        const isOpen = openMenuId === row.id;
        return (
          <div className="relative inline-flex justify-end" ref={isOpen ? menuRef : null}>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 rounded-full px-0"
              onClick={(event) => {
                event.stopPropagation();
                setOpenMenuId((current) => (current === row.id ? null : row.id));
              }}
              aria-label="Project actions"
              title="Project actions"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {isOpen ? (
              <div className="absolute right-0 top-10 z-20 min-w-32 rounded-2xl border border-[rgb(var(--line)/0.16)] bg-[rgb(var(--panel)/0.98)] p-2 shadow-2xl backdrop-blur">
                {onEdit ? (
                  <button
                    type="button"
                    className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-[rgb(var(--text))] transition hover:bg-[rgb(var(--panel-2)/0.82)]"
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenMenuId(null);
                      onEdit(row);
                    }}
                  >
                    Edit
                  </button>
                ) : null}
                <button
                  type="button"
                  className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-[rgb(var(--text))] transition hover:bg-[rgb(var(--panel-2)/0.82)]"
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenMenuId(null);
                    navigate(`/projects/${row.id}`);
                  }}
                >
                  View
                </button>
                {onDelete ? (
                  <button
                    type="button"
                    className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-rose-400 transition hover:bg-rose-500/10"
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenMenuId(null);
                      onDelete(row);
                    }}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      },
    },
  ]), [navigate, onDelete, onEdit, openMenuId]);

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      emptyMessage="No projects found."
      scrollClassName="max-h-[calc(100vh-25rem)] overflow-auto pr-1"
      stickyHeader
    />
  );
}
