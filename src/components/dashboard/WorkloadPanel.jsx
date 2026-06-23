import { memo, useMemo } from 'react';
import { Activity, Users } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/card';

const MAX_VISIBLE_ROWS = 80;

export function WorkloadPanel({ members = [] }) {
  const { rows, totalProjects, peak, onlineCount, overloadedCount, hiddenCount } = useMemo(() => {
    const normalized = members
      .map((member, index) => ({
        id: String(member.id || member._id || member.name || `member-${index}`),
        name: member.name || 'Unassigned',
        projects: Number(member.projects || 0),
        online: Boolean(member.online),
      }))
      .sort((a, b) => b.projects - a.projects || a.name.localeCompare(b.name));

    const total = normalized.reduce((sum, member) => sum + member.projects, 0);
    const max = Math.max(...normalized.map((member) => member.projects), 1);
    const average = normalized.length ? total / normalized.length : 0;

    return {
      rows: normalized.slice(0, MAX_VISIBLE_ROWS),
      totalProjects: total,
      peak: max,
      onlineCount: normalized.filter((member) => member.online).length,
      overloadedCount: normalized.filter((member) => member.projects > average && member.projects > 1).length,
      hiddenCount: Math.max(0, normalized.length - MAX_VISIBLE_ROWS),
    };
  }, [members]);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="items-start gap-2">
        <div className="flex w-full items-center justify-between gap-3">
          <CardTitle>Workload</CardTitle>
          <span className="shrink-0 rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">
            {totalProjects} projects
          </span>
        </div>
        <p className="text-xs text-slate-500">Quick view of active assignments by teammate.</p>
      </CardHeader>

      <CardBody className="min-h-0 flex-1 overflow-hidden p-0">
        <div className="sticky top-0 z-10 grid grid-cols-3 gap-2 border-y border-[rgb(var(--line)/0.1)] bg-[rgb(var(--panel)/0.92)] px-5 py-3 backdrop-blur">
          <MiniStat label="Online" value={onlineCount} icon={Activity} />
          <MiniStat label="Peak" value={peak} icon={Users} />
          <MiniStat label="Watch" value={overloadedCount} icon={Activity} />
        </div>

        <div className="scrollbar-none max-h-[410px] space-y-2 overflow-y-auto px-5 py-4 pr-4">
          {rows.length ? (
            rows.map((member) => <WorkloadRow key={member.id} member={member} peak={peak} totalProjects={totalProjects} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-sm text-slate-400 dark:border-[rgb(var(--line)/0.16)] dark:bg-[rgb(var(--panel-2)/0.78)]">
              No workload data.
            </div>
          )}

          {hiddenCount ? (
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-center text-xs font-medium text-slate-500 dark:border-[rgb(var(--line)/0.16)] dark:bg-[rgb(var(--panel-2)/0.78)]">
              Showing top {MAX_VISIBLE_ROWS} teammates. {hiddenCount} more hidden for performance.
            </div>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
}

const WorkloadRow = memo(function WorkloadRow({ member, peak, totalProjects }) {
  const width = member.projects ? Math.max(Math.round((member.projects / peak) * 100), 6) : 2;
  const share = totalProjects ? Math.round((member.projects / totalProjects) * 100) : 0;
  const tone = member.projects === peak && peak > 1 ? 'text-amber-600' : member.projects ? 'text-sky-600' : 'text-slate-400';

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/75 p-3 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:border-sky-200 hover:bg-white dark:border-[rgb(var(--line)/0.16)] dark:bg-[rgb(var(--panel-2)/0.78)]">
      <div className="flex items-center justify-between gap-3 text-sm">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${member.online ? 'bg-emerald-400' : 'bg-slate-300'}`} />
            <div className="truncate font-medium text-[rgb(var(--text))]">{member.name}</div>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {member.online ? 'Online now' : 'Offline'} • {share}% allocation
          </div>
        </div>
        <div className={`shrink-0 rounded-full border border-sky-400/20 bg-sky-500/10 px-2.5 py-1 text-xs font-semibold ${tone} dark:text-sky-300`}>
          {member.projects} {member.projects === 1 ? 'project' : 'projects'}
        </div>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/5">
        <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-[width] duration-300" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
});

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-3 py-2 dark:border-[rgb(var(--line)/0.16)] dark:bg-[rgb(var(--panel-2)/0.72)]">
      <div className="flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        <span>{label}</span>
        <Icon className="h-3 w-3 text-sky-500" />
      </div>
      <div className="mt-1 text-base font-semibold text-[rgb(var(--text))]">{value}</div>
    </div>
  );
}
