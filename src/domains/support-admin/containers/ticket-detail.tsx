'use client';

import { IconAlertTriangle, IconArrowLeft } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Text } from '@/components/ui/typography';
import { SupportChannelBadge } from '@/domains/support-admin/components/support-channel-badge';
import { SupportStatusBadge } from '@/domains/support-admin/components/support-status-badge';
import { SUPPORT_STATUS_OPTIONS } from '@/domains/support-admin/schemas/support.schema';
import { TicketMessageThread } from '@/domains/support-admin/sections/ticket-message-thread';
import { TicketNotesCard } from '@/domains/support-admin/sections/ticket-notes-card';
import { TicketReplyPanel } from '@/domains/support-admin/sections/ticket-reply-panel';
import { getGetAdminSupportStatsQueryKey } from '@/services/-admin-support-stats-get';
import { usePatchAdminSupportTicketsIdAssign } from '@/services/-admin-support-tickets-{id}-assign-patch';
import {
  getGetAdminSupportTicketsIdQueryKey,
  useGetAdminSupportTicketsId
} from '@/services/-admin-support-tickets-{id}-get';
import type {
  DtoSupportTicketResponse,
  GetAdminSupportTicketsId200
} from '@/services/-admin-support-tickets-{id}-get.schemas';
import { usePatchAdminSupportTicketsIdStatus } from '@/services/-admin-support-tickets-{id}-status-patch';
import { DtoUpdateSupportTicketStatusRequestStatus } from '@/services/-admin-support-tickets-{id}-status-patch.schemas';
import { getGetAdminSupportTicketsQueryKey } from '@/services/-admin-support-tickets-get';

interface TicketDetailDomainProps {
  ticketId: string;
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

export function TicketDetailDomain({ ticketId }: TicketDetailDomainProps) {
  const numericId = Number(ticketId);
  const queryClient = useQueryClient();
  const isValidId = Number.isFinite(numericId) && numericId > 0;
  const [assigneeDraft, setAssigneeDraft] = useState('');

  const { data, isLoading, isError, error, refetch } = useGetAdminSupportTicketsId(numericId, {
    query: { enabled: isValidId }
  });

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    usePatchAdminSupportTicketsIdStatus();
  const { mutateAsync: updateAssignee, isPending: isUpdatingAssignee } =
    usePatchAdminSupportTicketsIdAssign();

  const ticket = data?.data;

  const invalidateTicketQueries = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: getGetAdminSupportTicketsIdQueryKey(numericId)
    });
    void queryClient.invalidateQueries({ queryKey: getGetAdminSupportTicketsQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminSupportStatsQueryKey() });
  }, [numericId, queryClient]);

  const applyTicketUpdate = useCallback(
    (updated: DtoSupportTicketResponse) => {
      queryClient.setQueryData<GetAdminSupportTicketsId200>(
        getGetAdminSupportTicketsIdQueryKey(numericId),
        (previous) => ({
          ...(previous ?? {}),
          data: updated
        })
      );
      void queryClient.invalidateQueries({ queryKey: getGetAdminSupportTicketsQueryKey() });
      void queryClient.invalidateQueries({ queryKey: getGetAdminSupportStatsQueryKey() });
    },
    [numericId, queryClient]
  );

  const handleStatusChange = async (status: string) => {
    if (
      !Object.values(DtoUpdateSupportTicketStatusRequestStatus).includes(
        status as DtoUpdateSupportTicketStatusRequestStatus
      )
    ) {
      return;
    }

    try {
      const result = await updateStatus({
        id: numericId,
        data: { status: status as DtoUpdateSupportTicketStatusRequestStatus }
      });
      if (result.data) applyTicketUpdate(result.data);
      toast.success('Status updated');
    } catch (err) {
      toast.error('Could not update status', {
        description: err instanceof Error ? err.message : undefined
      });
    }
  };

  const handleAssigneeSave = async () => {
    const trimmed = (
      assigneeDraft || (ticket?.assignee_id ? String(ticket.assignee_id) : '')
    ).trim();
    const assigneeId = trimmed ? Number(trimmed) : null;

    if (trimmed && (!Number.isFinite(assigneeId) || assigneeId! <= 0)) {
      toast.error('Enter a valid staff user ID');
      return;
    }

    try {
      const result = await updateAssignee({
        id: numericId,
        data: { assignee_id: assigneeId ?? undefined }
      });
      if (result.data) applyTicketUpdate(result.data);
      toast.success(assigneeId ? 'Ticket assigned' : 'Assignee cleared');
    } catch (err) {
      toast.error('Could not update assignee', {
        description: err instanceof Error ? err.message : undefined
      });
    }
  };

  if (!isValidId) {
    notFound();
  }

  if (isLoading) {
    return (
      <Flex direction='column' className='gap-4'>
        <div className='bg-muted h-8 w-48 animate-pulse rounded-lg' />
        <div className='bg-muted h-64 animate-pulse rounded-2xl' />
      </Flex>
    );
  }

  if (isError || !ticket) {
    return (
      <Flex direction='column' align='center' className='gap-4 py-16 text-center'>
        <IconAlertTriangle className='text-muted-foreground size-10' />
        <Text variant='h4' as='h2'>
          Ticket unavailable
        </Text>
        <Text variant='muted' as='p'>
          {error instanceof Error ? error.message : 'Could not load this ticket.'}
        </Text>
        <Button variant='outline' onClick={() => void refetch()}>
          Retry
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction='column' className='gap-6'>
      <Flex align='center' className='gap-3'>
        <Button variant='ghost' size='sm' asChild>
          <Link href='/dashboard/support'>
            <IconArrowLeft className='mr-1 size-4' />
            Back
          </Link>
        </Button>
      </Flex>

      <Flex direction='column' className='gap-2'>
        <Flex align='center' wrap='wrap' className='gap-2'>
          <Text variant='h3' as='h1'>
            #{ticket.id} · {ticket.subject}
          </Text>
          <SupportStatusBadge status={ticket.status} />
          <SupportChannelBadge channel={ticket.channel} />
        </Flex>
        <Text variant='muted' as='p'>
          {ticket.customer_name || 'Guest'} · {ticket.customer_email} · Opened{' '}
          {formatDate(ticket.created_at)}
        </Text>
        {ticket.order_id ? (
          <Text variant='small' as='p'>
            Order{' '}
            <Link
              href={`/dashboard/orders/${ticket.order_id}`}
              className='text-primary font-medium hover:underline'
            >
              {ticket.order_number ?? `#${ticket.order_id}`}
            </Link>
          </Text>
        ) : null}
      </Flex>

      <div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <Flex direction='column' className='gap-6'>
          <TicketMessageThread messages={ticket.messages} channel={ticket.channel} />
          <TicketReplyPanel ticket={ticket} onUpdated={() => void invalidateTicketQueries()} />
        </Flex>

        <Flex direction='column' className='gap-6'>
          <div className='bg-card border-border/40 space-y-4 rounded-2xl border p-6 shadow-sm'>
            <Text variant='overline' className='text-muted-foreground'>
              Ticket controls
            </Text>

            <div className='space-y-2'>
              <Label className='text-xs'>Status</Label>
              <Select
                value={ticket.status ?? 'open'}
                disabled={isUpdatingStatus}
                onValueChange={(value) => void handleStatusChange(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label className='text-xs'>Assignee user ID</Label>
              <Input
                key={String(ticket.assignee_id ?? 'none')}
                defaultValue={ticket.assignee_id ? String(ticket.assignee_id) : ''}
                onChange={(event) => setAssigneeDraft(event.target.value)}
                placeholder='Staff user ID'
                inputMode='numeric'
              />
              {ticket.assignee_name ? (
                <Text variant='muted' className='text-[11px]'>
                  Current: {ticket.assignee_name}
                </Text>
              ) : null}
              <Button
                type='button'
                size='sm'
                variant='outline'
                disabled={isUpdatingAssignee}
                onClick={() => void handleAssigneeSave()}
              >
                {isUpdatingAssignee ? 'Saving…' : 'Save assignee'}
              </Button>
            </div>
          </div>

          <TicketNotesCard
            ticketId={numericId}
            notes={ticket.admin_notes}
            onSaved={applyTicketUpdate}
          />
        </Flex>
      </div>
    </Flex>
  );
}
