'use client';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconCheck, IconPlus } from '@tabler/icons-react';

export function FollowButton({ storeId, className }: { storeId: number; className?: string }) {
  const [following, setFollowing] = useState(false);
  const toggle = useCallback(() => setFollowing((f) => !f), []);
  return (
    <Button
      type='button'
      size='sm'
      variant={following ? 'secondary' : 'default'}
      onClick={toggle}
      aria-pressed={following}
      aria-label={following ? `Unfollow store ${storeId}` : `Follow store ${storeId}`}
      className={cn('h-8 gap-1.5 rounded-full px-3', className)}
    >
      {following ? <IconCheck className='h-3.5 w-3.5' /> : <IconPlus className='h-3.5 w-3.5' />}
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
