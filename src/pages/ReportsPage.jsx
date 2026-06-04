import { motion } from 'framer-motion';
import { pageVariants } from '../utils/motionVariants';
import {
  useEngineerUtilization,
  usePriorityReport,
  useProjectStatusReport,
  useRevenueTrend,
  useStageCompletion,
  useTaskStatusReport,
} from '../hooks/useReports';
import { StatusDonutChart } from '../components/reports/StatusDonutChart';
import { PriorityBarChart } from '../components/reports/PriorityBarChart';
import { TaskStatusChart } from '../components/reports/TaskStatusChart';
import { RevenueTrendChart } from '../components/reports/RevenueTrendChart';
import { StageHeatmapGrid } from '../components/reports/StageHeatmapGrid';
import { EngineerUtilizationChart } from '../components/reports/EngineerUtilizationChart';
import { SkeletonCard } from '../components/shared/SkeletonCard';

export default function ReportsPage() {
  const statusQuery = useProjectStatusReport();
  const priorityQuery = usePriorityReport();
  const taskStatusQuery = useTaskStatusReport();
  const revenueQuery = useRevenueTrend();
  const stageQuery = useStageCompletion();
  const engineerQuery = useEngineerUtilization();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-8">
      <section className="theme-hero theme-hero-slate p-5 sm:p-6">
        <p className="hero-kicker">Reports</p>
        <h1 className="hero-title">Reports and analytics</h1>
        <p className="hero-subtitle max-w-3xl">Operational charts for status, priority, revenue, stages, and utilization.</p>
      </section>

      {statusQuery.isLoading || priorityQuery.isLoading || taskStatusQuery.isLoading ? (
        <SkeletonCard />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <StatusDonutChart data={statusQuery.data || {}} />
        <PriorityBarChart data={priorityQuery.data || {}} />
        <TaskStatusChart data={taskStatusQuery.data || {}} />
        <RevenueTrendChart data={revenueQuery.data || []} />
        <StageHeatmapGrid data={stageQuery.data?.stages || []} />
        <EngineerUtilizationChart data={engineerQuery.data || []} />
      </div>
    </motion.div>
  );
}
