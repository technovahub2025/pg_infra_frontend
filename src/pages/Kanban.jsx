import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { pageVariants } from '../utils/motionVariants';
import { useAuthStore } from '../store/authStore';
import { useProjects } from '../hooks/useProjects';
import { useTasks, useCreateTask, useUpdateTask } from '../hooks/useTasks';
import { useUiStore } from '../store/uiStore';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { TaskForm } from '../components/tasks/TaskForm';
import { FilterChips } from '../components/shared/FilterChips';
import { EmptyState } from '../components/shared/EmptyState';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { Card, CardBody } from '../components/ui/card';
import { ModalShell } from '../components/shared/ModalShell';

export default function Kanban() {
  const currentUser = useAuthStore((state) => state.user);
  const [filter, setFilter] = useState('all');
  const projectsQuery = useProjects();
  const tasksQuery = useTasks();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const { activeModal, modalData, openModal, closeModal } = useUiStore();
  const projects = projectsQuery.data || [];
  const tasks = tasksQuery.data || [];

  const filteredTasks = useMemo(() => {
    if (filter === 'mine') return tasks.filter((task) => String(task.assignee?._id || task.assignee) === String(currentUser?.id));
    if (filter === 'critical') return tasks.filter((task) => String(task.priority).toLowerCase() === 'critical');
    return tasks;
  }, [currentUser?.id, filter, tasks]);

  function handleDragEnd(event) {
    const task = event.active.data.current?.task;
    const targetStatus = event.over?.id;
    if (!task || !targetStatus || task.status === targetStatus) return;
    updateTask.mutate({ id: task.id, payload: { status: targetStatus } });
  }

  async function handleQuickAdd(values) {
    if (modalData?.id) {
      await updateTask.mutateAsync({ id: modalData.id, payload: values });
    } else {
      const project = projects[0];
      if (!project) return;
      await createTask.mutateAsync({
        title: values.title,
        project: values.project || project.id,
        status: values.status,
        priority: values.priority || 'Medium',
        dueDate: values.dueDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      });
    }
    closeModal();
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-8">
      <section className="theme-hero theme-hero-green p-5 sm:p-6">
        <p className="hero-kicker">Kanban</p>
        <h1 className="hero-title">Task board</h1>
        <p className="hero-subtitle max-w-3xl">Drag tasks across status columns and keep the horizontal scroll contained inside the board.</p>
      </section>

      {projectsQuery.isError || tasksQuery.isError ? (
        <Card>
          <CardBody className="flex items-center gap-3 py-10">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[rgb(var(--text))]">
                {projectsQuery.error?.message || tasksQuery.error?.message || 'Failed to load kanban data'}
              </div>
              <div className="text-xs text-slate-500">Try again after a moment.</div>
            </div>
          </CardBody>
        </Card>
      ) : null}

      {(projectsQuery.isLoading || tasksQuery.isLoading) ? (
        <SkeletonCard />
      ) : null}

      <div className="flex flex-wrap gap-2">
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { label: 'All', value: 'all' },
            { label: 'Mine', value: 'mine' },
            { label: 'Critical', value: 'critical' },
          ]}
        />
      </div>

      <Card>
        <CardBody>
          {filteredTasks.length ? (
            <KanbanBoard
              tasks={filteredTasks}
              onDragEnd={handleDragEnd}
              onAddTask={(payload) => openModal('task', { ...payload, project: projects[0]?.id })}
            />
          ) : (
            <EmptyState title="No tasks on the board" description="There are no tasks to display for the current filter." />
          )}
        </CardBody>
      </Card>

      {activeModal === 'task' ? (
        <ModalShell
          title={modalData?.id ? 'Edit Task' : 'Add Task'}
          description="Create or update a board task."
          onClose={closeModal}
        >
          <TaskForm initialValues={modalData} projects={projects} onSubmit={handleQuickAdd} onCancel={closeModal} />
        </ModalShell>
      ) : null}
    </motion.div>
  );
}
