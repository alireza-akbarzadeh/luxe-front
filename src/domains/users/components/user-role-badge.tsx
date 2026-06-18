'use client';

import { Badge } from '@/components/ui/badge';
import { useRoleLabelMap } from '@/domains/users/hooks/use-role-options';
import { cn } from '@/lib/utils';

interface UserRoleBadgeProps {
  slug?: string | null;
  className?: string;
}

function roleVariant(slug: string): 'destructive' | 'default' | 'secondary' | 'outline' {
  if (slug === 'admin') return 'destructive';
  if (slug === 'user') return 'secondary';
  return 'default';
}

export function UserRoleBadge({ slug, className }: UserRoleBadgeProps) {
  const roleLabelMap = useRoleLabelMap();
  const value = slug || 'user';
  const label = roleLabelMap.get(value) ?? value;

  return (
    <Badge variant={roleVariant(value)} className={cn('text-[10px] uppercase', className)}>
      {label}
    </Badge>
  );
}
