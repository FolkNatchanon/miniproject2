import { useEffect } from 'react';

export function useLocalStorageObject<T>(key: string, obj: T, deps: unknown[]) {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(obj));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
