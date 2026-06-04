import { useEffect, useMemo, useState } from 'react';

export function useDebouncedValue(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function useStableMemo(factory, deps) {
  // Keeps expensive derived data from recalculating on every render.
  return useMemo(factory, deps);
}
