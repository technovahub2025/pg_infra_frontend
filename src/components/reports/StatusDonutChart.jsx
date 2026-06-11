import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartSummaryPill, REPORT_COLORS, ReportTooltip } from './chartUtils';
import { ReportChartCard } from './ReportChartCard';

const DEFAULT_ORDER = ['Active', 'Completed', 'Delayed', 'On Hold'];

export function StatusDonutChart({ data = [] }) {
  const rows = Array.isArray(data)
    ? data
    : Object.entries(data || {}).map(([name, value]) => ({ name, value }));

  const normalizedRows = (rows || [])
    .map((entry, index) => ({
      name: entry.name || entry.label || DEFAULT_ORDER[index] || `Group ${index + 1}`,
      value: Number(entry.value || 0),
      color:
        entry.color ||
        ({
          Active: REPORT_COLORS.blue,
          Completed: REPORT_COLORS.emerald,
          Delayed: REPORT_COLORS.rose,
          'On Hold': REPORT_COLORS.amber,
        }[entry.name] || [REPORT_COLORS.blue, REPORT_COLORS.emerald, REPORT_COLORS.rose, REPORT_COLORS.amber][index % 4]),
    }))
    .filter((entry) => entry.value > 0);

  const total = normalizedRows.reduce((sum, row) => sum + Number(row.value || 0), 0);
  const leader = normalizedRows.slice().sort((a, b) => Number(b.value || 0) - Number(a.value || 0))[0];

  return (
    <ReportChartCard
      title="Project status overview"
      description="Live split of active, completed, delayed, and on-hold projects."
      emptyLabel="No project status data."
      hasData={normalizedRows.length > 0}
      metric={<ChartSummaryPill label="Projects" value={total.toLocaleString('en-IN')} tone="blue" />}
      footer={normalizedRows.length ? <div className="pt-3 text-xs text-slate-500">Largest segment: {leader?.name || '-'} ({leader?.value || 0})</div> : null}
    >
      <div className="relative h-full">
        <div className="pointer-events-none absolute inset-x-0 top-[42%] z-10 -translate-y-1/2 text-center">
          <div className="text-3xl font-bold tracking-tight text-[rgb(var(--text))]">{total.toLocaleString('en-IN')}</div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Total</div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={[{ name: 'track', value: Math.max(total, 1) }]} dataKey="value" nameKey="name" innerRadius={74} outerRadius={116} paddingAngle={0} stroke="none" isAnimationActive={false}>
              <Cell fill="rgba(148, 163, 184, 0.14)" />
            </Pie>
            <Pie data={normalizedRows} dataKey="value" nameKey="name" innerRadius={74} outerRadius={116} paddingAngle={0} stroke="none" isAnimationActive={false}>
              {normalizedRows.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ReportTooltip />} />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ maxHeight: 52, overflowY: 'auto' }}
              formatter={(value) => <span className="text-xs text-slate-500">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ReportChartCard>
  );
}
