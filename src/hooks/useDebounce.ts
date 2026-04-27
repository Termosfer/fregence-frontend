// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Timer-i başladırıq
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Əgər istifadəçi nəsə yazmağa davam etsə, köhnə timer-i silirik
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}