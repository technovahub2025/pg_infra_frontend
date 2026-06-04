import { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

export function LazyImage({ src, alt = '', className = '', containerClassName = '', fallback = null, ...props }) {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '120px' });
  const imageSrc = useMemo(() => (inView ? src : ''), [inView, src]);

  return (
    <div ref={ref} className={containerClassName}>
      {imageSrc ? <img src={imageSrc} alt={alt} loading="lazy" className={className} {...props} /> : fallback}
    </div>
  );
}
