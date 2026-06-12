import { useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react';
import { Area, Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, Clock3, Gauge, ListOrdered } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { formatDuration } from '../../store/timerStore';
import { REPORT_COLORS, ReportTooltip, truncateChartLabel } from '../reports/chartUtils';

const MAX_TREND_POINTS = 120;

function toNumber(value = 0) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function formatPercent(value = 0) {
  const number = toNumber(value);
  return `${number.toFixed(1)}%`;
}

function toHours(seconds = 0) {
  return Number((toNumber(seconds) / 3600).toFixed(1));
}

function chartLabel(value) {
  const text = String(value || '');
  return truncateChartLabel(text, 12);
}

function chartTickLabel(value) {
  return chartLabel(value);
}

function trendLabel(value) {
  const text = String(value || '');
  return text.length >= 5 ? text.slice(5) : text;
}

function formatChartHours(value = 0) {
  const hours = toNumber(value);
  if (!hours) return '0h';
  return `${hours >= 10 ? Math.round(hours) : hours.toFixed(1)}h`;
}

function chartIdPrefix(value = '') {
  return String(value || 'dataset').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

function normalizeDurationHours(row = {}) {
  if (row?.hours !== undefined) return toNumber(row.hours);
  if (row?.loggedHours !== undefined) return toNumber(row.loggedHours);
  if (row?.durationSeconds !== undefined) return toHours(row.durationSeconds);
  if (row?.totalSeconds !== undefined) return toHours(row.totalSeconds);
  if (row?.seconds !== undefined) return toHours(row.seconds);
  if (row?.billableSeconds !== undefined && row?.billableHours === undefined && row?.duration === undefined) return toHours(row.billableSeconds);
  if (row?.duration !== undefined) {
    const duration = toNumber(row.duration);
    return duration > 100 ? toHours(duration) : duration;
  }
  return 0;
}

function formatChange(value = 0) {
  const number = toNumber(value);
  return `${number > 0 ? '+' : ''}${number}%`;
}

function pickArray(source, keys = []) {
  for (const key of keys) {
    if (Array.isArray(source?.[key])) return source[key];
  }
  return [];
}

function sampleRows(rows, limit = MAX_TREND_POINTS) {
  if (!Array.isArray(rows) || rows.length <= limit) return rows || [];
  const step = Math.ceil(rows.length / limit);
  const sampled = rows.filter((_, index) => index % step === 0);
  const last = rows[rows.length - 1];
  if (sampled[sampled.length - 1] !== last) sampled.push(last);
  return sampled.slice(0, limit);
}

function normalizeTrendRows(rows = []) {
  const normalized = rows
    .map((row) => {
      const rawLabel = String(row?.label || row?.date || row?.month || row?.day || '').trim();
      const label = trendLabel(rawLabel);
      return {
        label,
        rawLabel,
        duration: toHours(row?.duration || row?.loggedHours || row?.totalSeconds || 0),
        billable: toHours(row?.billable || row?.billableHours || row?.billableSeconds || 0),
        entries: toNumber(row?.entries || row?.count || 0),
      };
    })
    .filter((row) => row.rawLabel || row.duration || row.billable || row.entries);

  normalized.sort((a, b) => String(a.rawLabel).localeCompare(String(b.rawLabel)));
  return sampleRows(normalized);
}

function normalizeTopRows(rows = []) {
  return rows
    .map((row) => ({
      label: chartLabel(row?.label || row?.projectName || row?.taskTitle || row?.name || '-'),
      hours: normalizeDurationHours(row),
      billableHours: row?.billableHours !== undefined ? toNumber(row.billableHours) : normalizeDurationHours({ durationSeconds: row?.billableSeconds ?? row?.billable ?? 0 }),
    }))
    .filter((row) => row.label !== '-' || row.hours || row.billableHours)
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5);
}

function normalizeComparison(comparison = {}) {
  return {
    totalChange: toNumber(comparison.totalChange || 0),
    billableChange: toNumber(comparison.billableChange || 0),
    previousTotalSeconds: toNumber(comparison.previousTotalSeconds || 0),
    previousBillableSeconds: toNumber(comparison.previousBillableSeconds || 0),
  };
}

function normalizeDataset(source = {}, fallbackSummary = {}, fallbackRange = {}, index = 0) {
  const summary = source.summary || fallbackSummary || {};
  const productivity = source.productivity || {};
  const comparison = normalizeComparison(source.comparison || {});
  const trendRows = normalizeTrendRows(pickArray(source, ['trendRows', 'dailySummary', 'trend', 'rows']));
  const topProjects = normalizeTopRows(pickArray(source, ['topProjects', 'projects']));
  const topTasks = normalizeTopRows(pickArray(source, ['topTasks', 'tasks']));
  const utilization = toNumber(source.utilization ?? summary.billableRate ?? 0);

  return {
    id: String(source.id || source.key || source.datasetId || source.name || `dataset-${index}`),
    label: String(source.label || source.name || source.title || `Dataset ${index + 1}`),
    trendRows,
    topProjects,
    topTasks,
    productivity: {
      mostProductiveWeekday: productivity.mostProductiveWeekday || null,
      averageStartTime: productivity.averageStartTime || '--:--',
    },
    comparison,
    utilization,
    summary: {
      totalSeconds: toNumber(summary.totalSeconds || 0),
      billableSeconds: toNumber(summary.billableSeconds || 0),
      totalEntries: toNumber(summary.totalEntries || 0),
      activeDays: toNumber(summary.activeDays || 0),
      peakDay: summary.peakDay || null,
      billableRate: toNumber(summary.billableRate || utilization || 0),
    },
    range: source.range || fallbackRange,
  };
}

function getDatasets(insights = {}, summary = {}, range = {}) {
  const multiSource = pickArray(insights, ['datasets', 'series', 'sources', 'profiles']);
  if (multiSource.length) {
    return multiSource.map((item, index) => normalizeDataset(item?.data || item?.insights || item, summary, range, index));
  }

  return [normalizeDataset(insights, summary, range, 0)];
}

export function TimesheetInsights({ insights = {}, summary = {}, range }) {
  const datasets = useMemo(() => getDatasets(insights, summary, range), [insights, range, summary]);
  const [activeDatasetId, setActiveDatasetId] = useState(() => datasets[0]?.id || 'dataset-0');
  const [isPending, startTransition] = useTransition();
  const deferredDatasetId = useDeferredValue(activeDatasetId);
  const datasetMap = useMemo(() => new Map(datasets.map((dataset) => [dataset.id, dataset])), [datasets]);

  useEffect(() => {
    if (!datasets.length) return;
    const exists = datasets.some((dataset) => dataset.id === activeDatasetId);
    if (!exists) setActiveDatasetId(datasets[0].id);
  }, [activeDatasetId, datasets]);

  const activeDataset = useMemo(() => datasetMap.get(activeDatasetId) || datasets[0], [activeDatasetId, datasetMap, datasets]);
  const displayedDataset = useMemo(() => datasetMap.get(deferredDatasetId) || activeDataset || datasets[0], [activeDataset, datasetMap, datasets, deferredDatasetId]);

  const trendData = useMemo(() => displayedDataset?.trendRows || [], [displayedDataset]);
  const topProjects = useMemo(() => displayedDataset?.topProjects || [], [displayedDataset]);
  const topTasks = useMemo(() => displayedDataset?.topTasks || [], [displayedDataset]);
  const activeSummary = displayedDataset?.summary || summary || {};
  const productivity = displayedDataset?.productivity || {};
  const comparison = displayedDataset?.comparison || normalizeComparison();
  const utilization = toNumber(displayedDataset?.utilization || activeSummary.billableRate || 0);
  const topTasksChartHeight = Math.max(180, Math.min(320, topTasks.length ? topTasks.length * 60 + 40 : 180));
  const chartKey = chartIdPrefix(displayedDataset?.id);

  const comparisonIsPositive = comparison.totalChange >= 0;
  const hasMultipleDatasets = datasets.length > 1;
  const isDatasetSwitching = isPending && deferredDatasetId !== activeDatasetId;

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${isDatasetSwitching ? 'opacity-80' : 'opacity-100'}`}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Utilization" value={formatPercent(utilization)} icon={Gauge} tone="emerald" helper="Billable / total hours" />
        <MetricCard label="Total hours" value={formatDuration(activeSummary.totalSeconds || 0)} icon={Clock3} tone="sky" helper={`${Number(activeSummary.totalEntries || 0)} entries`} />
        <MetricCard
          label="Compared to previous"
          value={formatChange(comparison.totalChange)}
          icon={comparisonIsPositive ? ArrowUpRight : ArrowDownRight}
          tone={comparisonIsPositive ? 'emerald' : 'rose'}
          helper="Current period vs previous"
        />
        <MetricCard
          label="Average start"
          value={productivity.averageStartTime || '--:--'}
          icon={ListOrdered}
          tone="amber"
          helper={productivity.mostProductiveWeekday?.label ? `Best day: ${productivity.mostProductiveWeekday.label}` : 'No start-time data'}
        />
      </div>

      {hasMultipleDatasets ? (
        <div className="rounded-3xl border border-[rgb(var(--line)/0.1)] bg-white/65 p-2 shadow-[0_20px_60px_-48px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="flex items-center justify-between gap-3 px-2 pb-2">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Datasets</div>
              <div className="mt-0.5 text-xs text-slate-500">Switch between the available insight sources without reloading the page.</div>
            </div>
            <Badge tone="slate">{datasets.length} sources</Badge>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none px-1 pb-1">
            {datasets.map((dataset) => {
              const active = dataset.id === activeDatasetId;
              return (
                <button
                  key={dataset.id}
                  type="button"
                  onClick={() => {
                    startTransition(() => setActiveDatasetId(dataset.id));
                  }}
                  aria-pressed={active}
                  className={`min-w-[180px] rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                    active
                      ? 'border-sky-300 bg-sky-50 shadow-[0_14px_30px_-20px_rgba(14,165,233,0.45)] ring-1 ring-sky-200/50'
                      : 'border-[rgb(var(--line)/0.08)] bg-white/80 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_28px_-20px_rgba(15,23,42,0.18)]'
                  }`}
                >
                  <div className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${active ? 'text-sky-700' : 'text-slate-500'}`}>
                    {dataset.label}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-[rgb(var(--text))]">
                    {formatDuration(dataset.summary?.totalSeconds || 0)}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {dataset.summary?.totalEntries || 0} entries
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <div>
              <CardTitle>Time trend</CardTitle>
              <div className="mt-1 text-xs text-slate-500">Daily or weekly totals based on range length</div>
            </div>
            <Badge tone="blue">{trendData.length} points</Badge>
          </CardHeader>
          <CardBody className="h-[320px]">
            {trendData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart key={`trend-${chartKey}`} data={trendData} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                  <defs>
                    <linearGradient id={`trend-hours-${chartKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={REPORT_COLORS.blue} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={REPORT_COLORS.blue} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={REPORT_COLORS.grid} opacity={0.8} vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} tickFormatter={chartTickLabel} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={formatChartHours} width={44} />
                  <Tooltip content={<ReportTooltip hours />} />
                  <Area
                    type="monotone"
                    dataKey="duration"
                    name="Hours"
                    stroke={REPORT_COLORS.blue}
                    strokeWidth={2.5}
                    fill={`url(#trend-hours-${chartKey})`}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                    isAnimationActive
                    animationDuration={650}
                    animationEasing="ease-out"
                  />
                  <Line
                    type="monotone"
                    dataKey="billable"
                    name="Billable"
                    stroke={REPORT_COLORS.emerald}
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive
                    animationDuration={650}
                    animationEasing="ease-out"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <EmptyMetric title="No trend data" description="Select a date range with logged time." />
            )}
          </CardBody>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader>
            <div>
              <CardTitle>Top projects</CardTitle>
              <div className="mt-1 text-xs text-slate-500">Most time logged by project</div>
            </div>
            <Badge tone="slate">Top 5</Badge>
          </CardHeader>
          <CardBody className="h-[320px]">
            {topProjects.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart key={`projects-${chartKey}`} data={topProjects} layout="vertical" margin={{ top: 8, right: 16, left: 34, bottom: 8 }}>
                  <defs>
                    <linearGradient id={`projects-fill-${chartKey}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={REPORT_COLORS.blue} />
                      <stop offset="100%" stopColor={REPORT_COLORS.cyan} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={REPORT_COLORS.grid} opacity={0.8} horizontal={false} />
                  <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={formatChartHours} allowDecimals={false} />
                  <YAxis type="category" dataKey="label" width={120} tickLine={false} axisLine={false} tickFormatter={chartTickLabel} />
                  <Tooltip content={<ReportTooltip hours />} />
                  <Bar
                    dataKey="hours"
                    name="Hours"
                    fill={`url(#projects-fill-${chartKey})`}
                    radius={[0, 12, 12, 0]}
                    minPointSize={4}
                    isAnimationActive
                    animationDuration={650}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyMetric title="No project data" description="Logs need a project to appear here." />
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-start">
        <Card className="overflow-hidden">
          <CardHeader>
            <div>
              <CardTitle>Top tasks</CardTitle>
              <div className="mt-1 text-xs text-slate-500">Tasks consuming the most time</div>
            </div>
            <Badge tone="amber">Top 5</Badge>
          </CardHeader>
          <CardBody className="space-y-4 p-5">
            {topTasks.length ? (
              <div className="rounded-2xl border border-[rgb(var(--line)/0.08)] bg-white/60 p-3 shadow-inner shadow-slate-900/5">
                <div style={{ height: topTasksChartHeight }} className="shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      key={`tasks-${chartKey}`}
                      data={topTasks}
                      layout="vertical"
                      margin={{ top: 8, right: 24, left: 8, bottom: 4 }}
                      barCategoryGap={14}
                      barGap={6}
                    >
                      <defs>
                        <linearGradient id={`tasks-fill-${chartKey}`} x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={REPORT_COLORS.amber} />
                          <stop offset="100%" stopColor={REPORT_COLORS.rose} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={REPORT_COLORS.grid} opacity={0.8} horizontal={false} />
                      <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatChartHours} allowDecimals={false} />
                      <YAxis type="category" dataKey="label" width={150} tickLine={false} axisLine={false} tickMargin={10} interval={0} tickFormatter={chartTickLabel} />
                      <Tooltip content={<ReportTooltip hours />} />
                      <Bar
                        dataKey="hours"
                        name="Hours"
                        fill={`url(#tasks-fill-${chartKey})`}
                        radius={[0, 12, 12, 0]}
                        minPointSize={5}
                        isAnimationActive
                        animationDuration={650}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <EmptyMetric title="No task data" description="Logs need a task to appear here." />
            )}
          </CardBody>
        </Card>

        <div className="grid gap-4 self-stretch">
          <Card className="h-fit self-start">
            <CardHeader>
              <CardTitle>Productivity pattern</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <InfoRow label="Most productive weekday" value={productivity.mostProductiveWeekday?.label || '-'} />
              <InfoRow label="Hours on best day" value={productivity.mostProductiveWeekday?.duration ? formatDuration(productivity.mostProductiveWeekday.duration) : '-'} />
              <InfoRow label="Average start time" value={productivity.averageStartTime || '--:--'} />
              <InfoRow label="Active days" value={String(activeSummary.activeDays || 0)} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Period comparison</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <InfoRow label="Total change" value={formatChange(comparison.totalChange)} />
              <InfoRow label="Billable change" value={formatChange(comparison.billableChange)} />
              <InfoRow label="Current billable" value={formatDuration(activeSummary.billableSeconds || 0)} />
              <InfoRow label="Current total" value={formatDuration(activeSummary.totalSeconds || 0)} />
              <InfoRow label="Range" value={range?.start && range?.end ? `${formatDate(range.start)} - ${formatDate(range.end)}` : 'Default range'} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, tone = 'sky', helper }) {
  const tones = {
    sky: 'text-sky-500',
    emerald: 'text-emerald-500',
    amber: 'text-amber-500',
    rose: 'text-rose-500',
  };

  return (
    <Card>
      <CardBody className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-[rgb(var(--text))]">{value}</div>
          <div className="mt-1 text-xs text-slate-500">{helper}</div>
        </div>
        <Icon className={`h-5 w-5 ${tones[tone] || tones.sky}`} />
      </CardBody>
    </Card>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[rgb(var(--line)/0.12)] bg-white/70 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="text-sm font-semibold text-[rgb(var(--text))]">{value}</div>
    </div>
  );
}

function EmptyMetric({ title, description }) {
  return (
    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[rgb(var(--line)/0.18)] bg-white/50 px-4 py-6 text-center">
      <div>
        <div className="text-sm font-semibold text-[rgb(var(--text))]">{title}</div>
        <div className="mt-1 text-xs text-slate-500">{description}</div>
      </div>
    </div>
  );
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
