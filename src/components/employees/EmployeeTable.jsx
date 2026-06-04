import { DataTable } from '../shared/DataTable';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export function EmployeeTable({ rows = [], onEdit, onOpen, onDeactivate }) {
  return (
    <DataTable
      columns={[
        { key: 'name', label: 'Employee', render: (row) => <button type="button" className="text-left font-semibold text-[rgb(var(--text))]" onClick={() => onOpen?.(row)}>{row.name}<div className="text-xs text-slate-400">{row.employeeId || 'Pending'}</div></button> },
        { key: 'email', label: 'Email' },
        { key: 'designation', label: 'Designation' },
        { key: 'department', label: 'Department' },
        { key: 'role', label: 'Role', render: (row) => <Badge tone="slate">{row.role}</Badge> },
        { key: 'isActive', label: 'Status', render: (row) => <Badge tone={row.isActive ? 'green' : 'rose'}>{row.isActive ? 'Active' : 'Inactive'}</Badge> },
        {
          key: 'actions',
          label: 'Actions',
          render: (row) => (
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => onEdit?.(row)}>Edit</Button>
              <Button size="sm" variant="danger" onClick={() => onDeactivate?.(row)}>Deactivate</Button>
            </div>
          ),
        },
      ]}
      rows={rows}
      rowKey={(row) => row.id}
      emptyMessage="No employees found."
    />
  );
}
