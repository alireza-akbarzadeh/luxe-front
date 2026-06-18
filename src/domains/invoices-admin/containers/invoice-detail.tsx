'use client';

import { IconAlertTriangle, IconArrowLeft, IconDownload, IconMail } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { downloadInvoicePdf } from '@/domains/invoices-admin/lib/invoice-export';
import { InvoiceStatusBadge } from '@/domains/invoices-admin/components/invoice-status-badge';
import { INVOICE_STATUS_OPTIONS } from '@/domains/invoices-admin/invoices.schema';
import { ApiPaymentStatusBadge } from '@/domains/orders/components/order-api-badges';
import { OrderLineItems } from '@/domains/orders/sections/order-line-items';
import { formatCurrency } from '@/lib/format';
import {
  getGetAdminInvoicesIdQueryKey,
  getGetAdminInvoicesQueryKey,
  useGetAdminInvoicesId,
  usePostAdminInvoicesIdSend,
  usePutAdminInvoicesIdStatus
} from '@/services/-admin-invoices';
import type {
  DtoInvoiceDetailResponse,
  DtoUpdateInvoiceStatusRequest
} from '@/services/-admin-invoices.schemas';
import type { DtoAdminOrderItemView } from '@/services/-orders-{id}-get.schemas';

import { InvoiceDetailSkeleton } from '../sections/invoice-detail-skeleton';

interface InvoiceDetailDomainProps {
  invoiceId: string;
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

export function InvoiceDetailDomain({ invoiceId }: InvoiceDetailDomainProps) {
  const numericId = Number(invoiceId);
  const queryClient = useQueryClient();
  const isValidId = Number.isFinite(numericId) && numericId > 0;

  const { data, isLoading, isError, error, refetch } = useGetAdminInvoicesId(numericId, {
    query: { enabled: isValidId }
  });

  const invalidateInvoiceQueries = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminInvoicesIdQueryKey(numericId) });
    void queryClient.invalidateQueries({ queryKey: getGetAdminInvoicesQueryKey() });
  }, [numericId, queryClient]);

  if (!isValidId) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className='mx-auto max-w-350 px-6 py-8'>
        <InvoiceDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Failed to load invoice';

    return (
      <div className='flex min-h-[50vh] items-center justify-center p-8'>
        <div className='max-w-md rounded-2xl border-2 border-dashed p-12 text-center'>
          <IconAlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
          <h3 className='text-lg font-bold tracking-tight'>Invoice unavailable</h3>
          <p className='text-muted-foreground mt-2 text-sm'>{message}</p>
          <Button className='mt-4' variant='outline' onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const invoice = data?.data;
  if (!invoice?.id) {
    notFound();
  }

  return (
    <InvoiceDetailView invoice={invoice} onStatusChange={invalidateInvoiceQueries} />
  );
}

function InvoiceDetailView({
  invoice,
  onStatusChange
}: {
  invoice: DtoInvoiceDetailResponse;
  onStatusChange: () => void;
}) {
  const invoiceId = invoice.id!;
  const [selectedStatus, setSelectedStatus] = useState(invoice.status ?? 'issued');
  const [isDownloading, setIsDownloading] = useState(false);
  const { mutateAsync: updateStatus, isPending } = usePutAdminInvoicesIdStatus();
  const { mutateAsync: sendInvoice, isPending: isSending } = usePostAdminInvoicesIdSend();

  useEffect(() => {
    setSelectedStatus(invoice.status ?? 'issued');
  }, [invoice.status]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === invoice.status) return;

    try {
      await updateStatus({
        id: invoiceId,
        data: { status: selectedStatus as DtoUpdateInvoiceStatusRequest['status'] }
      });
      toast.success('Invoice status updated');
      onStatusChange();
    } catch {
      toast.error('Failed to update invoice status');
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const filename = invoice.invoice_number
        ? `${invoice.invoice_number.replaceAll('/', '-')}.pdf`
        : undefined;
      await downloadInvoicePdf(invoiceId, filename);
    } catch {
      toast.error('Failed to download invoice PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      await sendInvoice({ id: invoiceId });
      toast.success('Invoice email queued for delivery');
    } catch {
      toast.error('Failed to send invoice email');
    }
  };

  const lineItems = (invoice.items ?? []) as DtoAdminOrderItemView[];
  const currency = invoice.currency ?? 'USD';

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 border-border/40 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-350 px-6 py-4'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div className='flex items-start gap-4'>
              <Link href='/dashboard/invoices'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='border-border/60 h-9 w-9 shrink-0 rounded-xl border shadow-sm'
                >
                  <IconArrowLeft className='h-4 w-4' />
                </Button>
              </Link>
              <div>
                <div className='flex flex-wrap items-center gap-3'>
                  <h1 className='text-foreground font-mono text-xl font-black tracking-tight'>
                    {invoice.invoice_number ?? `Invoice #${invoiceId}`}
                  </h1>
                  <InvoiceStatusBadge status={invoice.status} size='md' />
                </div>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Order{' '}
                  {invoice.order_id ? (
                    <Link
                      href={`/dashboard/orders/${invoice.order_id}`}
                      className='text-primary font-semibold hover:underline'
                    >
                      {invoice.order_number ?? `#${invoice.order_id}`}
                    </Link>
                  ) : (
                    '—'
                  )}
                  {' · '}Issued {formatDate(invoice.issued_at ?? invoice.created_at)}
                </p>
              </div>
            </div>
            <div className='flex flex-wrap gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='gap-2'
                disabled={isDownloading}
                onClick={() => void handleDownloadPdf()}
              >
                <IconDownload className='h-4 w-4' />
                {isDownloading ? 'Downloading…' : 'Download PDF'}
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='gap-2'
                disabled={isSending || !invoice.billing_email}
                onClick={() => void handleSendEmail()}
              >
                <IconMail className='h-4 w-4' />
                {isSending ? 'Sending…' : 'Email customer'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-350 space-y-6 px-6 py-8'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            {lineItems.length > 0 ? (
              <OrderLineItems items={lineItems} currency={currency} />
            ) : (
              <div className='bg-card border-border/40 rounded-2xl border p-6 shadow-sm'>
                <p className='text-muted-foreground text-sm'>No line items on this invoice.</p>
              </div>
            )}
          </div>

          <div className='space-y-5'>
            <div className='bg-card border-border/40 rounded-2xl border p-6 shadow-sm'>
              <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                Total due
              </h2>
              <p className='text-foreground mt-3 text-3xl font-black tabular-nums'>
                {formatCurrency(invoice.total_amount ?? 0, currency)}
              </p>
              <div className='text-muted-foreground mt-4 space-y-2 text-xs'>
                <div className='flex justify-between gap-4'>
                  <span>Subtotal</span>
                  <span className='tabular-nums'>{formatCurrency(invoice.subtotal ?? 0, currency)}</span>
                </div>
                <div className='flex justify-between gap-4'>
                  <span>Shipping</span>
                  <span className='tabular-nums'>
                    {formatCurrency(invoice.shipping_amount ?? 0, currency)}
                  </span>
                </div>
                <div className='flex justify-between gap-4'>
                  <span>Tax</span>
                  <span className='tabular-nums'>{formatCurrency(invoice.tax_amount ?? 0, currency)}</span>
                </div>
              </div>
            </div>

            <div className='bg-card border-border/40 space-y-3 rounded-2xl border p-6 text-sm shadow-sm'>
              <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                Billing
              </h2>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Name</span>
                <span className='text-right text-xs font-semibold'>{invoice.billing_name ?? '—'}</span>
              </div>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Email</span>
                <span className='text-right text-xs'>{invoice.billing_email ?? '—'}</span>
              </div>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Payment</span>
                <ApiPaymentStatusBadge status={invoice.payment_status} size='sm' />
              </div>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Method</span>
                <span className='text-xs font-semibold capitalize'>{invoice.payment_method ?? '—'}</span>
              </div>
              <div className='flex justify-between gap-4'>
                <span className='text-muted-foreground'>Paid</span>
                <span className='text-xs tabular-nums'>{formatDate(invoice.paid_at)}</span>
              </div>
            </div>

            <div className='bg-card border-border/40 space-y-4 rounded-2xl border p-6 shadow-sm'>
              <h2 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
                Update status
              </h2>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  {INVOICE_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className='w-full'
                disabled={isPending || selectedStatus === invoice.status}
                onClick={() => void handleStatusUpdate()}
              >
                {isPending ? 'Saving…' : 'Save status'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
