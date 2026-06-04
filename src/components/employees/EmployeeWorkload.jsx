import { useMemo } from 'react';
import { Card, CardBody } from '../ui/card';
import { RadialProgress } from '../shared/RadialProgress';

export function EmployeeWorkload({ data }) {
  const rows = data?.projects || [];
  const totalHours = Number(data?.totalHours || 0);
  const maxHours = Math.max(...rows.map((row) => Number(row.hours || 0)), 1);

  return (
    <div className="space-y-4">
      <Card>
        <CardBody className="grid gap-4 sm:grid-cols-3">
          <Metric label="Total Hours" value={totalHours.toFixed(1)} />
          <Metric label="Projects" value={rows.length} />
          <div className="flex items-center justify-center">
            <RadialProgress value={Math.min(100, Math.round((totalHours / 40) * 100))} label="Load" />
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-[rgb(var(--text))]">{row.projectName}</div>
                <div className="text-xs text-slate-500">{row.clientName}</div>
              </div>
              <div className="text-sm text-slate-300">{Number(row.hours || 0).toFixed(1)}h</div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-sky-500" style={{ width: `${(Number(row.hours || 0) / maxHours) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-[rgb(var(--text))]">{value}</div>
    </div>
  );
}
