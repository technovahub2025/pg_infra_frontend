import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Trash2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadService } from '../../services/uploadService';
import { useUiStore } from '../../store/uiStore';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DropZone } from './DropZone';
import { FilePreview } from './FilePreview';

export function DocumentList({ projectId, employeeId, category = 'all' }) {
  const queryClient = useQueryClient();
  const openConfirm = useUiStore((state) => state.openConfirm);
  const [uploading, setUploading] = useState(false);

  const queryKey = ['documents', projectId || employeeId];
  const documentsQuery = useQuery({
    queryKey,
    enabled: Boolean(projectId || employeeId),
    queryFn: async () => {
      if (projectId) return uploadService.getProjectDocuments(projectId);
      if (employeeId) return uploadService.getEmployeeDocuments(employeeId);
      return [];
    },
  });

  const documents = useMemo(() => {
    const rows = documentsQuery.data || [];
    if (category === 'all') return rows;
    return rows.filter((doc) => String(doc.category || 'other').toLowerCase() === String(category).toLowerCase());
  }, [documentsQuery.data, category]);

  async function handleUpload(files) {
    const file = files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      await uploadService.uploadDocument({
        file,
        projectId,
        employeeId,
        category: category === 'all' ? 'other' : category,
      });
      toast.success('File uploaded');
      queryClient.invalidateQueries({ queryKey });
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <DropZone onDrop={handleUpload} className="flex min-h-32 items-center justify-center">
        <div className="space-y-1">
          <Upload className="mx-auto h-8 w-8 text-sky-400" />
          <div className="text-sm font-semibold text-[rgb(var(--text))]">{uploading ? 'Uploading...' : 'Drop files or click to upload'}</div>
          <div className="text-xs text-slate-500">Images, PDFs, Word and Excel files up to 10MB</div>
        </div>
      </DropZone>

      <div className="grid gap-4">
        {documents.map((document) => (
          <div key={document.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-400" />
                  <div className="truncate font-semibold text-[rgb(var(--text))]">{document.originalName}</div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge tone="blue">{String(document.category || 'other')}</Badge>
                  <Badge tone="slate">{String(document.fileType || 'other')}</Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant="danger"
                onClick={() =>
                  openConfirm({
                    title: 'Delete document',
                    message: `Delete ${document.originalName}?`,
                    confirmLabel: 'Delete',
                    tone: 'rose',
                    onConfirm: async () => {
                      await uploadService.deleteDocument(document.publicId);
                      toast.success('Document deleted');
                      queryClient.invalidateQueries({ queryKey });
                    },
                  })
                }
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4">
              <FilePreview file={document} />
            </div>
          </div>
        ))}

        {!documents.length ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-10 text-center text-sm text-slate-400">
            No documents found.
          </div>
        ) : null}
      </div>
    </div>
  );
}
