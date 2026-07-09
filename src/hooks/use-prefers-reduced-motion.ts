import { useSyncExternalStore } from 'react';

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** SSR-safe reduced-motion check — server assumes motion is allowed to avoid hydration mismatch. */
function getReducedMotionServerSnapshot() {
  return false;
}

/** Whether the user prefers reduced motion (matches InfiniteMovingCards / hero effects). */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}
