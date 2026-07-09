import { IconEye } from '@tabler/icons-react';
import type { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Flex } from '@/components/ui/flex';
import { SupportChannelBadge } from '@/domains/support-admin/components/support-channel-badge';
import { SupportStatusBadge } from '@/domains/support-admin/components/support-status-badge';
import type { DtoSupportTicketResponse } from '@/domains/support-admin/lib/support-list';

function formatTicketDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, 'MMM d, yyyy · h:mm a');
}

export function createSupportColumns(): ColumnDef<DtoSupportTicketResponse>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Ticket',
      cell: ({ row }) => (
        <p className='font-mono text-xs font-semibold'>#{row.original.id ?? '—'}</p>
      )
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }) => (
        <div className='max-w-xs'>
          <p className='truncate text-sm font-medium'>{row.original.subject ?? '—'}</p>
          <p className='text-muted-foreground truncate text-xs'>
            {row.original.customer_name || row.original.customer_email || 'Guest'}
          </p>
        </div>
      )
    },
    {
      id: 'channel',
      header: 'Channel',
      cell: ({ row }) => <SupportChannelBadge channel={row.original.channel} />
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => <SupportStatusBadge status={row.original.status} />
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <span className='text-muted-foreground text-xs capitalize'>
          {row.original.priority ?? 'normal'}
        </span>
      )
    },
    {
      accessorKey: 'assignee_name',
      header: 'Assignee',
      cell: ({ row }) => (
        <span className='text-xs'>{row.original.assignee_name ?? 'Unassigned'}</span>
      )
    },
    {
      accessorKey: 'last_message_at',
      header: 'Last activity',
      cell: ({ row }) => (
        <span className='text-muted-foreground text-xs'>
          {formatTicketDate(row.original.last_message_at ?? row.original.updated_at)}
        </span>
      )
    },
    {
      accessorKey: 'message_count',
      header: 'Msgs',
      cell: ({ row }) => (
        <span className='text-muted-foreground tabular-nums'>
          {row.original.message_count ?? 0}
        </span>
      )
    }
  ];
}

export function supportRowMenuActions(
  ticket: DtoSupportTicketResponse,
  openTicket: (id: number) => void
) {
  if (!ticket.id) return null;

  return (
    <DropdownMenuItem onClick={() => openTicket(ticket.id!)}>
      <Flex align='center' className='gap-2'>
        <IconEye className='size-4' />
        View ticket
      </Flex>
    </DropdownMenuItem>
  );
}

export function supportDetailsUrl(ticket: DtoSupportTicketResponse) {
  return ticket.id ? `/dashboard/support/${ticket.id}` : '/dashboard/support';
}

export function SupportSubjectLink({ ticket }: { ticket: DtoSupportTicketResponse }) {
  if (!ticket.id) return <span>{ticket.subject}</span>;

  return (
    <Link
      href={supportDetailsUrl(ticket)}
      className='text-primary text-sm font-medium hover:underline'
      onClick={(event) => event.stopPropagation()}
    >
      {ticket.subject}
    </Link>
  );
}
