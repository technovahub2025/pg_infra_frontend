import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { pageVariants } from '../utils/motionVariants';
import { useDashboard } from '../hooks/useDashboard';
import { KPIRow } from '../components/dashboard/KPIRow';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { WorkloadPanel } from '../components/dashboard/WorkloadPanel';
import { ActionItemsTable } from '../components/dashboard/ActionItemsTable';
import { ProjectTable } from '../components/projects/ProjectTable';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { EmptyState } from '../components/shared/EmptyState';
import { Card, CardBody } from '../components/ui/card';
import { Button } from '../components/ui/button';

export default function Dashboard() {
  const dashboardQuery = useDashboard('superadmin');
  const dashboard = dashboardQuery.data || {
    kpis: [],
    actions: [],
    projects: [],
    revenueSummary: [],
    team: [],
    summary: {},
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-8">
      <section className="theme-hero theme-hero-blue p-5 sm:p-6">
        <p className="hero-kicker">Dashboard</p>
        <h1 className="hero-title">Project portfolio control center</h1>
        <p className="hero-subtitle max-w-3xl">Live project, task, and billing data for the active portfolio.</p>
      </section>

      {dashboardQuery.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : dashboardQuery.isError ? (
        <Card>
          <CardBody className="flex items-center gap-3 py-10">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[rgb(var(--text))]">{dashboardQuery.error?.message || 'Failed to load dashboard'}</div>
              <div className="text-xs text-slate-500">Refresh the page or try again after a moment.</div>
            </div>
            <Button variant="secondary" onClick={() => dashboardQuery.refetch()}>Retry</Button>
          </CardBody>
        </Card>
      ) : null}

      <KPIRow data={dashboard.kpis} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] xl:items-start">
        <div className="min-w-0 space-y-6">
          <ActionItemsTable tasks={dashboard.actions} />
          <Card>
            <CardBody className="p-0">
              <ProjectTable rows={dashboard.projects.slice(0, 8)} />
            </CardBody>
          </Card>
        </div>
        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <RevenueChart data={dashboard.revenueSummary} />
          <WorkloadPanel members={dashboard.team} />
        </div>
      </div>

      {!dashboard.projects.length && !dashboardQuery.isLoading ? (
        <EmptyState title="No projects available" description="Seed data or live API data was not returned." />
      ) : null}
    </motion.div>
  );
}
