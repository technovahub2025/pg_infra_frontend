import { Check, ChevronDown, Filter } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { SearchInput } from '../shared/SearchInput';

const STATUS_OPTIONS = [
  { label: 'All', value: 'all', tone: 'slate' },
  { label: 'In Progress', value: 'In Progress', tone: 'blue' },
  { label: 'Completed', value: 'Completed', tone: 'green' },
  { label: 'On Hold', value: 'On Hold', tone: 'amber' },
];

const SEGMENT_OPTIONS = [
  { label: 'All Segments', value: 'all', tone: 'slate' },
  { label: 'Residential', value: 'Residential', tone: 'sky' },
  { label: 'Commercial', value: 'Commercial', tone: 'amber' },
  { label: 'Industrial', value: 'Industrial', tone: 'green' },
  { label: 'Manufacturing', value: 'Manufacturing', tone: 'rose' },
];

const PRIORITY_OPTIONS = [
  { label: 'All Priorities', value: 'all', tone: 'slate' },
  { label: 'Critical', value: 'Critical', tone: 'rose' },
  { label: 'High', value: 'High', tone: 'amber' },
  { label: 'Medium', value: 'Medium', tone: 'blue' },
  { label: 'Low', value: 'Low', tone: 'green' },
];

export function ProjectFilters({ search, onSearchChange, filters, onChange, showFilters, onToggleFilters }) {
  const [expanded, setExpanded] = useState('');

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-1 items-center gap-2">
          <SearchInput
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search projects, clients, stages..."
            className="min-w-0"
          />
          <Button
            type="button"
            variant={showFilters ? 'primary' : 'secondary'}
            size="sm"
            className="shrink-0 whitespace-nowrap"
            onClick={onToggleFilters}
            title="Toggle filters"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      {showFilters ? (
        <div className="grid gap-3 rounded-2xl border border-[rgb(var(--line)/0.16)] bg-[rgb(var(--panel-2)/0.72)] p-3 lg:grid-cols-3">
          <FilterGroup
            label="Status"
            summary={formatSummary(filters.status, 'Select status')}
            value={filters.status}
            options={STATUS_OPTIONS}
            onChange={(value) => onChange('status', value)}
            expanded={expanded === 'status'}
            onToggle={() => setExpanded((current) => (current === 'status' ? '' : 'status'))}
          />
          <FilterGroup
            label="Segment"
            summary={formatSummary(filters.segment, 'Select segment')}
            value={filters.segment}
            options={SEGMENT_OPTIONS}
            onChange={(value) => onChange('segment', value)}
            expanded={expanded === 'segment'}
            onToggle={() => setExpanded((current) => (current === 'segment' ? '' : 'segment'))}
          />
          <FilterGroup
            label="Priority"
            summary={formatSummary(filters.priority, 'Select priority')}
            value={filters.priority}
            options={PRIORITY_OPTIONS}
            onChange={(value) => onChange('priority', value)}
            expanded={expanded === 'priority'}
            onToggle={() => setExpanded((current) => (current === 'priority' ? '' : 'priority'))}
          />
        </div>
      ) : null}
    </div>
  );
}

function FilterGroup({ label, summary, value, options, onChange, expanded, onToggle }) {
  return (
    <div className="rounded-2xl border border-[rgb(var(--line)/0.14)] bg-[rgb(var(--panel)/0.9)] p-3">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 rounded-xl px-1 py-1 text-left transition hover:bg-[rgb(var(--panel-2)/0.5)]"
      >
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</div>
          <div className="mt-1 text-sm font-medium text-[rgb(var(--text))]">{summary}</div>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded ? (
        <div className="mt-3 max-h-40 overflow-y-auto pr-1">
          <div className="space-y-1">
            {options.map((option) => {
              const active = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChange(option.value)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                    active
                      ? 'bg-sky-500/10 text-sky-300 ring-1 ring-sky-400/20'
                      : 'text-[rgb(var(--text))] hover:bg-[rgb(var(--panel-2)/0.82)]'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  <span
                    className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1 ${
                      active
                        ? 'bg-sky-500 text-slate-950 ring-sky-300/40'
                        : 'bg-transparent text-transparent ring-[rgb(var(--line)/0.16)]'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatSummary(value, fallback) {
  if (!value || value === 'all') return fallback;
  return value;
}
