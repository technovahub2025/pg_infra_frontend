import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualList({ items = [], estimateSize = 120, renderItem, className = 'h-[70vh]', overscan = 8 }) {
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const renderedItems = useMemo(
    () => virtualItems.map((virtualRow) => ({
      key: items[virtualRow.index]?.id || virtualRow.index,
      virtualRow,
      item: items[virtualRow.index],
    })),
    [items, virtualItems],
  );

  return (
    <div ref={parentRef} className={`overflow-y-auto ${className}`}>
      <div style={{ height: totalSize, position: 'relative' }}>
        {renderedItems.map(({ key, virtualRow, item }) => (
          <div
            key={key}
            ref={rowVirtualizer.measureElement}
            data-index={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {renderItem(item, virtualRow.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
