import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModalShell } from '../shared/ModalShell';
import { Button } from '../ui/button';
import { DropdownField } from '../shared/DropdownField';

const schema = z.object({ role: z.enum(['employee', 'admin']) });

export function RoleChangeModal({ open, onClose, onSubmit, initialValues }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: initialValues?.role || 'employee' },
  });

  useEffect(() => {
    if (open) {
      form.reset({ role: initialValues?.role || 'employee' });
    }
  }, [open, initialValues, form]);

  if (!open) return null;

  return (
    <ModalShell title="Change Role" description="Update the selected team member." onClose={onClose} widthClassName="max-w-xl">
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Role</span>
          <DropdownField
            value={form.watch('role')}
            onChange={(nextValue) => form.setValue('role', nextValue, { shouldDirty: true, shouldValidate: true })}
            options={[
              { value: 'employee', label: 'Employee' },
              { value: 'admin', label: 'Admin' },
            ]}
            placeholder="Select role"
          />
        </label>
        <div className="flex justify-end gap-3 border-t border-[rgb(var(--line)/0.16)] pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </ModalShell>
  );
}
