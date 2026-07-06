'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import { getVendorModuleConfig } from '@/domains/vendor/panel/data/vendor-module-registry';
import {
  useCreateVendorReverseMarketplaceOfferMutation,
  useVendorReverseMarketplaceRequestsQuery
} from '@/domains/vendor/panel/hooks/use-vendor-reverse-marketplace';
import type { ReverseMarketplaceRequestListItem } from '@/lib/api/reverse-marketplace';

function formatBudget(min?: number, max?: number) {
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  if (min != null && max != null) return `${formatter.format(min)} – ${formatter.format(max)}`;
  if (max != null) return `Up to ${formatter.format(max)}`;
  if (min != null) return `From ${formatter.format(min)}`;
  return 'Flexible';
}

export function VendorMarketingDomain() {
  const t = useTranslations('vendor.panel.reverseMarketplace');
  const config = getVendorModuleConfig('marketing');
  const { data, isLoading } = useVendorReverseMarketplaceRequestsQuery();
  const offerMutation = useCreateVendorReverseMarketplaceOfferMutation();

  const requests = data?.data?.requests ?? [];
  const [selected, setSelected] = useState<ReverseMarketplaceRequestListItem | null>(null);
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const openOfferDialog = (request: ReverseMarketplaceRequestListItem) => {
    setSelected(request);
    setPrice(request.budget_max ? String(request.budget_max) : '');
    setMessage('');
  };

  const submitOffer = async () => {
    if (!selected?.id) return;
    const offeredPrice = Number(price);
    if (!offeredPrice || offeredPrice < 0) {
      toast.error(t('invalidPrice'));
      return;
    }

    try {
      await offerMutation.mutateAsync({
        requestId: selected.id,
        payload: { offered_price: offeredPrice, message }
      });
      toast.success(t('offerSent'));
      setSelected(null);
    } catch {
      toast.error(t('offerFailed'));
    }
  };

  return (
    <div className='space-y-8'>
      <VendorModuleHeader
        title={config?.title ?? 'Marketing'}
        description='Respond to buyer wanted listings in the reverse marketplace.'
      />

      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
        <CardHeader>
          <CardTitle>{t('openRequests')}</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {requests.length === 0 && !isLoading ? (
            <p className='text-muted-foreground text-sm'>{t('empty')}</p>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className='border-border/50 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between'
              >
                <div className='space-y-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='font-medium'>{request.title}</p>
                    {request.category ? (
                      <Badge variant='outline' className='rounded-full'>
                        {request.category}
                      </Badge>
                    ) : null}
                  </div>
                  {request.description ? (
                    <p className='text-muted-foreground line-clamp-2 text-sm'>
                      {request.description}
                    </p>
                  ) : null}
                  <p className='text-muted-foreground text-xs'>
                    {t('budget')}: {formatBudget(request.budget_min, request.budget_max)} ·{' '}
                    {t('offers', { count: request.offer_count ?? 0 })}
                  </p>
                </div>
                <Button
                  type='button'
                  className='rounded-full'
                  onClick={() => openOfferDialog(request)}
                  disabled={offerMutation.isPending}
                >
                  {t('submitOffer')}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={selected != null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('offerDialogTitle')}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='offer-price'>{t('offeredPrice')}</Label>
              <Input
                id='offer-price'
                type='number'
                min={0}
                step='0.01'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='offer-message'>{t('message')}</Label>
              <Textarea
                id='offer-message'
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('messagePlaceholder')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setSelected(null)}>
              {t('cancel')}
            </Button>
            <Button
              type='button'
              onClick={() => void submitOffer()}
              disabled={offerMutation.isPending}
            >
              {t('sendOffer')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
