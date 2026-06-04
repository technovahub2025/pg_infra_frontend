import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Card } from '../ui/card';
import { useEffect } from 'react';

export function ModalShell({ title, description, onClose, children, widthClassName = 'max-w-4xl' }) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const dialog = (
    <div className="fixed inset-0 z-[60] m-0 flex items-end justify-center overflow-y-auto bg-slate-950/80 backdrop-blur-sm sm:items-start">
      <Card
        className={`m-0 mt-0 flex w-full ${widthClassName} max-h-[92dvh] flex-col overflow-hidden rounded-t-[28px] border border-[rgba(255,255,255,0.08)] bg-[#bfc0c6] shadow-[0_32px_96px_rgba(15,23,42,0.35)] sm:max-h-[100vh] sm:rounded-[28px]`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[rgba(255,255,255,0.14)] px-5 py-4">
          <div>
            <div className="font-display text-lg font-semibold text-slate-900">{title}</div>
            {description ? <div className="mt-1 text-sm text-slate-600">{description}</div> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#f5f6f8] p-2 text-slate-900 shadow-sm transition hover:bg-white"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto bg-[#bfc0c6] px-5 py-4">{children}</div>
      </Card>
    </div>
  );

  if (typeof document === 'undefined') {
    return dialog;
  }

  return createPortal(dialog, document.body);
}
