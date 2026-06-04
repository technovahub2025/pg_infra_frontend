import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock3, ShieldAlert } from 'lucide-react';
import { pageVariants } from '../utils/motionVariants';
import { useDashboard } from '../hooks/useDashboard';
import { useUpdateTask } from '../hooks/useTasks';
import { KPIRow } from '../components/dashboard/KPIRow';
import { ActionItemsTable } from '../components/dashboard/ActionItemsTable';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { StageHeatmapGrid } from '../components/reports/StageHeatmapGrid';
import { Card, CardBody, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function CeoDashboard() {
  const dashboardQuery = useDashboard('superadmin');
  const updateTask = useUpdateTask();

  const dashboard = dashboardQuery.data || {
    actions: [],
    projects: [],
    revenueSummary: [],
    summary: {},
    stages: [],
  };

  const criticalProjects = useMemo(
    () =>
      (dashboard.projects || [])
        .filter((project) => String(project.priority).toLowerCase() === 'critical' || String(project.status).toLowerCase() === 'on hold')
        .slice(0, 4),
    [dashboard.projects],
  );

  const kpis = useMemo(
    () => [
      { label: 'Total Projects', value: dashboard.summary.totalProjects || 0, note: 'All live records', tone: 'blue' },
      { label: 'Critical Alerts', value: criticalProjects.length, note: 'Needs executive review', tone: 'rose' },
      { label: 'Open Tasks', value: dashboard.summary.openTasks || 0, note: 'Not completed yet', tone: 'sky' },
      { label: 'Overdue Tasks', value: dashboard.summary.overdueTasks || 0, note: 'Past due date', tone: 'amber' },
      { label: 'Billing Received', value: `Rs. ${Number(dashboard.summary.receivedTotal || 0).toFixed(2)}L`, note: 'Collected revenue', tone: 'emerald' },
      { label: 'Outstanding', value: `Rs. ${Number(dashboard.summary.balanceTotal || 0).toFixed(2)}L`, note: 'Pending balance', tone: 'amber' },
      { label: 'Pending Approvals', value: dashboard.summary.pendingApprovals || 0, note: 'Client review items', tone: 'sky' },
    ],
    [criticalProjects.length, dashboard.summary],
  );

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-44 sm:pb-48 lg:pb-52">
      <section className="theme-hero theme-hero-amber p-5 sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
        <p className="hero-kicker">CEO / MD View</p>
        <h1 className="hero-title">Executive control panel</h1>
        <p className="hero-subtitle max-w-3xl">
          Live portfolio, billing, task, and stage signals for executive review.
        </p>
          </div>
          <div className="rounded-2xl border border-amber-200/60 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-[rgb(var(--line)/0.16)] dark:bg-[rgb(var(--panel-2)/0.78)] dark:text-slate-300">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-300">
              <ShieldAlert className="h-4 w-4" />
              Executive alerts active
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Critical projects, overdue tasks, and billing balances update from live APIs.
            </div>
          </div>
        </div>
      </section>

      {dashboardQuery.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <Card key={index}><CardBody><div className="h-24 animate-pulse rounded-2xl bg-white/5" /></CardBody></Card>)}
        </div>
      ) : dashboardQuery.isError ? (
        <Card>
          <CardBody className="flex items-center gap-3 py-10">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[rgb(var(--text))]">{dashboardQuery.error?.message || 'Failed to load executive dashboard'}</div>
              <div className="text-xs text-slate-500">Refresh the page or try again after a moment.</div>
            </div>
            <Button variant="secondary" onClick={() => dashboardQuery.refetch()}>Retry</Button>
          </CardBody>
        </Card>
      ) : null}

      <KPIRow data={kpis} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] xl:items-start">
        <Card className="self-start">
          <CardHeader className="items-center justify-between">
            <CardTitle>Executive alerts</CardTitle>
            <span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-500 dark:text-rose-200">
              Critical
            </span>
          </CardHeader>
          <CardBody className="space-y-3">
            {criticalProjects.length ? criticalProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 dark:border-[rgb(var(--line)/0.16)] dark:bg-[rgb(var(--panel-2)/0.78)]"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-[rgb(var(--text))]">{project.projectName}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {project.clientName || project.client || 'Client not set'} - {project.currentStage || 'No stage'}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-rose-400/20 bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-500 dark:text-rose-200">
                    {project.priority}
                  </span>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-4 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                <div className="flex items-center gap-2 font-semibold">
                  <Clock3 className="h-4 w-4" />
                  No critical projects at the moment
                </div>
                <p className="mt-1 text-xs text-emerald-600/80 dark:text-emerald-200/80">
                  Portfolio is currently within normal operating range.
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        <div className="xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:pr-1">
          <StageHeatmapGrid data={dashboard.stages || []} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] xl:items-start">
        <ActionItemsTable
          tasks={dashboard.actions}
          showApproveButtons
          onApprove={(row) => updateTask.mutate({ id: row.id, payload: { status: 'done' } })}
          onReject={(row) => updateTask.mutate({ id: row.id, payload: { status: 'todo' } })}
        />
        <div className="xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto xl:pr-1">
          <div className="space-y-6">
            <RevenueChart data={dashboard.revenueSummary} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
