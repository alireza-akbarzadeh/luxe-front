'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function DiscountsError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='discounts' error={error} reset={reset} />;
}
