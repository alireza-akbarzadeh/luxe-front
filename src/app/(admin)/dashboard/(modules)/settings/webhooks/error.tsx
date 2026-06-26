'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function WebhooksError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='webhooks' error={error} reset={reset} />;
}
