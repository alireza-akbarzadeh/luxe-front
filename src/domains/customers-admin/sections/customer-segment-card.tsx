'use client';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { CustomerSegmentBadge } from '@/domains/customers-admin/components/customer-segment-badge';
import {
  CUSTOMER_SEGMENT_OPTIONS,
  type CustomerSegment
} from '@/domains/customers-admin/lib/customer-segments';
import { cn } from '@/lib/utils';
import type { DtoAdminCustomerDetailResponse } from '@/services/-admin-users-{id}-get.schemas';
import { usePatchAdminUsersIdSegment } from '@/services/-admin-users-{id}-segment-patch';
import type { DtoUpdateCustomerSegmentRequest } from '@/services/-admin-users-{id}-segment-patch.schemas';

interface CustomerSegmentCardProps {
  userId: number;
  segment?: string;
  onSaved: (customer: DtoAdminCustomerDetailResponse) => void;
}

/** CRM segment assignment for a customer profile. */
export function CustomerSegmentCard({ userId, segment = '', onSaved }: CustomerSegmentCardProps) {
  const { mutateAsync: saveSegment, isPending } = usePatchAdminUsersIdSegment();

  const handleSelect = async (next: CustomerSegment) => {
    if (next === segment) return;

    try {
      const payload: DtoUpdateCustomerSegmentRequest = next
        ? { customer_segment: next }
        : ({ customer_segment: '' } as unknown as DtoUpdateCustomerSegmentRequest);
      const result = await saveSegment({ id: userId, data: payload });
      const updated = result.data;
      if (updated) onSaved(updated);
      toast.success(next ? 'Segment updated' : 'Segment cleared');
    } catch (error) {
      toast.error('Could not update segment', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  };

  return (
    <div className='bg-card border-border/40 overflow-hidden rounded-2xl border shadow-sm'>
      <Flex
        direction='row'
        align='center'
        justify='between'
        className='bg-muted/20 border-border/10 border-b px-6 py-4'
      >
        <Text variant='overline' className='text-muted-foreground'>
          CRM segment
        </Text>
        <CustomerSegmentBadge segment={segment} />
      </Flex>
      <Flex direction='row' wrap='wrap' className='gap-2 p-6'>
        {CUSTOMER_SEGMENT_OPTIONS.filter((option) => option.id !== '').map((option) => (
          <Button
            key={option.id}
            type='button'
            size='sm'
            variant={segment === option.id ? 'default' : 'outline'}
            disabled={isPending}
            className={cn('text-[10px] font-bold uppercase', option.className)}
            onClick={() => void handleSelect(option.id)}
          >
            {option.label}
          </Button>
        ))}
        {segment ? (
          <Button
            type='button'
            size='sm'
            variant='ghost'
            disabled={isPending}
            className='text-[10px] font-bold uppercase'
            onClick={() => void handleSelect('')}
          >
            Clear
          </Button>
        ) : null}
      </Flex>
    </div>
  );
}
