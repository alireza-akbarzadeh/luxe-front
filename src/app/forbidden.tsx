'use client';

import { AuthStatusPage } from '@/components/error-state/auth-status-page';

export default function Forbidden() {
  return <AuthStatusPage variant='forbidden' />;
}
