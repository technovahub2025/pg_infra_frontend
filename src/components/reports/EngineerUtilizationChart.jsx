import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartSummaryPill, REPORT_COLORS, ReportTooltip, formatHours, truncateChartLabel } from './chartUtils';
import { ReportChartCard } from './ReportChartCard';

export function EngineerUtilizationChart({ data = [] }) {
  const allRows = Array.isArray(data)
    ? data.map((row) => ({
        name: row.name,
        utilization: Number(row.utilization ?? 0),
        hours: Number(row.hours ?? 0),
        projects: Number(row.projects ?? 0),
      }))
    : [];
  const rows = allRows
    .slice()
    .sort((a, b) => Number(b.utilization || 0) - Number(a.utilization || 0))
    .slice(0, 8);
  const hasData = rows.some((row) => row.utilization > 0 || row.hours > 0 || row.projects > 0);
  const totalHours = allRows.reduce((sum, row) => sum + Number(row.hours || 0), 0);

  return (
    <ReportChartCard
      title="Employee utilization"
      description="Relative share of logged hours across active engineers."
      emptyLabel="No utilization data."
      hasData={hasData}
      heightClassName="min-h-[380px] p-5"
      metric={<ChartSummaryPill label="Hours" value={formatHours(totalHours)} tone="violet" />}
      footer={allRows.length > rows.length ? <div className="pt-3 text-xs text-slate-500">Showing top {rows.length} of {allRows.length}. Export includes all employees.</div> : null}
    >
      <div className="grid h-full min-h-[340px] gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 18, left: 16, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={REPORT_COLORS.grid} opacity={0.72} horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => truncateChartLabel(value, 14)}
              />
              <Tooltip content={<ReportTooltip percent />} />
              <Legend verticalAlign="bottom" align="center" iconType="circle" />
              <Bar dataKey="utilization" name="Utilization" fill={REPORT_COLORS.violet} radius={[0, 12, 12, 0]} />
            </BarChart>
        </ResponsiveContainer>
        <div className="hidden min-h-0 rounded-2xl border border-[rgb(var(--line)/0.12)] bg-white/50 p-3 lg:block">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Top contributors</div>
          <div className="scrollbar-none mt-3 max-h-[286px] space-y-2 overflow-y-auto pr-1">
            {rows.map((row) => (
              <div key={row.name} className="rounded-xl bg-white/70 p-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-[rgb(var(--text))]">{row.name}</span>
                  <span className="text-violet-600">{row.utilization.toFixed(1)}%</span>
                </div>
                <div className="mt-1 text-slate-500">{formatHours(row.hours)} - {row.projects} tasks</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReportChartCard>
  );
}
