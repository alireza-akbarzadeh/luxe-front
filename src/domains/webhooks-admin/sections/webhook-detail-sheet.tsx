'use client';

import { IconCopy } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { WebhookStatusBadge } from '@/domains/webhooks-admin/components/webhook-status-badge';
import type { WebhookEvent } from '@/domains/webhooks-admin/lib/webhook-list';
import { DATE_FORMATS, formatDate } from '@/lib/date';

interface WebhookDetailSheetProps {
  event: WebhookEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className='border-border/40 flex items-start justify-between gap-4 border-b py-3 last:border-b-0'>
      <span className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
        {label}
      </span>
      <div className='max-w-[65%] text-right text-sm font-medium break-all'>{value}</div>
    </div>
  );
}

function CopyableValue({ value }: { value: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <span className='inline-flex items-center justify-end gap-2'>
      <span className='font-mono text-xs'>{value}</span>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='h-7 w-7'
        onClick={() => void copy()}
      >
        <IconCopy className='h-3.5 w-3.5' />
      </Button>
    </span>
  );
}

export function WebhookDetailSheet({ event, open, onOpenChange }: WebhookDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full overflow-y-auto sm:max-w-lg'>
        <SheetHeader>
          <SheetTitle>Webhook event</SheetTitle>
          <SheetDescription>
            {event?.created_at
              ? formatDate(event.created_at, DATE_FORMATS.WITH_TIME)
              : 'Delivery details'}
          </SheetDescription>
        </SheetHeader>

        {event ? (
          <div className='mt-6 px-1'>
            <DetailRow
              label='Event ID'
              value={event.event_id ? <CopyableValue value={event.event_id} /> : '—'}
            />
            <DetailRow
              label='Type'
              value={event.event_type ? <CopyableValue value={event.event_type} /> : '—'}
            />
            <DetailRow label='Source' value={event.source ?? '—'} />
            <DetailRow
              label='Status'
              value={<WebhookStatusBadge status={event.status ?? 'unknown'} />}
            />
            <DetailRow
              label='Received'
              value={
                event.created_at ? formatDate(event.created_at, DATE_FORMATS.WITH_TIME) : '—'
              }
            />
            <DetailRow
              label='Processed'
              value={
                event.processed_at ? formatDate(event.processed_at, DATE_FORMATS.WITH_TIME) : '—'
              }
            />
            {event.error_msg ? (
              <div className='mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4'>
                <p className='text-destructive text-[10px] font-bold tracking-widest uppercase'>
                  Error message
                </p>
                <p className='mt-2 font-mono text-xs break-all'>{event.error_msg}</p>
              </div>
            ) : null}
            <p className='text-muted-foreground mt-6 text-[11px]'>
              Raw payloads are stored server-side for idempotency but are not exposed via this API.
            </p>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
