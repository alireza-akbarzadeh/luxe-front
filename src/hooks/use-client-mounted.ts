import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

/** True after hydration — avoids SSR/client markup mismatch without effect setState. */
export function useClientMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
