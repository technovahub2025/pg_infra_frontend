import { useDropzone } from 'react-dropzone';
import { cn } from '../../lib/utils';

export function DropZone({ onDrop, accept, multiple = false, className, children }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, multiple });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'cursor-pointer rounded-3xl border border-dashed border-sky-400/30 bg-sky-500/5 p-4 text-center transition hover:bg-sky-500/10',
        isDragActive && 'border-sky-400 bg-sky-500/15',
        className,
      )}
    >
      <input {...getInputProps()} />
      {children || <div className="text-sm text-slate-400">Drag and drop files here, or click to browse.</div>}
    </div>
  );
}
