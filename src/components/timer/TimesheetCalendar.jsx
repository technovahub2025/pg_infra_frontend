import { format, isSameDay, subDays } from 'date-fns';
import { cn } from '../../lib/utils';

function intensity(duration = 0) {
  if (duration <= 0) return 0;
  if (duration < 3600) return 1;
  if (duration < 7200) return 2;
  if (duration < 14400) return 3;
  return 4;
}

export function TimesheetCalendar({ dailySummary = [] }) {
  const summaryMap = new Map(dailySummary.map((item) => [item.date, Number(item.duration || 0)]));
  const days = Array.from({ length: 35 }).map((_, index) => subDays(new Date(), 34 - index));

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="font-display text-lg font-semibold text-[rgb(var(--text))]">Calendar Heatmap</div>
          <div className="text-xs text-slate-500">Last 35 days of logged time</div>
        </div>
        <div className="text-xs text-slate-500">Low to high intensity</div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd');
          const duration = summaryMap.get(key) || 0;
          const level = intensity(duration);
          return (
            <div
              key={key}
              title={`${key} · ${Math.round(duration / 3600)}h`}
              className={cn(
                'group flex aspect-square flex-col items-center justify-center rounded-xl border text-[10px] transition',
                level === 0
                  ? 'border-white/5 bg-white/5 text-slate-500'
                  : level === 1
                    ? 'border-sky-400/10 bg-sky-400/10 text-sky-200'
                    : level === 2
                      ? 'border-sky-400/20 bg-sky-400/20 text-sky-100'
                      : level === 3
                        ? 'border-sky-400/30 bg-sky-400/30 text-white'
                        : 'border-sky-400/40 bg-sky-500 text-white',
              )}
            >
              <span className="font-semibold">{format(day, 'dd')}</span>
              <span className="opacity-75">{Math.round(duration / 3600)}h</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
