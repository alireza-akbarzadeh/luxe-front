'use client';

import { Badge } from '@/components/ui/badge';

function statusVariant(status?: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'active') return 'default';
  if (status === 'pending') return 'secondary';
  if (status === 'suspended') return 'destructive';
  return 'outline';
}

export function VendorStatusBadge({ status }: { status?: string }) {
  if (!status) return null;

  return (
    <Badge variant={statusVariant(status)} className='capitalize'>
      {status}
    </Badge>
  );
}
