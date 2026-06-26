'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function WalletError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='wallet' error={error} reset={reset} />;
}
