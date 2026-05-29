'use client';
import { IconBell, IconLoader2, IconPlus } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useStoreFollow } from '~/src/hooks/useStoreFollow';

interface FollowButtonProps {
  slug: string;
  isFollowed: boolean;
  className?: string;
}

export function FollowButton(props: FollowButtonProps) {
  const { className, isFollowed, slug } = props;

  const { follow, unfollow, isLoading } = useStoreFollow({
    slug
  });
  return (
    <Button
      variant={isFollowed ? 'secondary' : 'default'}
      onClick={() => (isFollowed ? unfollow() : follow())}
      disabled={isLoading}
      className={cn('gap-2', className)}
    >
      {isLoading ? (
        <IconLoader2 className='h-4 w-4 animate-spin' />
      ) : isFollowed ? (
        <>
          <IconBell className='h-4 w-4' />
          Following
        </>
      ) : (
        <>
          <IconPlus className='h-4 w-4' />
          Follow
        </>
      )}
    </Button>
  );
}
