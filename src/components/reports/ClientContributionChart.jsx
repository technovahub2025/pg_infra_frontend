import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartSummaryPill, REPORT_COLORS, ReportTooltip, formatCompactCurrency, truncateChartLabel } from './chartUtils';
import { ReportChartCard } from './ReportChartCard';

const PALETTE = [REPORT_COLORS.blue, REPORT_COLORS.emerald, REPORT_COLORS.amber, REPORT_COLORS.rose, REPORT_COLORS.violet, REPORT_COLORS.cyan, REPORT_COLORS.slate];

export function ClientContributionChart({ data = [] }) {
  const allRows = Array.isArray(data)
    ? data
        .map((row) => ({
          name: row.clientName || row.name || 'Unknown',
          value: Number(row.revenue || row.value || 0),
          projectCount: Number(row.projectCount || 0),
        }))
        .filter((row) => row.value > 0)
    : [];
  const sortedRows = allRows.slice().sort((a, b) => Number(b.value || 0) - Number(a.value || 0));
  const topRows = sortedRows.slice(0, 7);
  const otherRows = sortedRows.slice(7);
  const otherValue = otherRows.reduce((sum, row) => sum + Number(row.value || 0), 0);
  const rows = otherValue > 0
    ? [...topRows, { name: 'Other clients', value: otherValue, projectCount: otherRows.reduce((sum, row) => sum + Number(row.projectCount || 0), 0) }]
    : topRows;
  const totalRevenue = allRows.reduce((sum, row) => sum + Number(row.value || 0), 0);

  return (
    <ReportChartCard
      title="Client contribution"
      description="Revenue share by client, ranked by live invoicing."
      emptyLabel="No client contribution data."
      hasData={rows.length > 0}
      heightClassName="min-h-[380px] p-5"
      metric={<ChartSummaryPill label="Revenue" value={formatCompactCurrency(totalRevenue)} tone="blue" />}
      footer={otherRows.length ? <div className="pt-3 text-xs text-slate-500">{otherRows.length} lower-volume clients grouped into Other. Export includes all clients.</div> : null}
    >
      <div className="grid h-full min-h-[340px] gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="relative min-h-[320px]">
          <div className="pointer-events-none absolute inset-x-0 top-[42%] z-10 -translate-y-1/2 text-center">
            <div className="text-2xl font-bold tracking-tight text-[rgb(var(--text))]">{formatCompactCurrency(totalRevenue)}</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Total</div>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rows}
                dataKey="value"
                nameKey="name"
                innerRadius={72}
                outerRadius={112}
                startAngle={90}
                endAngle={-270}
                paddingAngle={1}
                minAngle={4}
                cornerRadius={0}
                stroke="none"
                isAnimationActive={false}
              >
                {rows.map((entry, index) => (
                  <Cell key={entry.name} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip content={<ReportTooltip currency />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ maxHeight: 52, overflowY: 'auto' }}
                formatter={(value) => <span className="text-xs text-slate-500">{truncateChartLabel(value, 14)}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="hidden min-h-0 rounded-2xl border border-[rgb(var(--line)/0.12)] bg-white/50 p-3 lg:block">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Revenue ranking</div>
          <div className="scrollbar-none mt-3 max-h-[286px] space-y-2 overflow-y-auto pr-1">
            {rows.map((row, index) => (
              <div key={row.name} className="rounded-xl bg-white/70 p-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate font-semibold text-[rgb(var(--text))]">{row.name}</span>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PALETTE[index % PALETTE.length] }} />
                </div>
                <div className="mt-1 text-slate-500">{formatCompactCurrency(row.value)} - {row.projectCount} projects</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ReportChartCard>
  );
}
