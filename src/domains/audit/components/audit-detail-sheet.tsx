'use client';

import { IconCopy } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';

import { AuditActionBadge } from '@/domains/audit/components/audit-action-badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { DATE_FORMATS, formatDate } from '@/lib/date';
import type { DtoAuditLogResponse } from '@/services/-admin-audit-logs-get.schemas';

interface AuditDetailSheetProps {
  log: DtoAuditLogResponse | null;
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
      <Button type='button' variant='ghost' size='icon' className='h-7 w-7' onClick={() => void copy()}>
        <IconCopy className='h-3.5 w-3.5' />
      </Button>
    </span>
  );
}

export function AuditDetailSheet({ log, open, onOpenChange }: AuditDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full overflow-y-auto sm:max-w-lg'>
        <SheetHeader>
          <SheetTitle>Audit event #{log?.id ?? '—'}</SheetTitle>
          <SheetDescription>
            {log?.created_at ? formatDate(log.created_at, DATE_FORMATS.WITH_TIME) : 'Event details'}
          </SheetDescription>
        </SheetHeader>

        {log ? (
          <div className='mt-6 px-1'>
            <DetailRow label='Action' value={<AuditActionBadge action={log.action ?? '—'} />} />
            <DetailRow label='Actor' value={log.user_email || `User #${log.user_id ?? '—'}`} />
            <DetailRow label='User ID' value={log.user_id ?? '—'} />
            <DetailRow
              label='Resource'
              value={log.resource ? <CopyableValue value={log.resource} /> : '—'}
            />
            <DetailRow
              label='Resource ID'
              value={log.resource_id ? <CopyableValue value={log.resource_id} /> : '—'}
            />
            <DetailRow
              label='Request path'
              value={log.path ? <CopyableValue value={log.path} /> : '—'}
            />
            <DetailRow
              label='IP address'
              value={log.ip_address ? <CopyableValue value={log.ip_address} /> : '—'}
            />
            <DetailRow
              label='Request ID'
              value={log.request_id ? <CopyableValue value={log.request_id} /> : '—'}
            />
            <DetailRow
              label='Timestamp'
              value={
                log.created_at ? formatDate(log.created_at, DATE_FORMATS.WITH_TIME) : '—'
              }
            />
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
