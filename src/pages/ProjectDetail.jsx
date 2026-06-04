import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AlertCircle } from 'lucide-react';
import { pageVariants } from '../utils/motionVariants';
import { useProject, useProjectStages, useCreateProject, useUpdateProject, useDeleteProject } from '../hooks/useProjects';
import { useStages, useCreateStage, useUpdateStage, useDeleteStage, useApproveStage } from '../hooks/useStages';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useAddTaskComment } from '../hooks/useTasks';
import { useProjectInvoice, useCreateInvoice, useUpdateInvoice } from '../hooks/useBilling';
import { useActivityLogs } from '../hooks/useActivityLogs';
import { useUiStore } from '../store/uiStore';
import { Button } from '../components/ui/button';
import { Card, CardBody } from '../components/ui/card';
import { ProjectForm } from '../components/projects/ProjectForm';
import { StageTimeline } from '../components/stages/StageTimeline';
import { StageTable } from '../components/stages/StageTable';
import { StageForm } from '../components/stages/StageForm';
import { StageGuideCard } from '../components/stages/StageGuideCard';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskComments } from '../components/tasks/TaskComments';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { EmptyState } from '../components/shared/EmptyState';
import { TaskStatusBadge } from '../components/tasks/TaskStatusBadge';
import { ProjectStatusBadge } from '../components/projects/ProjectStatusBadge';
import { ModalShell } from '../components/shared/ModalShell';
import { DocumentList } from '../components/upload/DocumentList';
import { FilterChips } from '../components/shared/FilterChips';
import { BillingProgressBar } from '../components/billing/BillingProgressBar';
import { BillingForm } from '../components/billing/BillingForm';
import { RoleGuard } from '../components/layout/RoleGuard';

const tabs = ['Overview', 'Stages', 'Tasks', 'Documents', 'Billing', 'Activity Log'];

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeDocCategory, setActiveDocCategory] = useState('all');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const projectQuery = useProject(id);
  const invoiceQuery = useProjectInvoice(id);
  const stagesQuery = useProjectStages(id);
  const tasksQuery = useTasks({ project: id });
  const activityQuery = useActivityLogs({ project: id, limit: 20 });
  const { activeModal, modalData, openModal, closeModal, openConfirm } = useUiStore();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const createStage = useCreateStage();
  const updateStage = useUpdateStage();
  const deleteStage = useDeleteStage();
  const approveStage = useApproveStage();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const addComment = useAddTaskComment();
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();

  const project = projectQuery.data;
  const invoice = invoiceQuery.data;
  const stages = stagesQuery.data || [];
  const tasks = tasksQuery.data || [];
  const activityItems = activityQuery.data?.items || [];
  const selectedTask = useMemo(() => tasks.find((task) => task.id === selectedTaskId) || tasks[0] || null, [tasks, selectedTaskId]);

  async function handleProjectSave(values) {
    await updateProject.mutateAsync({ id, payload: values });
    closeModal();
  }

  async function handleStageSave(values) {
    if (modalData?.id) {
      await updateStage.mutateAsync({ id: modalData.id, payload: values });
    } else {
      await createStage.mutateAsync({ projectId: id, payload: values });
    }
    closeModal();
  }

  async function handleTaskSave(values) {
    const payload = {
      ...values,
      project: values.project || id,
    };
    if (modalData?.id) {
      await updateTask.mutateAsync({ id: modalData.id, payload });
    } else {
      await createTask.mutateAsync(payload);
    }
    closeModal();
  }

  async function handleInvoiceSave(values) {
    const payload = {
      ...values,
      project: id,
    };
    if (modalData?.id) {
      await updateInvoice.mutateAsync({ id: modalData.id, payload });
    } else {
      await createInvoice.mutateAsync(payload);
    }
    closeModal();
  }

  function handleDeleteProject() {
    openConfirm({
      title: 'Delete project',
      message: `Delete ${project?.projectName}? This cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'rose',
      onConfirm: async () => {
        await deleteProject.mutateAsync(id);
        navigate('/projects');
      },
    });
  }

  function handleDeleteStage(row) {
    openConfirm({
      title: 'Delete stage',
      message: `Delete ${row.stageName}?`,
      confirmLabel: 'Delete',
      tone: 'rose',
      onConfirm: () => deleteStage.mutateAsync(row.id),
    });
  }

  function handleDeleteTask(row) {
    openConfirm({
      title: 'Delete task',
      message: `Delete ${row.title}?`,
      confirmLabel: 'Delete',
      tone: 'rose',
      onConfirm: () => deleteTask.mutateAsync(row.id),
    });
  }

  function renderModal() {
    if (activeModal === 'project') {
      return <ProjectForm initialValues={modalData || project} onSubmit={handleProjectSave} onCancel={closeModal} />;
    }
    if (activeModal === 'stage') {
      return <StageForm initialValues={modalData} onSubmit={handleStageSave} onCancel={closeModal} />;
    }
    if (activeModal === 'task') {
      return <TaskForm initialValues={modalData} projects={[project]} onSubmit={handleTaskSave} onCancel={closeModal} />;
    }
    if (activeModal === 'invoice') {
      return <BillingForm initialValues={modalData} projects={[project]} onSubmit={handleInvoiceSave} onCancel={closeModal} />;
    }
    return null;
  }

  if (projectQuery.isLoading) {
    return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;
  }

  if (projectQuery.isError) {
    return (
      <Card>
        <CardBody className="flex items-center gap-3 py-10">
          <AlertCircle className="h-5 w-5 text-rose-400" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-[rgb(var(--text))]">{projectQuery.error?.message || 'Failed to load project'}</div>
            <div className="text-xs text-slate-500">Refresh the page or go back to Projects.</div>
          </div>
          <Button variant="secondary" onClick={() => navigate('/projects')}>Back</Button>
        </CardBody>
      </Card>
    );
  }

  if (!project) {
    return <EmptyState title="Project not found" description="The requested project could not be loaded." action={<Button onClick={() => navigate('/projects')}>Back to Projects</Button>} />;
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-8">
      <section className="theme-hero theme-hero-blue p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="hero-kicker">Project Detail</p>
            <h1 className="hero-title">{project.projectName}</h1>
            <p className="hero-subtitle">{project.clientName} - {project.location}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => openModal('project', project)}>Edit Project</Button>
            <Button variant="danger" onClick={handleDeleteProject}>Delete Project</Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <ProjectStatusBadge value={project.overallStatus} />
          <TaskStatusBadge value={project.overallStatus === 'Completed' ? 'done' : project.overallStatus === 'On Hold' ? 'blocked' : 'in-progress'} />
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
              activeTab === tab ? 'bg-sky-500 text-slate-950' : 'bg-white/5 text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <Card>
            <CardBody className="grid gap-3 sm:grid-cols-2">
              {[
                ['Project Name', project.projectName],
                ['Client', project.clientName],
                ['Segment', project.companySegment],
                ['Type', (project.projectType || []).join(', ')],
                ['Location', project.location],
                ['Start Date', project.startDate?.slice?.(0, 10) || project.start || '-'],
                ['Target Date', project.targetDate?.slice?.(0, 10) || project.end || '-'],
                ['Value', project.projectValue],
                ['Stage', project.currentStage],
                ['Completion', `${project.stageCompletion}%`],
                ['Approval', project.clientApprovalStatus],
                ['Billing', project.invoiceStatus],
                ['Next Action', project.nextActionRequired],
                ['Priority', project.priority],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
                  <div className="mt-2 text-sm font-semibold text-[rgb(var(--text))]">{String(value || '-')}</div>
                </div>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Team</div>
                <div className="mt-2 text-sm text-slate-300">
                  {project.responsibleEngineer?.name || project.engineer || 'Unassigned'}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Billing</div>
                <div className="mt-2 text-sm text-slate-300">Received: {project.recv}</div>
                <div className="text-sm text-slate-300">Balance: {project.balance}</div>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : null}

      {activeTab === 'Stages' ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openModal('stage', { project: id })}>Add Stage</Button>
            </div>
            <StageTimeline stages={stages} />
            <StageTable
              rows={stages}
              onEdit={(row) => openModal('stage', row)}
              onDelete={handleDeleteStage}
              onApprove={(row) => approveStage.mutate({ id: row.id, payload: { action: 'approve' } })}
              onReject={(row) => approveStage.mutate({ id: row.id, payload: { action: 'reject' } })}
            />
          </div>
          <StageGuideCard />
        </div>
      ) : null}

      {activeTab === 'Tasks' ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => openModal('task', { project: id, status: 'todo' })}>Add Task</Button>
            </div>
            <div className="grid gap-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => setSelectedTaskId(task.id)} />
              ))}
            </div>
            {!tasks.length ? <EmptyState title="No tasks yet" description="Create the first task for this project." /> : null}
          </div>
          <Card>
            <CardBody className="space-y-4">
              <div className="text-sm font-semibold text-[rgb(var(--text))]">Selected Task</div>
              {selectedTask ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="font-semibold text-[rgb(var(--text))]">{selectedTask.title}</div>
                    <div className="mt-1 text-sm text-slate-400">{selectedTask.description}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <TaskStatusBadge value={selectedTask.status} />
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => openModal('task', selectedTask)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteTask(selectedTask)}>Delete</Button>
                    </div>
                  </div>
                  <TaskComments
                    comments={selectedTask.comments || []}
                    onAdd={(text) => addComment.mutate({ id: selectedTask.id, text })}
                  />
                </>
              ) : (
                <EmptyState title="Select a task" description="Click a task card to view details and comments." />
              )}
            </CardBody>
          </Card>
        </div>
      ) : null}

      {activeTab === 'Documents' ? (
        <div className="space-y-4">
          <FilterChips
            value={activeDocCategory}
            onChange={setActiveDocCategory}
            options={[
              { label: 'All', value: 'all' },
              { label: 'Drawings', value: 'drawing' },
              { label: 'Reports', value: 'report' },
              { label: 'Approvals', value: 'approval' },
              { label: 'Other', value: 'other' },
            ]}
          />
          <DocumentList projectId={id} category={activeDocCategory} />
        </div>
      ) : null}
      {activeTab === 'Billing' ? (
        invoice ? (
          <div className="space-y-4">
            <Card>
              <CardBody className="space-y-4">
                <BillingProgressBar received={invoice.amountReceived} total={invoice.amountTotal} />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {[
                    ['Invoice No', invoice.invoiceNo],
                    ['Status', invoice.billingStatus],
                    ['Total', `Rs. ${Number(invoice.amountTotal || 0).toFixed(2)}L`],
                    ['Received', `Rs. ${Number(invoice.amountReceived || 0).toFixed(2)}L`],
                    ['Balance', `Rs. ${Number(invoice.balance || 0).toFixed(2)}L`],
                    ['Due Date', invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : '-'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
                      <div className="mt-2 text-sm font-semibold text-[rgb(var(--text))]">{String(value || '-')}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Remarks</div>
                  <div className="mt-2 text-sm text-slate-300">{invoice.remarks || '-'}</div>
                </div>
                <div className="flex justify-end">
                  <RoleGuard roles={['superadmin', 'admin']}>
                    <Button onClick={() => openModal('invoice', invoice)}>Edit Invoice</Button>
                  </RoleGuard>
                </div>
              </CardBody>
            </Card>
          </div>
        ) : (
          <EmptyState
            title="No invoice yet"
            description="Create an invoice for this project."
            action={
              <RoleGuard roles={['superadmin', 'admin']}>
                <Button onClick={() => openModal('invoice', { project: id })}>Create Invoice</Button>
              </RoleGuard>
            }
          />
        )
      ) : null}
      {activeTab === 'Activity Log' ? (
        activityQuery.isLoading ? (
          <SkeletonCard />
        ) : activityQuery.isError ? (
          <Card>
            <CardBody className="flex items-center gap-3 py-10">
              <AlertCircle className="h-5 w-5 text-rose-400" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-[rgb(var(--text))]">{activityQuery.error?.message || 'Failed to load activity log'}</div>
                <div className="text-xs text-slate-500">Try again after a moment.</div>
              </div>
              <Button variant="secondary" onClick={() => activityQuery.refetch()}>Retry</Button>
            </CardBody>
          </Card>
        ) : activityItems.length ? (
          <Card>
            <CardBody className="space-y-3">
              {activityItems.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div
                    className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                      item.tone === 'emerald'
                        ? 'bg-emerald-400'
                        : item.tone === 'violet'
                          ? 'bg-violet-400'
                          : item.tone === 'amber'
                            ? 'bg-amber-400'
                            : item.tone === 'rose'
                              ? 'bg-rose-400'
                              : item.tone === 'blue'
                                ? 'bg-blue-400'
                                : 'bg-sky-400'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[rgb(var(--text))]">{item.title}</div>
                        <div className="mt-1 text-sm text-slate-400">{item.detail}</div>
                      </div>
                      <div className="text-right text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        <div>{item.occurredAt ? format(new Date(item.occurredAt), 'dd MMM yyyy · hh:mm a') : '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        ) : (
          <EmptyState title="Activity Log" description="Activity will appear here as stages, tasks, and billing records change." />
        )
      ) : null}

      {activeModal ? (
        <ModalShell
          widthClassName={activeModal === 'project' ? 'max-w-5xl' : 'max-w-4xl'}
          title={
            activeModal === 'project'
              ? modalData?.id
                ? 'Edit Project'
                : 'Add Project'
              : activeModal === 'stage'
                ? modalData?.id
                  ? 'Edit Stage'
                  : 'Add Stage'
                : activeModal === 'invoice'
                  ? modalData?.id
                    ? 'Edit Invoice'
                    : 'Add Invoice'
                  : modalData?.id
                  ? 'Edit Task'
                  : 'Add Task'
          }
          description="Save changes using the live API."
          onClose={closeModal}
        >
          {renderModal()}
        </ModalShell>
      ) : null}
    </motion.div>
  );
}
