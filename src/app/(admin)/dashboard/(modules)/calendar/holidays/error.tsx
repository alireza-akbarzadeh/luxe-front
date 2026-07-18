'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function CalendarHolidaysError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <AdminModuleError module='holidays' error={error} reset={reset} />;
}
