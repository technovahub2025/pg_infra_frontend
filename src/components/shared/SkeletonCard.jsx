export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[var(--radius)] border border-white/10 bg-white/5 p-5">
      <div className="h-4 w-24 rounded bg-white/10" />
      <div className="mt-4 h-8 w-2/3 rounded bg-white/10" />
      <div className="mt-3 h-4 w-full rounded bg-white/10" />
      <div className="mt-2 h-4 w-5/6 rounded bg-white/10" />
    </div>
  );
}

