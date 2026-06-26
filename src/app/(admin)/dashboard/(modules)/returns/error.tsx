'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function ReturnsError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='returns' error={error} reset={reset} />;
}
