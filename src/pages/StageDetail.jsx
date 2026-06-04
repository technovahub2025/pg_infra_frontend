import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { pageVariants } from '../utils/motionVariants';
import { useProjects } from '../hooks/useProjects';
import { useProjectStore } from '../store/projectStore';
import { useStages, useCreateStage, useUpdateStage } from '../hooks/useStages';
import { useUiStore } from '../store/uiStore';
import { StageTimeline } from '../components/stages/StageTimeline';
import { StageTable } from '../components/stages/StageTable';
import { StageGuideCard } from '../components/stages/StageGuideCard';
import { StageForm } from '../components/stages/StageForm';
import { Button } from '../components/ui/button';
import { Card, CardBody } from '../components/ui/card';
import { EmptyState } from '../components/shared/EmptyState';
import { ModalShell } from '../components/shared/ModalShell';

export default function StageDetail() {
  const { data: projects = [] } = useProjects();
  const { selectedProjectId, setSelectedProjectId } = useProjectStore();
  const { activeModal, modalData, openModal, closeModal } = useUiStore();
  const createStage = useCreateStage();
  const updateStage = useUpdateStage();
  const selectedId = selectedProjectId || projects[0]?.id || '';
  const stagesQuery = useStages(selectedId);

  useEffect(() => {
    if (!selectedProjectId && projects[0]?.id) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId, setSelectedProjectId]);

  async function handleSave(values) {
    if (modalData?.id) {
      await updateStage.mutateAsync({ id: modalData.id, payload: values });
    } else {
      await createStage.mutateAsync({ projectId: selectedId, payload: values });
    }
    closeModal();
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="space-y-6 pb-8">
      <section className="theme-hero theme-hero-green p-5 sm:p-6">
        <p className="hero-kicker">Stage Detail</p>
        <h1 className="hero-title">Stage timeline and approval log</h1>
      </section>

      <Card>
        <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="block min-w-[280px]">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Project</span>
            <select className="input" value={selectedId} onChange={(event) => setSelectedProjectId(event.target.value)}>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.projectName}
                </option>
              ))}
            </select>
          </label>
          <Button onClick={() => openModal('stage', { project: selectedId })}>Add Stage</Button>
        </CardBody>
      </Card>

      {stagesQuery.isLoading ? (
        <EmptyState title="Loading stages" description="Fetching stage data from the API." />
      ) : stagesQuery.isError ? (
        <Card>
          <CardBody className="flex items-center gap-3 py-10">
            <AlertCircle className="h-5 w-5 text-rose-400" />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-[rgb(var(--text))]">{stagesQuery.error?.message || 'Failed to load stages'}</div>
              <div className="text-xs text-slate-500">Try again after a moment.</div>
            </div>
            <Button variant="secondary" onClick={() => stagesQuery.refetch()}>Retry</Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] xl:items-start">
          <div className="min-w-0 space-y-4">
            <StageTimeline stages={stagesQuery.data || []} />
            <StageTable rows={stagesQuery.data || []} onEdit={(row) => openModal('stage', row)} />
          </div>
          <div className="xl:sticky xl:top-24 xl:self-start">
            <StageGuideCard />
          </div>
        </div>
      )}

      {activeModal === 'stage' ? (
        <ModalShell
          title={modalData?.id ? 'Edit Stage' : 'Add Stage'}
          description="Save stage changes using the live API."
          onClose={closeModal}
        >
          <StageForm initialValues={modalData} onSubmit={handleSave} onCancel={closeModal} />
        </ModalShell>
      ) : null}
    </motion.div>
  );
}
