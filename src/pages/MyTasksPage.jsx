import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock3, AlertTriangle, CircleCheckBig, AlertCircle } from 'lucide-react';
import { pageVariants } from '../utils/motionVariants';
import { staggerContainer, staggerItem } from '../utils/motionVariants';
import { useAuthStore } from '../store/authStore';
import { useMyTasks } from '../hooks/useTasks';
import { useTimer } from '../hooks/useTimer';
import { TaskCard } from '../components/tasks/TaskCard';
import { Badge } from '../components/ui/badge';
import { Card, CardBody } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { EmptyState } from '../components/shared/EmptyState';
import { FilterChips } from '../components/shared/FilterChips';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { formatDuration } from '../store/timerStore';
import { useMemo, useState } from 'react';

export default function MyTasksPage() {
  const user = useAuthStore((state) => state.user);
  const { elapsedSeconds } = useTimer();
  const tasksQuery = useMyTasks();
  const [filter, setFilter] = useState('all');
  const tasks = tasksQuery.data || [];

  const sortedTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      const due = task.dueDate ? new Date(task.dueDate).getTime() : null;
      const now = Date.now();
      if (filter === 'today') return due ? format(new Date(due), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') : false;
      if (filter === 'overdue') return due ? due < now && task.status !== 'done' : false;
      if (filter === 'due-soon') return due ? due >= now && due - now <= 48 * 60 * 60 * 1000 : false;
      if (filter === 'in-progress') return task.status === 'in-progress';
      if (filter === 'done') return task.status === 'done';
      return true;
    });

    return filtered.sort((a, b) => {
      const dueA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const dueB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const overdueA = a.dueDate && dueA < Date.now() ? 0 : a.dueDate && dueA - Date.now() <= 48 * 60 * 60 * 1000 ? 1 : 2;
      const overdueB = b.dueDate && dueB < Date.now() ? 0 : b.dueDate && dueB - Date.now() <= 48 * 60 * 60 * 1000 ? 1 : 2;
      return overdueA - overdueB || dueA - dueB;
    });
  }, [filter, tasks]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-8">
      <section className="theme-hero theme-hero-blue p-5 sm:p-6">
        <p className="hero-kicker">My Tasks</p>
        <h1 className="hero-title">Welcome back, <span className="text-amber-300">{user?.name || 'there'}</span>!</h1>
        <p className="hero-subtitle">Today is {format(new Date(), 'dd MMM yyyy')} · Logged time {formatDuration(elapsedSeconds)}</p>
      </section>

      {tasksQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)}
        </div>
      ) : tasksQuery.isError ? (
        <Card>
          <CardBody className="flex items-center gap-3 py-10">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[rgb(var(--text))]">{tasksQuery.error?.message || 'Failed to load tasks'}</div>
              <div className="text-xs text-slate-500">Retry after the API responds again.</div>
            </div>
            <Button variant="secondary" onClick={() => tasksQuery.refetch()}>Retry</Button>
          </CardBody>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="Total" value={tasks.length} icon={Clock3} />
        <MiniStat label="Overdue" value={tasks.filter((task) => task.dueDate && new Date(task.dueDate).getTime() < Date.now() && task.status !== 'done').length} icon={AlertTriangle} tone="rose" />
        <MiniStat label="Due Soon" value={tasks.filter((task) => task.dueDate && new Date(task.dueDate).getTime() >= Date.now() && new Date(task.dueDate).getTime() - Date.now() <= 48 * 60 * 60 * 1000).length} icon={Clock3} tone="amber" />
        <MiniStat label="Done Today" value={tasks.filter((task) => task.status === 'done').length} icon={CircleCheckBig} tone="green" />
      </div>

      <FilterChips
        value={filter}
        onChange={setFilter}
        options={[
          { label: 'All', value: 'all' },
          { label: 'Today', value: 'today' },
          { label: 'Overdue', value: 'overdue' },
          { label: 'Due Soon', value: 'due-soon' },
          { label: 'In Progress', value: 'in-progress' },
          { label: 'Done', value: 'done' },
        ]}
      />

      {sortedTasks.length ? (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4">
          {sortedTasks.map((task) => (
            <motion.div key={task.id} variants={staggerItem}>
              <TaskCard task={task} showProject />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState title={filter === 'overdue' ? 'Great - no overdue tasks!' : filter === 'done' ? 'No tasks completed today yet' : 'No tasks assigned yet'} description="Your personal task list will appear here." />
      )}
    </motion.div>
  );
}

function MiniStat({ label, value, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'bg-sky-500/10 text-sky-300',
    amber: 'bg-amber-500/10 text-amber-300',
    rose: 'bg-rose-500/10 text-rose-300',
    green: 'bg-emerald-500/10 text-emerald-300',
  };
  return (
    <Card>
      <CardBody className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
          <div className="mt-2 text-3xl font-semibold text-[rgb(var(--text))]">{value}</div>
        </div>
        <div className={`rounded-2xl p-3 ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardBody>
    </Card>
  );
}
