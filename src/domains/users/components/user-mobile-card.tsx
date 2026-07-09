'use client';

import type { Row } from '@tanstack/react-table';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { UserActions } from '@/domains/users/components/user-actions';
import { UserRoleBadge } from '@/domains/users/components/user-role-badge';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import type { DtoAdminUserResponse } from '@/services/-admin-users-get.schemas';

interface UserMobileCardProps {
  row: Row<DtoAdminUserResponse>;
}

export function UserMobileCard({ row }: UserMobileCardProps) {
  const user = row.original;
  const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Unnamed user';
  const isActive = user.is_active ?? false;

  return (
    <Flex direction='row' align='start' justify='between' className='gap-3 p-4'>
      <Flex direction='column' className='min-w-0 flex-1 gap-2'>
        <Flex direction='column' className='gap-0.5'>
          <Text variant='small' className='truncate font-semibold'>
            {displayName}
          </Text>
          <Text variant='muted' className='truncate text-xs'>
            {user.email ?? '—'}
          </Text>
        </Flex>

        <Flex direction='row' align='center' wrap='wrap' className='gap-2'>
          <UserRoleBadge slug={user.role} />
          <Flex direction='row' align='center' className='gap-1.5'>
            <span
              className={cn('size-2 rounded-full', isActive ? 'bg-emerald-500' : 'bg-slate-400')}
              aria-hidden
            />
            <Text variant='muted' className='text-[10px] font-bold uppercase'>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
          </Flex>
        </Flex>

        <Flex direction='row' wrap='wrap' className='gap-x-3 gap-y-1'>
          <Text variant='muted' className='text-[11px]'>
            Verified:{' '}
            {user.email_verified_at ? formatDate(user.email_verified_at, DATE_FORMATS.SHORT) : 'No'}
          </Text>
          <Text variant='muted' className='text-[11px]'>
            Last login:{' '}
            {user.last_login_at ? formatDate(user.last_login_at, DATE_FORMATS.SHORT) : 'Never'}
          </Text>
        </Flex>
      </Flex>

      <UserActions user={user} />
    </Flex>
  );
}
