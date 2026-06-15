'use client';

import { IconBell, IconLoader2, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useStoreFollow } from '~/src/hooks/useStoreFollow';

interface FollowButtonProps {
  slug: string;
  isFollowed: boolean;
  storeName?: string;
  className?: string;
  size?: 'default' | 'sm' | 'icon';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export function FollowButton(props: FollowButtonProps) {
  const { className, isFollowed: serverFollowed, slug, storeName, size = 'sm', variant } = props;

  const [optimisticFollowed, setOptimisticFollowed] = useState<boolean | null>(null);
  const isFollowed =
    optimisticFollowed !== null && optimisticFollowed !== serverFollowed
      ? optimisticFollowed
      : serverFollowed;

  const { follow, unfollow, isLoading } = useStoreFollow({
    slug,
    storeName,
    onFollowChange: setOptimisticFollowed
  });

  const resolvedVariant = variant ?? (isFollowed ? 'outline' : 'default');

  return (
    <Button
      variant={resolvedVariant}
      size={size}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isFollowed) {
          unfollow();
        } else {
          follow();
        }
      }}
      disabled={isLoading}
      className={cn(
        'gap-1.5 rounded-full transition-colors',
        !isFollowed &&
          'bg-gold text-gold-foreground hover:bg-gold-strong hover:text-gold-foreground border-0',
        isFollowed && 'border-gold/40 text-gold-strong hover:bg-gold/10 dark:text-gold',
        className
      )}
      aria-pressed={isFollowed}
      aria-label={isFollowed ? `Unfollow ${storeName ?? slug}` : `Follow ${storeName ?? slug}`}
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
