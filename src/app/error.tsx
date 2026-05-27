'use client';

import { StoreErrorState } from '@/domains/store/components/store-error-state';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <StoreErrorState message={error.message} onRetryAction={reset} />;
}
