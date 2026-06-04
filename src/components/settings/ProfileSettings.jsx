import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional().default(''),
  designation: z.string().optional().default(''),
  department: z.string().optional().default(''),
});

export function ProfileSettings({ initialValues, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name || '',
      phone: initialValues?.phone || '',
      designation: initialValues?.designation || '',
      department: initialValues?.department || '',
    },
  });

  useEffect(() => {
    form.reset({
      name: initialValues?.name || '',
      phone: initialValues?.phone || '',
      designation: initialValues?.designation || '',
      department: initialValues?.department || '',
    });
  }, [initialValues, form]);

  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
      <Field label="Name"><input className="input" {...form.register('name')} /></Field>
      <Field label="Phone"><input className="input" {...form.register('phone')} /></Field>
      <Field label="Designation"><input className="input" {...form.register('designation')} /></Field>
      <Field label="Department"><input className="input" {...form.register('department')} /></Field>
      <div className="sm:col-span-2 flex justify-end">
        <Button type="submit">Save Profile</Button>
      </div>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      {children}
    </label>
  );
}
