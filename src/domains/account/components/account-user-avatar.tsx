'use client';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { IMAGE_FALLBACK } from '@/lib/images';

interface AccountUserAvatarProps {
  avatarUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  sizeClassName?: string;
}

/** Rounded profile avatar with initials fallback for account surfaces. */
export function AccountUserAvatar({
  avatarUrl,
  firstName,
  lastName,
  sizeClassName = 'size-20'
}: AccountUserAvatarProps) {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  const displayName = [firstName, lastName].filter(Boolean).join(' ').trim() || 'User';
  const hasAvatar = Boolean(avatarUrl?.trim());

  return (
    <div
      className={`border-border/40 bg-accent/20 relative shrink-0 overflow-hidden rounded-full border ${sizeClassName}`}
    >
      {hasAvatar ? (
        <AppImage
          src={avatarUrl ?? IMAGE_FALLBACK}
          alt={displayName}
          fill
          sizes='80px'
          className='object-cover'
        />
      ) : (
        <Flex align='center' justify='center' fullWidth className='size-full'>
          <Typography.Large className='text-accent font-semibold'>{initials}</Typography.Large>
        </Flex>
      )}
    </div>
  );
}
