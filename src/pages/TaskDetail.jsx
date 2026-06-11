import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  PencilLine,
  PlayCircle,
  Tag,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react';
import { pageVariants } from '../utils/motionVariants';
import { useAuthStore } from '../store/authStore';
import { useEmployees } from '../hooks/useEmployees';
import { useProjectStages } from '../hooks/useProjects';
import { useTeams } from '../hooks/useTeams';
import {
  useAddTaskComment,
  useDeleteTask,
  useRequestTaskTimeExtension,
  useTask,
  useUpdateTask,
} from '../hooks/useTasks';
import { useTimer } from '../hooks/useTimer';
import { Button } from '../components/ui/button';
import { Card, CardBody } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { EmptyState } from '../components/shared/EmptyState';
import { ModalShell } from '../components/shared/ModalShell';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { TaskComments } from '../components/tasks/TaskComments';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskPriorityBadge } from '../components/tasks/TaskPriorityBadge';
import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge';
import { TimeExtensionRequestsPanel } from '../components/tasks/TimeExtensionRequestsPanel';
import { formatDuration } from '../store/timerStore';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const taskQuery = useTask(id);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const addComment = useAddTaskComment();
  const requestExtension = useRequestTaskTimeExtension();
  const { activeLog, elapsedSeconds, isRunning, startTimer } = useTimer();
  const [editOpen, setEditOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestedMinutes, setRequestedMinutes] = useState(30);
  const [reason, setReason] = useState('');

  const task = taskQuery.data;
  const projectId = task?.projectId || task?.project?.id || task?.project?._id || task?.project || '';
  const stageId = task?.stageId || task?.stage?.id || task?.stage?._id || task?.stage || '';
  const employeesQuery = useEmployees({}, { enabled: Boolean(currentUser?.role && ['superadmin', 'admin', 'project_manager'].includes(currentUser.role)) });
  const teamsQuery = useTeams({}, { enabled: Boolean(currentUser?.role && ['superadmin', 'admin', 'project_manager'].includes(currentUser.role)) });
  const stagesQuery = useProjectStages(projectId);

  const isThisTaskActive = isRunning && String(activeLog?.task?.id || activeLog?.task?._id || activeLog?.task) === String(id);
  const isBudgeted = Number(task?.estimatedDurationMinutes || 0) > 0;
  const timerExpiresAt = task?.timerExpiresAt ? new Date(task.timerExpiresAt).getTime() : null;
  const remainingSeconds = timerExpiresAt ? Math.floor((timerExpiresAt - Date.now()) / 1000) : null;
  const timerExpired =
    (isBudgeted && task?.timerStatus === 'expired') ||
    (isBudgeted && timerExpiresAt && remainingSeconds <= 0 && task?.status !== 'done');
  const canManage = ['superadmin', 'admin', 'project_manager'].includes(currentUser?.role);
  const canDelete = ['superadmin', 'admin'].includes(currentUser?.role);
  const canStart = useMemo(() => {
    if (!task || !currentUser?.id) return false;
    const assigneeId = task.assignee?._id || task.assignee?.id || task.assignee;
    const reporterId = task.reporter?._id || task.reporter?.id || task.reporter || task.createdBy?._id || task.createdBy?.id || task.createdBy;
    const assignedTeamIds = Array.isArray(task.assignedTeam) ? task.assignedTeam.map((member) => member?._id || member?.id || member) : [];
    const teamMemberIds = Array.isArray(task.teamMembers) ? task.teamMembers.map((member) => member?._id || member?.id || member) : [];
    return (
      canManage ||
      String(assigneeId || '') === String(currentUser.id) ||
      String(reporterId || '') === String(currentUser.id) ||
      assignedTeamIds.some((memberId) => String(memberId) === String(currentUser.id)) ||
      teamMemberIds.some((memberId) => String(memberId) === String(currentUser.id))
    );
  }, [canManage, currentUser?.id, task]);

  if (taskQuery.isLoading) {
    return <SkeletonCard />;
  }

  if (taskQuery.isError) {
    return (
      <Card>
        <CardBody className="flex items-center gap-3 py-10">
          <AlertCircle className="h-5 w-5 text-rose-400" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-[rgb(var(--text))]">{taskQuery.error?.message || 'Failed to load task'}</div>
            <div className="text-xs text-slate-500">You may not have access to this task, or it may have been removed.</div>
          </div>
          <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
        </CardBody>
      </Card>
    );
  }

  if (!task) {
    return <EmptyState title="Task not found" description="The requested task could not be loaded." action={<Button onClick={() => navigate(-1)}>Back</Button>} />;
  }

  async function handleEdit(values) {
    await updateTask.mutateAsync({ id: task.id, payload: { ...values, project: values.project || projectId } });
    setEditOpen(false);
  }

  async function handleDelete() {
    await deleteTask.mutateAsync(task.id);
    navigate(projectId ? `/projects/${projectId}` : '/my-tasks');
  }

  async function handleComplete() {
    await updateTask.mutateAsync({ id: task.id, payload: { status: 'done', project: projectId } });
  }

  const teamMemberNames = Array.isArray(task.assignedTeamNames) && task.assignedTeamNames.length
    ? task.assignedTeamNames
    : Array.isArray(task.assignedTeam)
      ? task.assignedTeam.map((member) => member?.name || member?.label || '').filter(Boolean)
      : [];
  const quickStats = [
    { label: 'Status', value: task.status || 'todo', tone: task.status === 'done' ? 'green' : task.status === 'blocked' ? 'rose' : 'blue', icon: CheckCircle2 },
    { label: 'Priority', value: task.priority || 'Medium', tone: String(task.priority).toLowerCase() === 'critical' ? 'rose' : 'amber', icon: AlertCircle },
    { label: 'Timer', value: task.estimatedDurationMinutes ? formatDuration(Number(task.estimatedDurationMinutes) * 60) : 'No budget', tone: isBudgeted ? 'blue' : 'slate', icon: Clock3 },
    { label: 'Remaining', value: task.timerExpiresAt ? (timerExpired ? 'Expired' : formatDuration(Math.max(0, remainingSeconds || 0))) : '-', tone: timerExpired ? 'rose' : 'green', icon: Clock3 },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-8">
      <section className="theme-hero theme-hero-blue overflow-hidden p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <button type="button" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <p className="hero-kicker">Task Detail</p>
            <h1 className="hero-title break-words">{task.title || 'Untitled task'}</h1>
            <p className="hero-subtitle mt-2">{task.description || 'No description provided.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <TaskStatusBadge value={task.status} />
              <TaskPriorityBadge value={task.priority} />
              {task.projectName || task.project?.projectName ? (
                <Badge tone="blue">
                  <FolderKanban className="h-3.5 w-3.5" />
                  {task.projectName || task.project?.projectName}
                </Badge>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {canManage ? (
              <>
                <Button variant="secondary" onClick={() => setEditOpen(true)}>
                  <PencilLine className="h-4 w-4" />
                  Edit
                </Button>
                {canDelete ? (
                  <Button variant="danger" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((item) => <QuickStat key={item.label} {...item} />)}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4">
              <SectionTitle title="Task Snapshot" />
            </div>
            <CardBody className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <MetaItem icon={FolderKanban} label="Project" value={task.projectName || task.project?.projectName || '-'} />
              <MetaItem icon={CalendarDays} label="Stage" value={task.stage?.stageName || task.stage?.stageNo || task.projectStage || '-'} />
              <MetaItem icon={CalendarDays} label="Due Date" value={formatDate(task.dueDate)} />
              <MetaItem icon={UserRound} label="Assignee" value={task.assignee?.name || task.assigneeName || 'Unassigned'} />
              <MetaItem icon={UserRound} label="Raised By" value={task.reporter?.name || task.reporterName || task.createdBy?.name || '-'} />
              <MetaItem icon={UserRound} label="Backup Reviewer" value={task.backupReviewer?.name || task.backupReviewerName || '-'} />
              <MetaItem icon={Users} label="Team" value={task.team?.name || task.teamName || '-'} />
              <MetaItem icon={Users} label="Team Members" value={teamMemberNames.length ? teamMemberNames.join(', ') : '-'} />
              <MetaItem icon={CheckCircle2} label="Completed At" value={formatDateTime(task.completedAt)} />
            </CardBody>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4">
              <SectionTitle title="Work Details" />
            </div>
            <CardBody className="space-y-4">
              <DetailBlock label="Description" value={task.description || 'No description provided.'} />
              <DetailBlock label="Next Action" value={task.nextAction || '-'} />
              <div className="rounded-2xl border border-white/10 bg-white/60 p-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  <Tag className="h-3.5 w-3.5" />
                  Tags
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.isArray(task.tags) && task.tags.length ? task.tags.map((tag) => <Badge key={tag} tone="slate">{tag}</Badge>) : <span className="text-sm font-medium text-[rgb(var(--text))]">-</span>}
                </div>
              </div>
              <DetailBlock label="Attachments" value={Array.isArray(task.attachments) && task.attachments.length ? `${task.attachments.length} attachment(s)` : '-'} />
              <div className="grid gap-3 sm:grid-cols-2">
                <MetaItem label="Created" value={formatDateTime(task.createdAt)} />
                <MetaItem label="Updated" value={formatDateTime(task.updatedAt)} />
              </div>
            </CardBody>
          </Card>

          <Card className="overflow-hidden">
            <CardBody className="p-0">
              <TaskComments comments={task.comments || []} maxHeightClassName="max-h-[22rem]" onAdd={(text) => addComment.mutateAsync({ id: task.id, text })} />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6 xl:sticky xl:top-24 xl:self-start">
          <TimeExtensionRequestsPanel compact />
          <Card className="overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4">
              <SectionTitle title="Timer Control" />
            </div>
            <CardBody className="space-y-4">
              <div className="rounded-3xl border border-sky-400/20 bg-gradient-to-br from-sky-500/10 to-emerald-500/10 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Current Timer</div>
                    <div className="mt-2 text-3xl font-semibold text-[rgb(var(--text))]">
                      {task.timerExpiresAt ? (timerExpired ? 'Expired' : formatDuration(Math.max(0, remainingSeconds || 0))) : 'Not started'}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {task.estimatedDurationMinutes ? `${formatDuration(Number(task.estimatedDurationMinutes) * 60)} budget` : 'No completion timer configured'}
                    </div>
                  </div>
                  <Badge tone={timerExpired ? 'rose' : isThisTaskActive ? 'green' : 'slate'}>
                    {timerExpired ? 'Expired' : isThisTaskActive ? 'Running' : task.timerStatus || 'Not started'}
                  </Badge>
                </div>
              </div>
              <div className="grid gap-3">
                <MetaItem icon={Clock3} label="Budget" value={task.estimatedDurationMinutes ? formatDuration(Number(task.estimatedDurationMinutes) * 60) : 'No timer budget'} />
                <MetaItem icon={Clock3} label="Started" value={formatDateTime(task.timerStartedAt)} />
                <MetaItem icon={Clock3} label="Expires" value={formatDateTime(task.timerExpiresAt)} />
                <MetaItem icon={Clock3} label="Remaining" value={task.timerExpiresAt ? (timerExpired ? 'Expired' : formatDuration(Math.max(0, remainingSeconds || 0))) : '-'} />
                <MetaItem icon={Clock3} label="Logged" value={task.totalTimeLogged ? formatDuration(task.totalTimeLogged) : '-'} />
                <MetaItem icon={Clock3} label="Extra Granted" value={task.extraTimeMinutesGranted ? `${task.extraTimeMinutesGranted} minutes` : '-'} />
              </div>

              {task.status !== 'done' ? (
                <div className="flex flex-wrap gap-2 border-t border-[rgb(var(--line)/0.16)] pt-4">
                  {isThisTaskActive && isBudgeted ? (
                    <Button onClick={handleComplete}>
                      <CheckCircle2 className="h-4 w-4" />
                      Complete Task
                    </Button>
                  ) : canStart && !timerExpired ? (
                    <Button onClick={() => startTimer(task.id, projectId, stageId, '')}>
                      <PlayCircle className="h-4 w-4" />
                      Start Timer
                    </Button>
                  ) : null}
                  {timerExpired && canStart ? (
                    <Button variant="danger" disabled={Boolean(task.pendingTimeExtensionRequest)} onClick={() => setRequestOpen((current) => !current)}>
                      {task.pendingTimeExtensionRequest ? 'Extra Time Pending' : 'Request Extra Time'}
                    </Button>
                  ) : null}
                </div>
              ) : null}

              {requestOpen && !task.pendingTimeExtensionRequest ? (
                <div className="grid gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3">
                  <input className="input" type="number" min="1" value={requestedMinutes} onChange={(event) => setRequestedMinutes(event.target.value)} placeholder="Minutes" />
                  <textarea className="input min-h-[96px]" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Valid reason for extra time" />
                  <Button
                    variant="danger"
                    disabled={!reason.trim() || !Number(requestedMinutes)}
                    onClick={async () => {
                      await requestExtension.mutateAsync({ id: task.id, payload: { requestedMinutes: Number(requestedMinutes), reason } });
                      setReason('');
                      setRequestOpen(false);
                    }}
                  >
                    Submit Request
                  </Button>
                </div>
              ) : null}

              {task.latestTimeExtensionRequest ? (
                <DetailBlock
                  label="Latest Extra-Time Request"
                  value={`${task.latestTimeExtensionRequest.status} · ${task.latestTimeExtensionRequest.requestedMinutes} minutes · ${task.latestTimeExtensionRequest.reason}`}
                />
              ) : null}
            </CardBody>
          </Card>
        </div>
      </div>

      {editOpen ? (
        <ModalShell title="Edit Task" description="Update task details." onClose={() => setEditOpen(false)} widthClassName="max-w-4xl">
          <TaskForm
            initialValues={task}
            projects={task.project ? [task.project] : []}
            stageOptions={stagesQuery.data || []}
            teams={teamsQuery.data || []}
            employees={employeesQuery.data || []}
            currentUser={currentUser}
            reporter={currentUser?.id || ''}
            onSubmit={handleEdit}
            onCancel={() => setEditOpen(false)}
          />
        </ModalShell>
      ) : null}
    </motion.div>
  );
}

function SectionTitle({ title }) {
  return <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</div>;
}

function QuickStat({ label, value, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'border-sky-200 bg-sky-50/80 text-sky-700',
    green: 'border-emerald-200 bg-emerald-50/80 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50/80 text-amber-700',
    rose: 'border-rose-200 bg-rose-50/80 text-rose-700',
    slate: 'border-slate-200 bg-white/70 text-slate-700',
  };
  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-sm ${tones[tone] || tones.blue}`}>
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] opacity-80">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-2 truncate text-lg font-semibold text-[rgb(var(--text))]">{String(value || '-')}</div>
    </div>
  );
}

function DetailBlock({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/60 p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 whitespace-pre-wrap text-sm font-medium text-[rgb(var(--text))]">{String(value || '-')}</div>
    </div>
  );
}

function MetaItem({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/60 p-4">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
        {Icon ? <Icon className="h-3.5 w-3.5 text-slate-400" /> : null}
        <span>{label}</span>
      </div>
      <div className="mt-2 text-sm font-semibold text-[rgb(var(--text))]">{String(value || '-')}</div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return format(date, 'dd MMM yyyy');
}

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return format(date, 'dd MMM yyyy, hh:mm a');
}
