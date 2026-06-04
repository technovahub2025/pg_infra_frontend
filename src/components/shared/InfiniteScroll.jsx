import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export function InfiniteScroll({ onLoadMore, hasMore = false, children, rootMargin = '200px' }) {
  const { ref, inView } = useInView({ rootMargin });

  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore?.();
    }
  }, [inView, hasMore, onLoadMore]);

  return (
    <>
      {children}
      <div ref={ref} />
    </>
  );
}
