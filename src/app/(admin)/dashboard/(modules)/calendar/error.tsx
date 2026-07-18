'use client';

import { AdminModuleError } from '@/components/error-state/admin-module-error';

export default function CalendarError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <AdminModuleError module='calendar' error={error} reset={reset} />;
}
