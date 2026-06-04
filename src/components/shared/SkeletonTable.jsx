export function SkeletonTable({ rows = 6, columns = 6 }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-white/10 bg-white/5">
      <div className="animate-pulse">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-3 border-b border-white/5 px-4 py-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
            {Array.from({ length: columns }).map((__, colIndex) => (
              <div key={colIndex} className="h-4 rounded bg-white/10" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

