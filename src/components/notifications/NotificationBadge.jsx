import { cn } from '../../lib/utils';

export function NotificationBadge({ count = 0, className = '' }) {
  if (!count) return null;
  return (
    <span className={cn('inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white', className)}>
      {count > 99 ? '99+' : count}
    </span>
  );
}
