import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';

const schema = z.object({
  projectName: z.string().min(2, 'Project name is required'),
  clientName: z.string().min(2, 'Client name is required'),
  companySegment: z.string().optional(),
  projectType: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
  projectValue: z.string().optional(),
  overallStatus: z.string().optional(),
  currentStage: z.string().optional(),
  stageCompletion: z.string().optional(),
  clientApprovalStatus: z.string().optional(),
  nextActionRequired: z.string().optional(),
  priority: z.string().optional(),
  invoiceStatus: z.string().optional(),
  recv: z.string().optional(),
  balance: z.string().optional(),
});

export function ProjectForm({ initialValues, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      projectName: '',
      clientName: '',
      companySegment: 'Residential',
      projectType: 'Structural',
      location: '',
      startDate: '',
      targetDate: '',
      projectValue: '',
      overallStatus: 'In Progress',
      currentStage: 'Concept Design',
      stageCompletion: '0',
      clientApprovalStatus: 'Not Submitted',
      nextActionRequired: '',
      priority: 'Medium',
      invoiceStatus: '',
      recv: '',
      balance: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        projectName: initialValues.projectName || '',
        clientName: initialValues.clientName || '',
        companySegment: initialValues.companySegment || 'Residential',
        projectType: Array.isArray(initialValues.projectType) ? initialValues.projectType.join(', ') : initialValues.projectType || '',
        location: initialValues.location || '',
        startDate: (initialValues.startDate || '').slice?.(0, 10) || '',
        targetDate: (initialValues.targetDate || '').slice?.(0, 10) || '',
        projectValue: String(initialValues.projectValue ?? ''),
        overallStatus: initialValues.overallStatus || 'In Progress',
        currentStage: initialValues.currentStage || 'Concept Design',
        stageCompletion: String(initialValues.stageCompletion ?? 0),
        clientApprovalStatus: initialValues.clientApprovalStatus || 'Not Submitted',
        nextActionRequired: initialValues.nextActionRequired || '',
        priority: initialValues.priority || 'Medium',
        invoiceStatus: initialValues.invoiceStatus || '',
        recv: String(initialValues.recv ?? ''),
        balance: String(initialValues.balance ?? ''),
      });
    }
  }, [initialValues, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      projectType: values.projectType ? values.projectType.split(',').map((item) => item.trim()).filter(Boolean) : [],
      projectValue: Number(values.projectValue || 0),
      stageCompletion: Number(values.stageCompletion || 0),
      recv: Number(values.recv || 0),
      balance: Number(values.balance || 0),
    });
  });

  return (
    <form className="grid gap-3 sm:grid-cols-2 sm:gap-4" onSubmit={submit}>
      <Field label="Project Name" error={errors.projectName?.message}>
        <input className="input" {...register('projectName')} />
      </Field>
      <Field label="Client Name" error={errors.clientName?.message}>
        <input className="input" {...register('clientName')} />
      </Field>
      <Field label="Company Segment">
        <input className="input" {...register('companySegment')} />
      </Field>
      <Field label="Project Type">
        <input className="input" {...register('projectType')} />
      </Field>
      <Field label="Location">
        <input className="input" {...register('location')} />
      </Field>
      <Field label="Project Value">
        <input className="input" type="number" step="0.01" {...register('projectValue')} />
      </Field>
      <Field label="Start Date">
        <input className="input" type="date" {...register('startDate')} />
      </Field>
      <Field label="Target Date">
        <input className="input" type="date" {...register('targetDate')} />
      </Field>
      <Field label="Overall Status">
        <input className="input" {...register('overallStatus')} />
      </Field>
      <Field label="Current Stage">
        <input className="input" {...register('currentStage')} />
      </Field>
      <Field label="Stage Completion">
        <input className="input" type="number" min="0" max="100" {...register('stageCompletion')} />
      </Field>
      <Field label="Client Approval">
        <input className="input" {...register('clientApprovalStatus')} />
      </Field>
      <Field label="Next Action">
        <input className="input" {...register('nextActionRequired')} />
      </Field>
      <Field label="Priority">
        <input className="input" {...register('priority')} />
      </Field>
      <Field label="Invoice Status">
        <input className="input" {...register('invoiceStatus')} />
      </Field>
      <Field label="Received">
        <input className="input" type="number" step="0.01" {...register('recv')} />
      </Field>
      <Field label="Balance">
        <input className="input" type="number" step="0.01" {...register('balance')} />
      </Field>

      <div className="sm:col-span-2 mt-2 flex flex-col gap-3 border-t border-[rgba(15,23,42,0.08)] bg-[#ffffff] px-5 py-4 -mx-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Save Project
        </Button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
