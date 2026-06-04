import { Search } from 'lucide-react';

export function SearchInput(props) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-[rgb(var(--line)/0.16)] bg-[rgb(var(--panel-2)/0.82)] px-3 py-2 text-sm text-slate-400">
      <Search className="h-4 w-4" />
      <input {...props} className={`w-full bg-transparent outline-none placeholder:text-slate-500 ${props.className || ''}`} />
    </label>
  );
}

