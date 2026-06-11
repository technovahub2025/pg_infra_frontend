import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, FileDown, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const ITEMS = [
  { key: 'excel', label: 'Export Excel', icon: FileSpreadsheet },
  { key: 'csv', label: 'Export CSV', icon: FileText },
  { key: 'pdf', label: 'Export PDF', icon: FileDown },
];

export function ExportDropdown({ onExport }) {
  const wrapRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!open) return undefined;

    const updateRect = () => {
      if (!wrapRef.current) return;
      setRect(wrapRef.current.getBoundingClientRect());
    };
    updateRect();

    const onPointerDown = (event) => {
      const target = event.target;
      const clickedTrigger = wrapRef.current && wrapRef.current.contains(target);
      const clickedMenu = menuRef.current && menuRef.current.contains(target);
      if (!clickedTrigger && !clickedMenu) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const menu =
    open && rect && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={menuRef}
            className="fixed z-[95] w-56 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[rgb(var(--line)/0.14)] bg-[rgb(var(--panel)/0.98)] p-2 shadow-2xl shadow-slate-950/20 backdrop-blur-xl"
            style={{ left: Math.max(16, rect.right - 224), top: rect.bottom + 8 }}
          >
            {ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-[rgb(var(--text))] transition hover:bg-[rgb(var(--panel-2)/0.82)]"
                  onClick={() => {
                    onExport?.(item.key);
                    setOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4 text-slate-500" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={wrapRef} className="relative">
      <Button variant="secondary" onClick={() => setOpen((current) => !current)}>
        Export
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </Button>
      {menu}
    </div>
  );
}
