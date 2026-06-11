import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartSummaryPill, REPORT_COLORS, ReportTooltip } from './chartUtils';
import { ReportChartCard } from './ReportChartCard';

export function TaskStatusChart({ data = [] }) {
  const rows = Array.isArray(data) ? data : [];
  const chartRows = rows.length
    ? [
        {
          name: 'Tasks',
          completed: Number(rows.find((item) => item.name === 'completed')?.value || rows.find((item) => item.label === 'Completed')?.value || 0),
          inProgress: Number(rows.find((item) => item.name === 'inProgress')?.value || rows.find((item) => item.label === 'In Progress')?.value || 0),
          pending: Number(rows.find((item) => item.name === 'pending')?.value || rows.find((item) => item.label === 'Pending')?.value || 0),
          overdue: Number(rows.find((item) => item.name === 'overdue')?.value || rows.find((item) => item.label === 'Overdue')?.value || 0),
        },
      ]
    : [];

  const total = chartRows.length
    ? chartRows.reduce((sum, row) => sum + Number(row.completed || 0) + Number(row.inProgress || 0) + Number(row.pending || 0) + Number(row.overdue || 0), 0)
    : 0;
  const tiles = [
    { key: 'completed', label: 'Completed', value: chartRows[0]?.completed || 0, color: REPORT_COLORS.emerald },
    { key: 'inProgress', label: 'In Progress', value: chartRows[0]?.inProgress || 0, color: REPORT_COLORS.blue },
    { key: 'pending', label: 'Pending', value: chartRows[0]?.pending || 0, color: REPORT_COLORS.amber },
    { key: 'overdue', label: 'Overdue', value: chartRows[0]?.overdue || 0, color: REPORT_COLORS.rose },
  ];

  return (
    <ReportChartCard
      title="Task progress"
      description="Completed, in progress, pending, and overdue tasks in one stacked view."
      emptyLabel="No task progress data."
      hasData={chartRows.length > 0 && total > 0}
      metric={<ChartSummaryPill label="Tasks" value={total.toLocaleString('en-IN')} tone="violet" />}
      heightClassName="min-h-[380px] p-5"
    >
      <div className="grid h-full min-h-[340px] gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartRows} margin={{ top: 12, right: 12, left: 12, bottom: 12 }}>
              <defs>
                <linearGradient id="completedTaskFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={REPORT_COLORS.emerald} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={REPORT_COLORS.emerald} stopOpacity={0.72} />
                </linearGradient>
                <linearGradient id="progressTaskFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={REPORT_COLORS.blue} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={REPORT_COLORS.blue} stopOpacity={0.72} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={REPORT_COLORS.grid} opacity={0.7} vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip content={<ReportTooltip />} />
              <Legend verticalAlign="bottom" align="center" iconType="circle" formatter={(value) => <span className="text-xs text-slate-500">{value}</span>} />
              <Bar dataKey="completed" name="Completed" stackId="a" fill="url(#completedTaskFill)" radius={[0, 0, 12, 12]} />
              <Bar dataKey="inProgress" name="In Progress" stackId="a" fill="url(#progressTaskFill)" />
              <Bar dataKey="pending" name="Pending" stackId="a" fill={REPORT_COLORS.amber} />
              <Bar dataKey="overdue" name="Overdue" stackId="a" fill={REPORT_COLORS.rose} radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        <div className="grid content-start gap-2">
          {tiles.map((tile) => (
            <div key={tile.key} className="rounded-2xl border border-[rgb(var(--line)/0.12)] bg-white/70 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: tile.color }} />
                  {tile.label}
                </div>
                <div className="text-sm font-bold text-[rgb(var(--text))]">{tile.value.toLocaleString('en-IN')}</div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full" style={{ width: `${total ? Math.min(100, (tile.value / total) * 100) : 0}%`, backgroundColor: tile.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ReportChartCard>
  );
}
