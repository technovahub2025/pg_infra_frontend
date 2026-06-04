import { Card, CardBody } from '../ui/card';
import { Button } from '../ui/button';

export function PendingInviteList({ invites = [], onResend, onRevoke }) {
  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="text-sm font-semibold text-[rgb(var(--text))]">Pending Invites</div>
        {invites.length ? invites.map((invite) => (
          <div key={invite.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-[rgb(var(--text))]">{invite.name}</div>
                <div className="text-xs text-slate-500">{invite.email}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => onResend?.(invite)}>Resend</Button>
                <Button size="sm" variant="danger" onClick={() => onRevoke?.(invite)}>Revoke</Button>
              </div>
            </div>
          </div>
        )) : <div className="text-sm text-slate-400">No pending invites.</div>}
      </CardBody>
    </Card>
  );
}
