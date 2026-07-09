'use client';

import { IconAlertTriangle, IconArrowLeft } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Text } from '@/components/ui/typography';
import { CustomerSegmentBadge } from '@/domains/customers-admin/components/customer-segment-badge';
import { LoyaltyBadge } from '@/domains/customers-admin/components/loyalty-badge';
import { CustomerAddressesCard } from '@/domains/customers-admin/sections/customer-addresses-card';
import { CustomerNotesCard } from '@/domains/customers-admin/sections/customer-notes-card';
import { CustomerOrdersTable } from '@/domains/customers-admin/sections/customer-orders-table';
import { CustomerSegmentCard } from '@/domains/customers-admin/sections/customer-segment-card';
import { formatCurrency } from '@/lib/format';
import { getGetAdminCustomersStatsQueryKey } from '@/services/-admin-customers-stats-get';
import { getGetAdminUsersIdQueryKey, useGetAdminUsersId } from '@/services/-admin-users-{id}-get';
import type {
  DtoAdminCustomerDetailResponse,
  GetAdminUsersId200
} from '@/services/-admin-users-{id}-get.schemas';
import { getGetAdminUsersQueryKey } from '@/services/-admin-users-get';

interface CustomerDetailDomainProps {
  userId: string;
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <Flex direction='column' className='gap-1 rounded-xl border px-4 py-3'>
      <Text variant='muted' className='text-[10px] font-bold tracking-widest uppercase'>
        {label}
      </Text>
      <Text className='text-sm font-semibold tabular-nums'>{value}</Text>
    </Flex>
  );
}

export function CustomerDetailDomain({ userId }: CustomerDetailDomainProps) {
  const numericId = Number(userId);
  const queryClient = useQueryClient();
  const isValidId = Number.isFinite(numericId) && numericId > 0;

  const { data, isLoading, isError, error, refetch } = useGetAdminUsersId(numericId, {
    query: { enabled: isValidId }
  });

  const applyCustomerUpdate = useCallback(
    (customer: DtoAdminCustomerDetailResponse) => {
      queryClient.setQueryData<GetAdminUsersId200>(
        getGetAdminUsersIdQueryKey(numericId),
        (previous) => ({
          ...(previous ?? {}),
          data: customer
        })
      );
      void queryClient.invalidateQueries({ queryKey: getGetAdminUsersQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getGetAdminCustomersStatsQueryKey() });
    },
    [numericId, queryClient]
  );

  if (!isValidId) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className='mx-auto max-w-350 px-6 py-8'>
        <div className='bg-muted/40 h-48 animate-pulse rounded-2xl' />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className='mx-auto max-w-350 px-6 py-8'>
        <Flex
          direction='column'
          align='center'
          className='gap-4 rounded-2xl border border-dashed p-12 text-center'
        >
          <IconAlertTriangle className='text-muted-foreground size-8' />
          <Text variant='h4'>Customer not found</Text>
          <Text variant='muted'>
            {error instanceof Error ? error.message : 'This profile could not be loaded.'}
          </Text>
          <Flex direction='row' className='gap-2'>
            <Button variant='outline' asChild>
              <Link href='/dashboard/customers'>Back to customers</Link>
            </Button>
            <Button onClick={() => void refetch()}>Retry</Button>
          </Flex>
        </Flex>
      </div>
    );
  }

  const customer = data.data;
  const fullName =
    [customer.first_name, customer.last_name].filter(Boolean).join(' ') || 'Unnamed customer';

  return (
    <div className='mx-auto max-w-350 px-6 py-8'>
      <Flex direction='column' className='gap-6'>
        <Flex direction='row' align='center' className='gap-3'>
          <Button variant='ghost' size='icon' asChild>
            <Link href='/dashboard/customers' aria-label='Back to customers'>
              <IconArrowLeft className='size-4' />
            </Link>
          </Button>
          <Flex direction='column' className='gap-1'>
            <Text variant='h3' as='h1'>
              {fullName}
            </Text>
            <Text variant='muted'>{customer.email}</Text>
          </Flex>
          <Flex direction='row' wrap='wrap' className='ml-auto gap-2'>
            <CustomerSegmentBadge segment={customer.customer_segment} />
            <LoyaltyBadge tier={customer.membership_tier} isPlusActive={customer.is_plus_active} />
          </Flex>
        </Flex>

        <Grid template='stats' gap={3}>
          <ProfileStat label='Orders' value={String(customer.order_count ?? 0)} />
          <ProfileStat label='Lifetime value' value={formatCurrency(customer.total_spent ?? 0)} />
          <ProfileStat label='Addresses' value={String(customer.address_count ?? 0)} />
          <ProfileStat label='Last login' value={formatDate(customer.last_login_at)} />
        </Grid>

        <Grid template='form' gap={6} className='lg:grid-cols-2'>
          <Flex direction='column' className='gap-6'>
            <CustomerSegmentCard
              userId={numericId}
              segment={customer.customer_segment}
              onSaved={applyCustomerUpdate}
            />
            <CustomerNotesCard
              userId={numericId}
              notes={customer.admin_notes}
              onSaved={applyCustomerUpdate}
            />
            <CustomerAddressesCard userId={numericId} />
          </Flex>

          <div className='bg-card border-border/40 rounded-2xl border p-6 shadow-sm'>
            <Text variant='overline' className='text-muted-foreground mb-4'>
              Account
            </Text>
            <Flex direction='column' className='gap-3 text-sm'>
              <Flex direction='row' justify='between'>
                <Text variant='muted'>Phone</Text>
                <Text>{customer.phone || '—'}</Text>
              </Flex>
              <Flex direction='row' justify='between'>
                <Text variant='muted'>Status</Text>
                <Text>{customer.is_active ? 'Active' : 'Inactive'}</Text>
              </Flex>
              <Flex direction='row' justify='between'>
                <Text variant='muted'>Joined</Text>
                <Text>{formatDate(customer.created_at)}</Text>
              </Flex>
              <Flex direction='row' justify='between'>
                <Text variant='muted'>Email verified</Text>
                <Text>
                  {customer.email_verified_at ? formatDate(customer.email_verified_at) : 'No'}
                </Text>
              </Flex>
              {customer.is_plus_active ? (
                <Flex direction='row' justify='between'>
                  <Text variant='muted'>Plus expires</Text>
                  <Text>{formatDate(customer.plus_expires_at)}</Text>
                </Flex>
              ) : null}
            </Flex>
          </div>
        </Grid>

        <CustomerOrdersTable userId={numericId} />
      </Flex>
    </div>
  );
}
