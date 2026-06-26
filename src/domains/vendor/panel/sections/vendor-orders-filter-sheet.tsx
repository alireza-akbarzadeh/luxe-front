'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { useVendorOrdersQueryState } from '@/domains/vendor/panel/hooks/use-vendor-orders-query';

interface VendorOrdersFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

export function VendorOrdersFilterSheet({
  open,
  onOpenChange,
  onReset
}: VendorOrdersFilterSheetProps) {
  const t = useTranslations('vendor.panel.orders.filters');
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount
  } = useVendorOrdersQueryState();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='flex w-full flex-col sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>{t('title')}</SheetTitle>
          <SheetDescription>{t('description')}</SheetDescription>
        </SheetHeader>

        <Flex direction='column' spacing={4} className='flex-1 overflow-y-auto px-1 py-2'>
          <Flex direction='row' spacing={4} wrap='wrap' className='grid sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='vendor-orders-from-date'>{t('fromDate')}</Label>
              <Input
                id='vendor-orders-from-date'
                type='date'
                value={fromDate}
                onChange={(event) => void setFromDate(event.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='vendor-orders-to-date'>{t('toDate')}</Label>
              <Input
                id='vendor-orders-to-date'
                type='date'
                value={toDate}
                onChange={(event) => void setToDate(event.target.value)}
              />
            </div>
          </Flex>

          <Flex direction='row' spacing={4} wrap='wrap' className='grid sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='vendor-orders-min-amount'>{t('minAmount')}</Label>
              <Input
                id='vendor-orders-min-amount'
                type='number'
                min={0}
                step='0.01'
                placeholder='0'
                value={minAmount ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  void setMinAmount(value === '' ? null : Number(value));
                }}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='vendor-orders-max-amount'>{t('maxAmount')}</Label>
              <Input
                id='vendor-orders-max-amount'
                type='number'
                min={0}
                step='0.01'
                placeholder={t('anyAmount')}
                value={maxAmount ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  void setMaxAmount(value === '' ? null : Number(value));
                }}
              />
            </div>
          </Flex>
        </Flex>

        <SheetFooter className='gap-2 sm:justify-between'>
          <Button type='button' variant='ghost' onClick={onReset}>
            {t('reset')}
          </Button>
          <Button type='button' onClick={() => onOpenChange(false)}>
            {t('apply')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
