import { LazyImage } from '../shared/LazyImage';

export function FilePreview({ file }) {
  if (!file) return null;
  const isImage = String(file.fileType || '').toLowerCase() === 'image' || String(file.mimeType || '').startsWith('image/');
  const isPdf = String(file.fileType || '').toLowerCase() === 'pdf' || file.mimeType === 'application/pdf';

  if (isImage) {
    return (
      <a href={file.cloudinaryUrl || file.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border border-white/10">
        <LazyImage
          src={file.cloudinaryUrl || file.url}
          alt={file.originalName || file.filename}
          containerClassName="h-32 w-full"
          className="h-32 w-full object-cover"
        />
      </a>
    );
  }

  if (isPdf) {
    return (
      <a href={file.cloudinaryUrl || file.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
        Open PDF
      </a>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-300">
      {file.originalName || file.filename}
    </div>
  );
}
