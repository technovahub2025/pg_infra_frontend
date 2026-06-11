import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export function FilterChips({ options = [], value, onChange, toneMap = {} }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = Array.isArray(value)
          ? value.some((item) => String(item) === String(option.value))
          : value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              if (Array.isArray(value)) {
                const next = isActive
                  ? value.filter((item) => String(item) !== String(option.value))
                  : [...value, option.value];
                onChange(next);
                return;
              }

              onChange(option.value);
            }}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ring-1 transition',
              isActive ? 'scale-[1.03] opacity-100 shadow-sm ring-2' : 'opacity-65 hover:opacity-95',
              toneMap[option.tone || 'slate'] || toneMap.slate || 'bg-[rgb(var(--panel-2)/0.82)] text-[rgb(var(--text))] ring-[rgb(var(--line)/0.16)]',
            )}
          >
            {isActive ? <Check className="h-3 w-3" /> : null}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
