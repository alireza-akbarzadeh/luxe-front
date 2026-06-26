'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function StoresError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='stores' error={error} reset={reset} />;
}
