import { Area, Bar, CartesianGrid, ComposedChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartSummaryPill, REPORT_COLORS, ReportTooltip, formatCompactCurrency, formatMonthLabel, truncateChartLabel } from './chartUtils';
import { ReportChartCard } from './ReportChartCard';

export function RevenueTrendChart({ data = [] }) {
  const rows = Array.isArray(data)
    ? data
        .slice()
        .sort((a, b) => String(a.month || '').localeCompare(String(b.month || '')))
        .map((row) => ({
          month: formatMonthLabel(row.month),
          rawMonth: row.month,
          revenue: Number(row.revenue ?? row.total ?? 0),
          collections: Number(row.collections ?? row.received ?? 0),
          balance: Number(row.balance || 0),
        }))
    : [];
  const hasData = rows.some((row) => row.revenue > 0 || row.collections > 0 || row.balance > 0);
  const totalRevenue = rows.reduce((sum, row) => sum + Number(row.revenue || 0), 0);
  const totalCollections = rows.reduce((sum, row) => sum + Number(row.collections || 0), 0);
  const isSinglePoint = rows.length === 1;

  return (
    <ReportChartCard
      title="Revenue trend"
      description="Monthly revenue and collections from live billing records."
      emptyLabel="No revenue data."
      hasData={hasData}
      metric={<ChartSummaryPill label="Collected" value={formatCompactCurrency(totalCollections)} tone="green" />}
      footer={hasData ? <div className="pt-3 text-xs text-slate-500">Booked revenue: {formatCompactCurrency(totalRevenue)}</div> : null}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 12, right: 20, left: 6, bottom: 8 }}>
          <defs>
            <linearGradient id="reportRevenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={REPORT_COLORS.blue} stopOpacity={0.3} />
              <stop offset="100%" stopColor={REPORT_COLORS.blue} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="reportCollectionsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={REPORT_COLORS.emerald} stopOpacity={0.24} />
              <stop offset="100%" stopColor={REPORT_COLORS.emerald} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={REPORT_COLORS.grid} opacity={0.72} vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} minTickGap={28} tickFormatter={(value) => truncateChartLabel(value, 10)} />
          <YAxis tickLine={false} axisLine={false} tickFormatter={formatCompactCurrency} width={72} />
          <Tooltip content={<ReportTooltip currency />} />
          <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ maxHeight: 40, overflowY: 'auto' }} />
          {isSinglePoint ? (
            <>
              <Bar dataKey="revenue" name="Monthly Revenue" fill={REPORT_COLORS.blue} radius={[12, 12, 0, 0]} barSize={46} />
              <Bar dataKey="collections" name="Monthly Collections" fill={REPORT_COLORS.emerald} radius={[12, 12, 0, 0]} barSize={46} />
            </>
          ) : (
            <>
              <Area type="monotone" dataKey="revenue" name="Monthly Revenue" stroke={REPORT_COLORS.blue} fill="url(#reportRevenueFill)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="collections" name="Monthly Collections" stroke={REPORT_COLORS.emerald} fill="url(#reportCollectionsFill)" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </>
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </ReportChartCard>
  );
}
