import { Card, CardBody } from '../ui/card';
import { TaskCountdown } from './TaskCountdown';
import { TaskPriorityBadge } from './TaskPriorityBadge';
import { TaskStatusBadge } from './TaskStatusBadge';
import { Clock3, PauseCircle, PlayCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTimer } from '../../hooks/useTimer';
import { Badge } from '../ui/badge';
import { formatDuration } from '../../store/timerStore';

export function TaskCard({ task, onClick, showProject = false }) {
  const user = useAuthStore((state) => state.user);
  const { isRunning, activeLog, elapsedSeconds, startTimer, stopTimer } = useTimer();
  const taskId = task.id || task._id;
  const projectId = task.project?.id || task.project?._id || task.projectId || task.project;
  const stageId = task.stage?.id || task.stage?._id || task.stageId || task.stage;
  const assigneeId = task.assignee?._id || task.assignee?.id || task.assignee;
  const canStart = ['superadmin', 'admin'].includes(user?.role) || String(assigneeId) === String(user?.id);
  const isThisTaskActive = isRunning && String(activeLog?.task?.id || activeLog?.task?._id || activeLog?.task) === String(taskId);

  return (
    <Card className="cursor-pointer transition hover:translate-y-[-1px]" onClick={onClick}>
      <CardBody>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold text-[rgb(var(--text))]">{task.title}</div>
            <div className="mt-1 text-xs text-slate-400">{showProject ? task.projectName || task.project?.projectName : task.projectName}</div>
          </div>
          <TaskStatusBadge value={task.status} />
        </div>
        <div className="mt-3 text-sm text-slate-300">{task.description}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          <TaskPriorityBadge value={task.priority} />
          <TaskCountdown dueDate={task.dueDate} />
          {Number(task.totalTimeLogged || 0) > 0 ? (
            <Badge tone="blue">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDuration(task.totalTimeLogged)}
            </Badge>
          ) : null}
        </div>
        {task.status !== 'done' ? (
          <div className="mt-4 flex items-center gap-2">
            {isThisTaskActive ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-300 ring-1 ring-rose-400/20"
                onClick={(event) => {
                  event.stopPropagation();
                  stopTimer();
                }}
              >
                <PauseCircle className="h-4 w-4" />
                Stop
                <span className="rounded-full bg-rose-400/20 px-2 py-0.5 text-[10px]">{formatDuration(elapsedSeconds)}</span>
              </button>
            ) : canStart ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-2 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/20"
                onClick={(event) => {
                  event.stopPropagation();
                  startTimer(taskId, projectId, stageId, '');
                }}
              >
                <PlayCircle className="h-4 w-4" />
                Start Timer
              </button>
            ) : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
