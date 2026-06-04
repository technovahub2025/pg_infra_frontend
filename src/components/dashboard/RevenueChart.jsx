import { useMemo } from 'react';
import { Landmark, PiggyBank, Wallet } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/card';
import { useUiStore } from '../../store/uiStore';
import { clamp, cn } from '../../lib/utils';

export function RevenueChart({ data = [] }) {
  const theme = useUiStore((state) => state.theme);
  const isLight = theme === 'light';

  const rows = useMemo(
    () =>
      data
        .map((item) => {
          const received = Number(item.received || 0);
          const balance = Number(item.balance || 0);
          const total = received + balance;
          const progress = total > 0 ? clamp(Math.round((received / total) * 100), 0, 100) : 0;

          return {
            ...item,
            received,
            balance,
            total,
            progress,
          };
        })
        .sort((a, b) => b.total - a.total),
    [data],
  );

  const summary = useMemo(
    () =>
      rows.reduce(
        (acc, row) => {
          acc.received += row.received;
          acc.balance += row.balance;
          acc.total += row.total;
          return acc;
        },
        { received: 0, balance: 0, total: 0 },
      ),
    [rows],
  );

  return (
    <Card className="self-start overflow-hidden">
      <CardHeader className="items-start gap-2">
        <div>
          <CardTitle>Revenue Pipeline</CardTitle>
          <p className="mt-1 text-xs text-slate-500">High-signal summary of collected and pending amounts.</p>
        </div>
        <span className="ml-auto rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">
          Rs. Lakhs
        </span>
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard
            label="Received"
            value={summary.received}
            hint="Collected so far"
            tone="blue"
            icon={Landmark}
            isLight={isLight}
          />
          <StatCard
            label="Pending"
            value={summary.balance}
            hint="Remaining to bill"
            tone="slate"
            icon={Wallet}
            isLight={isLight}
          />
          <StatCard
            label="Collection Rate"
            value={`${summary.total ? Math.round((summary.received / summary.total) * 100) : 0}%`}
            hint="Weighted across projects"
            tone="emerald"
            icon={PiggyBank}
            isLight={isLight}
          />
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] dark:border-[rgb(var(--line)/0.16)] dark:bg-[rgb(var(--panel-2)/0.78)]">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-3 text-xs uppercase tracking-[0.18em] text-slate-400 dark:border-[rgb(var(--line)/0.16)]">
            <span>Project snapshot</span>
            <span>{rows.length} records</span>
          </div>

          <div className="max-h-[280px] space-y-2 overflow-auto pr-1 pt-3">
            {rows.map((row) => (
              <article
                key={row.name}
                className={cn(
                  'rounded-2xl border p-3 transition',
                  isLight
                    ? 'border-slate-200/80 bg-white hover:border-sky-200'
                    : 'border-[rgb(var(--line)/0.16)] bg-[rgb(var(--panel-2)/0.78)]',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-[rgb(var(--text))]">{row.name}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {row.received} received / {row.balance} pending
                    </div>
                  </div>
                  <div className="shrink-0 rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-300">
                    {row.progress}%
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
                    style={{ width: `${row.progress}%` }}
                  />
                </div>
              </article>
            ))}

            {!rows.length ? (
              <div
                className={cn(
                  'rounded-2xl border px-4 py-8 text-center text-sm text-slate-400',
                  isLight ? 'border-slate-200 bg-white' : 'border-[rgb(var(--line)/0.16)] bg-[rgb(var(--panel-2)/0.78)]',
                )}
              >
                No revenue data available.
              </div>
            ) : null}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function StatCard({ label, value, hint, tone = 'slate', icon: Icon, isLight = false }) {
  const styles = {
    blue: isLight ? 'border-sky-200 bg-sky-50/80 text-sky-700' : 'border-sky-400/20 bg-sky-500/10 text-sky-200',
    slate: isLight ? 'border-slate-200 bg-slate-50/80 text-slate-700' : 'border-white/10 bg-white/5 text-slate-200',
    emerald: isLight ? 'border-emerald-200 bg-emerald-50/80 text-emerald-700' : 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
  };

  return (
    <div className={cn('rounded-2xl border p-3', styles[tone])}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</div>
          <div className="mt-2 text-lg font-semibold text-[rgb(var(--text))]">{value}</div>
        </div>
        {Icon ? <Icon className="h-4 w-4 shrink-0 opacity-80" /> : null}
      </div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
    </div>
  );
}
