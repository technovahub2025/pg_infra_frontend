import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { NotificationBadge } from './NotificationBadge';

export function NotificationBell({ count = 0, onClick }) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="relative h-10 w-10 shrink-0 rounded-xl px-0"
      onClick={onClick}
      aria-label="Notifications"
      title="Notifications"
    >
      <Bell className="h-4 w-4 shrink-0" />
      <NotificationBadge count={count} className="absolute -right-1 -top-1" />
    </Button>
  );
}
