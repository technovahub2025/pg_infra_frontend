import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { pageVariants } from '../utils/motionVariants';
import { useTimer } from '../hooks/useTimer';
import { CalendarHeatmap } from '../components/shared/CalendarHeatmap';
import { TimerLog } from '../components/timer/TimerLog';
import { TimerManualEntry } from '../components/timer/TimerManualEntry';
import { ModalShell } from '../components/shared/ModalShell';
import { Button } from '../components/ui/button';
import { Card, CardBody } from '../components/ui/card';
import { FilterChips } from '../components/shared/FilterChips';
import { useProjects } from '../hooks/useProjects';
import { EmptyState } from '../components/shared/EmptyState';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { formatDuration } from '../store/timerStore';
import * as XLSX from 'xlsx';

export default function MyTimesheetsPage() {
  const { logs, dailySummary, addManualLog, deleteLog } = useTimer();
  const projectsQuery = useProjects();
  const projects = projectsQuery.data || [];
  const [manualOpen, setManualOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const visibleLogs = useMemo(() => {
    return logs.filter((log) => {
      const date = log.date || log.startTime;
      if (projectFilter !== 'all' && String(log.project?.id || log.project?._id || log.project) !== String(projectFilter)) return false;
      if (dateRange.start && new Date(date).getTime() < new Date(dateRange.start).getTime()) return false;
      if (dateRange.end && new Date(date).getTime() > new Date(dateRange.end).getTime()) return false;
      return true;
    });
  }, [dateRange.end, dateRange.start, logs, projectFilter]);

  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = subDays(new Date(), 6 - index);
      const key = format(date, 'yyyy-MM-dd');
      const hours = dailySummary.find((item) => item.date === key)?.duration || 0;
      return { date: format(date, 'EEE'), hours: Number((hours / 3600).toFixed(2)) };
    });
  }, [dailySummary]);

  const summary = useMemo(() => {
    const total = visibleLogs.reduce((sum, log) => sum + Number(log.duration || 0), 0);
    const todayKey = format(new Date(), 'yyyy-MM-dd');
    const today = dailySummary.find((item) => item.date === todayKey)?.duration || 0;
    const week = dailySummary.slice(-7).reduce((sum, item) => sum + Number(item.duration || 0), 0);
    return { total, today, week, month: dailySummary.reduce((sum, item) => sum + Number(item.duration || 0), 0) };
  }, [dailySummary, visibleLogs]);

  function exportLogs() {
    const rows = visibleLogs.map((log) => ({
      Date: format(new Date(log.date || log.startTime), 'dd MMM yyyy'),
      Task: log.task?.title || '-',
      Project: log.project?.projectName || '-',
      Stage: log.stage?.stageName || '-',
      'Start Time': log.startTime ? format(new Date(log.startTime), 'hh:mm a') : '-',
      'End Time': log.endTime ? format(new Date(log.endTime), 'hh:mm a') : '-',
      Duration: formatDuration(log.duration),
      Note: log.note || '',
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');
    XLSX.writeFile(workbook, 'timesheets.xlsx');
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-8">
      <section className="theme-hero theme-hero-blue p-5 sm:p-6">
        <p className="hero-kicker">My Timesheets</p>
        <h1 className="hero-title">Time logs and weekly summary</h1>
        <p className="hero-subtitle">Review your logged hours, filter entries, and export timesheets.</p>
      </section>

      {projectsQuery.isLoading ? <SkeletonCard /> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Today's Hours" value={formatDuration(summary.today)} />
        <SummaryCard label="This Week" value={formatDuration(summary.week)} />
        <SummaryCard label="This Month" value={formatDuration(summary.month)} />
        <SummaryCard label="Total Logged" value={formatDuration(summary.total)} />
      </div>

      <CalendarHeatmap dailySummary={dailySummary} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <input className="input w-auto" type="date" value={dateRange.start} onChange={(e) => setDateRange((state) => ({ ...state, start: e.target.value }))} />
          <input className="input w-auto" type="date" value={dateRange.end} onChange={(e) => setDateRange((state) => ({ ...state, end: e.target.value }))} />
          <select className="input w-auto" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
            <option value="all">All projects</option>
            {projects.map((project) => <option key={project.id} value={project.id}>{project.projectName}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setManualOpen(true)}>Manual Entry</Button>
          <Button variant="secondary" onClick={exportLogs}>Export</Button>
        </div>
      </div>

      <Card>
        <CardBody className="p-0">
          <TimerLog logs={visibleLogs} onDelete={(row) => deleteLog(row.id)} />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid stroke="rgba(148,163,184,0.18)" strokeDasharray="4 4" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#2E83F5" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {manualOpen ? (
        <ModalShell title="Manual Entry" description="Add a timesheet record." onClose={() => setManualOpen(false)}>
          <TimerManualEntry
            projects={projects}
            tasks={[]}
            onCancel={() => setManualOpen(false)}
            onSubmit={async (payload) => {
              await addManualLog(payload);
              setManualOpen(false);
            }}
          />
        </ModalShell>
      ) : null}
    </motion.div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <Card>
      <CardBody>
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
        <div className="mt-2 text-3xl font-semibold text-[rgb(var(--text))]">{value}</div>
      </CardBody>
    </Card>
  );
}
