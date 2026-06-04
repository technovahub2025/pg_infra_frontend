import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { pageVariants } from '../utils/motionVariants';
import { useProjects } from '../hooks/useProjects';
import { useBilling, useBillingSummary, useCreateInvoice, useDeleteInvoice, useUpdateInvoice } from '../hooks/useBilling';
import { BillingKPIRow } from '../components/billing/BillingKPIRow';
import { BillingForm } from '../components/billing/BillingForm';
import { BillingTable } from '../components/billing/BillingTable';
import { ModalShell } from '../components/shared/ModalShell';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { EmptyState } from '../components/shared/EmptyState';
import { Button } from '../components/ui/button';
import { Card, CardBody } from '../components/ui/card';

export default function BillingPage() {
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const projectsQuery = useProjects();
  const invoicesQuery = useBilling();
  const summaryQuery = useBillingSummary();
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();
  const deleteInvoice = useDeleteInvoice();

  const invoices = useMemo(() => invoicesQuery.data || [], [invoicesQuery.data]);
  const projects = useMemo(() => projectsQuery.data || [], [projectsQuery.data]);
  const summary = summaryQuery.data || {};

  const projectsById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
  const rows = invoices;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-8">
      <section className="theme-hero theme-hero-amber p-5 sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="hero-kicker">Billing</p>
            <h1 className="hero-title">Revenue and billing overview</h1>
            <p className="hero-subtitle max-w-3xl">Live invoices, outstanding balances, and billing progress.</p>
          </div>
          <Button onClick={() => { setEditingInvoice(null); setFormOpen(true); }}>Create Invoice</Button>
        </div>
      </section>

      {projectsQuery.isError || invoicesQuery.isError || summaryQuery.isError ? (
        <Card>
          <CardBody className="flex items-center gap-3 py-10">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[rgb(var(--text))]">
                {projectsQuery.error?.message || invoicesQuery.error?.message || summaryQuery.error?.message || 'Failed to load billing data'}
              </div>
              <div className="text-xs text-slate-500">Retry once the API is available.</div>
            </div>
            <Button variant="secondary" onClick={() => { projectsQuery.refetch(); invoicesQuery.refetch(); summaryQuery.refetch(); }}>Retry</Button>
          </CardBody>
        </Card>
      ) : null}

      {summaryQuery.isLoading ? <SkeletonCard /> : <BillingKPIRow summary={summary} />}

      {projectsQuery.isLoading || invoicesQuery.isLoading ? (
        <SkeletonCard />
      ) : rows.length ? (
        <BillingTable
          rows={rows.map((row) => ({
            ...row,
            project: row.project || projectsById.get(row.project?.id || row.projectId),
          }))}
          onCreate={() => {
            setEditingInvoice(null);
            setFormOpen(true);
          }}
          onEdit={(row) => {
            setEditingInvoice(row);
            setFormOpen(true);
          }}
          onDelete={(row) => deleteInvoice.mutate(row.id)}
        />
      ) : (
        <EmptyState title="No invoices yet" description="Create the first project invoice to start billing." action={<Button onClick={() => setFormOpen(true)}>Create Invoice</Button>} />
      )}

      {formOpen ? (
        <ModalShell
          title={editingInvoice ? 'Edit Invoice' : 'Create Invoice'}
          description="Create or update project billing details."
          onClose={() => setFormOpen(false)}
          widthClassName="max-w-4xl"
        >
          <BillingForm
            initialValues={editingInvoice}
            projects={projects}
            onCancel={() => setFormOpen(false)}
            onSubmit={async (payload) => {
              if (editingInvoice) {
                await updateInvoice.mutateAsync({ id: editingInvoice.id, payload });
              } else {
                await createInvoice.mutateAsync(payload);
              }
              setFormOpen(false);
              setEditingInvoice(null);
            }}
          />
        </ModalShell>
      ) : null}
    </motion.div>
  );
}
