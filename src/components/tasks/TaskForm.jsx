import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

const schema = z.object({
  title: z.string().min(2, 'Task title is required'),
  description: z.string().optional(),
  project: z.string().min(1, 'Project is required'),
  stage: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
  nextAction: z.string().optional(),
  tags: z.string().optional(),
});

export function TaskForm({ initialValues, projects = [], employees = [], assignee = '', onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      project: '',
      stage: '',
      priority: 'Medium',
      status: 'todo',
      startDate: '',
      dueDate: '',
      assignee,
      nextAction: '',
      tags: '',
    },
  });
  const projectValue = watch('project');
  const assigneeValue = watch('assignee');

  useEffect(() => {
    if (initialValues) {
      reset({
        title: initialValues.title || '',
        description: initialValues.description || '',
        project: initialValues.projectId || initialValues.project?.id || initialValues.project?._id || initialValues.project || '',
        stage: initialValues.stageId || initialValues.stage?.id || initialValues.stage?._id || initialValues.stage || '',
        priority: initialValues.priority || 'Medium',
        status: initialValues.status || 'todo',
        startDate: (initialValues.startDate || '').slice?.(0, 10) || '',
        dueDate: (initialValues.dueDate || '').slice?.(0, 10) || '',
        assignee: initialValues.assigneeId || initialValues.assignee?._id || initialValues.assignee?.id || initialValues.assignee || assignee || '',
        nextAction: initialValues.nextAction || '',
        tags: Array.isArray(initialValues.tags) ? initialValues.tags.join(', ') : initialValues.tags || '',
      });
    }
  }, [assignee, initialValues, reset]);

  const selectedProject = useMemo(
    () => projects.find((project) => String(project.id || project._id) === String(projectValue)),
    [projectValue, projects],
  );
  const selectedAssignee = useMemo(
    () => employees.find((employee) => String(employee.id || employee._id) === String(assigneeValue)),
    [assigneeValue, employees],
  );

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
      <Field label="Title"><input className="input" {...register('title')} /></Field>
      <DropdownField
        label="Project"
        value={projectValue}
        onChange={(nextValue) => setValue('project', nextValue, { shouldValidate: true, shouldDirty: true })}
        placeholder="Select project"
        selectedLabel={selectedProject ? (selectedProject.projectName || selectedProject.name || 'Select project') : 'Select project'}
        options={projects.map((project) => {
          const projectId = project.id || project._id;
          return {
            value: projectId,
            label: project.projectName || project.name || 'Untitled project',
          };
        })}
        className="sm:col-span-1"
      />
      <Field label="Description" className="sm:col-span-2"><textarea className="input min-h-[96px]" {...register('description')} /></Field>
      <Field label="Stage"><input className="input" {...register('stage')} /></Field>
      <Field label="Priority"><input className="input" {...register('priority')} /></Field>
      <Field label="Status"><input className="input" {...register('status')} /></Field>
      <Field label="Start Date"><input className="input" type="date" {...register('startDate')} /></Field>
      <Field label="Due Date"><input className="input" type="date" {...register('dueDate')} /></Field>
      <DropdownField
        label="Assignee"
        value={assigneeValue}
        onChange={(nextValue) => setValue('assignee', nextValue, { shouldValidate: true, shouldDirty: true })}
        placeholder="Unassigned"
        selectedLabel={selectedAssignee ? (selectedAssignee.name || selectedAssignee.label || selectedAssignee.email || 'Unassigned') : 'Unassigned'}
        options={employees.map((employee) => {
          const employeeId = employee.id || employee._id;
          return {
            value: employeeId,
            label: employee.name || employee.label || employee.email || 'Unnamed user',
          };
        })}
        emptyValue=""
        className="sm:col-span-1"
      />
      <Field label="Next Action" className="sm:col-span-2"><input className="input" {...register('nextAction')} /></Field>
      <Field label="Tags" className="sm:col-span-2"><input className="input" {...register('tags')} /></Field>
      <div className="sm:col-span-2 flex justify-end gap-3 border-t border-[rgb(var(--line)/0.16)] pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>Save Task</Button>
      </div>
    </form>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function DropdownField({
  label,
  value,
  onChange,
  placeholder,
  selectedLabel,
  options = [],
  emptyValue = '',
  className = '',
}) {
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    const updateRect = () => {
      if (!wrapRef.current) return;
      setRect(wrapRef.current.getBoundingClientRect());
    };
    updateRect();

    const close = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const menu = open && rect && typeof document !== 'undefined'
    ? createPortal(
      <div
        className="fixed z-[80] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
        style={{
          left: rect.left,
          top: rect.bottom + 6,
          width: rect.width,
        }}
      >
        <div className="max-h-64 overflow-y-auto py-1">
          <button
            type="button"
            onClick={() => {
              onChange(emptyValue);
              setOpen(false);
            }}
            className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition ${String(value || '') === String(emptyValue || '') ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}
          >
            <span className="min-w-0 flex-1 truncate">{placeholder}</span>
            {String(value || '') === String(emptyValue || '') ? <Check className="h-4 w-4 flex-shrink-0 text-sky-600" /> : null}
          </button>
          {options.map((option) => {
            const isActive = String(option.value) === String(value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition ${isActive ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-50'}`}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {isActive ? <Check className="h-4 w-4 flex-shrink-0 text-sky-600" /> : null}
              </button>
            );
          })}
        </div>
      </div>,
      document.body,
    )
    : null;

  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <div ref={wrapRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-11 w-full items-center gap-3 rounded-2xl border border-sky-200 bg-white px-4 text-left text-sm text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-slate-50"
        >
          <span className="min-w-0 flex-1 truncate">{selectedLabel || placeholder}</span>
          <ChevronDown className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {menu}
    </label>
  );
}
