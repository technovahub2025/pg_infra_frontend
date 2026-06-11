import { useState } from 'react';
import {
  useApproveTaskTimeExtensionRequest,
  usePendingTaskTimeExtensionRequests,
  useRejectTaskTimeExtensionRequest,
} from '../../hooks/useTasks';
import { formatDuration } from '../../store/timerStore';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function TimeExtensionRequestsPanel({ compact = false }) {
  const requestsQuery = usePendingTaskTimeExtensionRequests();
  const approveRequest = useApproveTaskTimeExtensionRequest();
  const rejectRequest = useRejectTaskTimeExtensionRequest();
  const [minutesById, setMinutesById] = useState({});
  const [noteById, setNoteById] = useState({});
  const requests = requestsQuery.data || [];

  if (!requests.length && compact) return null;

  return (
    <div className="rounded-3xl border border-amber-400/20 bg-amber-500/10 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-amber-700">Extra Time</div>
          <div className="mt-1 text-sm font-semibold text-[rgb(var(--text))]">Pending approvals</div>
        </div>
        <Badge tone={requests.length ? 'amber' : 'slate'}>{requests.length}</Badge>
      </div>

      <div className="mt-4 space-y-3">
        {requestsQuery.isLoading ? (
          <div className="text-sm text-slate-500">Loading requests...</div>
        ) : requests.length ? (
          requests.map((request) => {
            const task = request.task || {};
            const requestId = request.id || request._id;
            const grantedMinutes = Number(minutesById[requestId] || request.requestedMinutes || 0);
            return (
              <div key={requestId} className="rounded-2xl border border-white/20 bg-white/70 p-3 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-[rgb(var(--text))]">{task.title || 'Task'}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {request.employee?.name || 'Employee'} requested {formatDuration(Number(request.requestedMinutes || 0) * 60)}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">{request.reason}</div>
                  </div>
                  <Badge tone="amber">Pending</Badge>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-[120px_minmax(0,1fr)]">
                  <input
                    className="input h-10"
                    type="number"
                    min="1"
                    value={grantedMinutes}
                    onChange={(event) => setMinutesById((current) => ({ ...current, [requestId]: event.target.value }))}
                    placeholder="Minutes"
                  />
                  <input
                    className="input h-10"
                    value={noteById[requestId] || ''}
                    onChange={(event) => setNoteById((current) => ({ ...current, [requestId]: event.target.value }))}
                    placeholder="Decision note"
                  />
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => rejectRequest.mutate({ id: requestId, payload: { decisionNote: noteById[requestId] || '' } })}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      approveRequest.mutate({
                        id: requestId,
                        payload: { grantedMinutes, decisionNote: noteById[requestId] || '' },
                      })
                    }
                  >
                    Approve
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-slate-500">No pending extra-time requests.</div>
        )}
      </div>
    </div>
  );
}
