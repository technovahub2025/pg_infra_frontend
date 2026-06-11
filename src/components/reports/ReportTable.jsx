import { motion } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { DataTable } from '../shared/DataTable';
import { staggerItem } from '../../utils/motionVariants';
import { cn } from '../../lib/utils';

export function ReportTable({ rows = [], onExportRow, bodyClassName = 'max-h-[560px] overflow-y-auto' }) {
  const columns = [
    {
      key: 'name',
      label: 'Report Name',
      render: (row) => (
        <div>
          <div className="font-semibold text-[rgb(var(--text))]">{row.name}</div>
          <div className="mt-1 text-xs text-slate-500">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      className: 'whitespace-nowrap text-slate-500',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge tone={row.statusTone || 'green'}>{row.status}</Badge>,
    },
    {
      key: 'exportAction',
      label: 'Export Action',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end">
          <Button size="sm" variant="secondary" onClick={() => onExportRow?.(row.key)}>
            <RefreshCcw className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div variants={staggerItem}>
      <Card className="overflow-hidden border border-[rgb(var(--line)/0.12)]">
        <CardHeader>
          <div>
            <CardTitle>Report summary</CardTitle>
            <p className="text-xs text-slate-500">
              Compact executive summary of each live report section. {rows.length} sections available.
            </p>
          </div>
        </CardHeader>
        <CardBody className="!p-0">
          <DataTable
            columns={columns}
            rows={rows}
            stickyHeader
            emptyMessage="No report summary available."
            scrollClassName={bodyClassName}
          />
        </CardBody>
      </Card>
    </motion.div>
  );
}
