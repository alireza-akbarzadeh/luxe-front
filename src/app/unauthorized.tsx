'use client';

import { AuthStatusPage } from '@/components/error-state/auth-status-page';

export default function Unauthorized() {
  return <AuthStatusPage variant='unauthorized' />;
}
