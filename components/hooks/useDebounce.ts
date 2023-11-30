import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef } from 'react';

export const useDebounce = <T extends () => void>(callback: T, wait?: number) => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, wait);
  }, []);

  return debouncedCallback;
};
