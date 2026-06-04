import { cn } from '../../lib/utils';

export function FilterChips({ options = [], value, onChange, toneMap = {} }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1 transition',
            value === option.value ? 'scale-[1.02] shadow-sm' : 'opacity-80 hover:opacity-100',
            toneMap[option.tone || 'slate'] || toneMap.slate || 'bg-[rgb(var(--panel-2)/0.82)] text-[rgb(var(--text))] ring-[rgb(var(--line)/0.16)]',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

