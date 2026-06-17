import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function EmployeeProfileTabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div
      className={cn(
        'scrollbar-none flex gap-2 overflow-x-auto rounded-[22px] border border-[rgb(var(--line)/0.12)] bg-[rgb(var(--panel)/0.9)] p-2 shadow-[0_14px_40px_rgba(15,23,42,0.06)] backdrop-blur',
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            'relative isolate shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ease-out',
            activeTab === tab
              ? 'text-slate-950'
              : 'text-slate-500 hover:text-slate-700',
          )}
        >
          {activeTab === tab ? (
            <motion.span
              layoutId="employee-profile-tab-pill"
              transition={{ type: 'spring', stiffness: 520, damping: 42 }}
              className="absolute inset-0 -z-10 rounded-full bg-sky-500 shadow-[0_10px_24px_rgba(14,165,233,0.24)]"
            />
          ) : null}
          {tab}
        </button>
      ))}
    </div>
  );
}
