'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function CalendarRulesError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='rules' error={error} reset={reset} />;
}
