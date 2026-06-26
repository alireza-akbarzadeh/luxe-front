'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function ReturnError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='return' error={error} reset={reset} />;
}
