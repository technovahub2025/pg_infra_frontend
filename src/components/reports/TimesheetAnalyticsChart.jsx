import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartSummaryPill, REPORT_COLORS, ReportTooltip, formatHours, formatMonthLabel, formatPercent, truncateChartLabel } from './chartUtils';
import { ReportChartCard } from './ReportChartCard';

export function TimesheetAnalyticsChart({ data = [] }) {
  const rows = Array.isArray(data)
    ? data
        .slice()
        .sort((a, b) => String(a.month || '').localeCompare(String(b.month || '')))
        .map((row) => ({
          month: formatMonthLabel(row.month),
          rawMonth: row.month,
          loggedHours: Number(row.loggedHours || 0),
          billableHours: Number(row.billableHours || 0),
        }))
    : [];
  const hasData = rows.some((row) => row.loggedHours > 0 || row.billableHours > 0);
  const loggedTotal = rows.reduce((sum, row) => sum + Number(row.loggedHours || 0), 0);
  const billableTotal = rows.reduce((sum, row) => sum + Number(row.billableHours || 0), 0);
  const billableRate = loggedTotal ? (billableTotal / loggedTotal) * 100 : 0;

  return (
    <ReportChartCard
      title="Timesheet analytics"
      description="Logged hours compared with billable hours over time."
      emptyLabel="No timesheet data."
      hasData={hasData}
      metric={<ChartSummaryPill label="Billable" value={formatPercent(billableRate)} tone="green" />}
      footer={hasData ? <div className="pt-3 text-xs text-slate-500">Logged {formatHours(loggedTotal)} with {formatHours(billableTotal)} billable.</div> : null}
    >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rows} margin={{ top: 12, right: 20, left: 6, bottom: 8 }}>
              <defs>
                <linearGradient id="reportLoggedHoursFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={REPORT_COLORS.violet} stopOpacity={0.34} />
                  <stop offset="100%" stopColor={REPORT_COLORS.violet} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={REPORT_COLORS.grid} opacity={0.72} vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} minTickGap={28} tickFormatter={(value) => truncateChartLabel(value, 10)} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={formatHours} width={58} />
              <Tooltip content={<ReportTooltip hours />} />
              <Area
                type="monotone"
                dataKey="loggedHours"
                name="Logged Hours"
                stroke={REPORT_COLORS.violet}
                fill="url(#reportLoggedHoursFill)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="billableHours"
                name="Billable Hours"
                stroke={REPORT_COLORS.emerald}
                strokeWidth={3}
                dot={rows.length <= 8}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs">
            <LegendPill color={REPORT_COLORS.violet} label="Logged Hours" />
            <LegendPill color={REPORT_COLORS.emerald} label="Billable Hours" />
          </div>
    </ReportChartCard>
  );
}

function LegendPill({ color, label }) {
  return (
    <div className="flex items-center gap-2 text-slate-500">
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
