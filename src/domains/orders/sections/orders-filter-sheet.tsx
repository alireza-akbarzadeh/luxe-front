'use client';

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { useOrdersQueryState } from '@/domains/orders/hooks/use-orders-query';
import type { PaymentStatusFilter, ShipmentStatusFilter } from '@/domains/orders/orders.schema';
import { PAYMENT_STATUS_FILTERS, SHIPMENT_STATUS_FILTERS } from '@/domains/orders/orders.schema';

interface OrdersFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
}

export function OrdersFilterSheet({ open, onOpenChange, onReset }: OrdersFilterSheetProps) {
  const {
    paymentStatus,
    setPaymentStatus,
    shipmentStatus,
    setShipmentStatus,
    tag,
    setTag,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount
  } = useOrdersQueryState();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='flex w-full flex-col sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>Filter orders</SheetTitle>
          <SheetDescription>
            Narrow the list by payment, shipment, tags, date range, and order total. Status tabs
            apply on top of these filters.
          </SheetDescription>
        </SheetHeader>

        <Flex direction='column' spacing={4} className='flex-1 overflow-y-auto px-1 py-2'>
          <div className='space-y-2'>
            <Label>Payment status</Label>
            <Select
              value={paymentStatus}
              onValueChange={(value) => void setPaymentStatus(value as PaymentStatusFilter)}
            >
              <SelectTrigger>
                <SelectValue placeholder='All payments' />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_STATUS_FILTERS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Shipment status</Label>
            <Select
              value={shipmentStatus}
              onValueChange={(value) => void setShipmentStatus(value as ShipmentStatusFilter)}
            >
              <SelectTrigger>
                <SelectValue placeholder='All shipments' />
              </SelectTrigger>
              <SelectContent>
                {SHIPMENT_STATUS_FILTERS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='orders-tag-filter'>Tag</Label>
            <Input
              id='orders-tag-filter'
              placeholder='e.g. vip, wholesale'
              value={tag}
              onChange={(event) => void setTag(event.target.value)}
            />
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='orders-from-date'>From date</Label>
              <Input
                id='orders-from-date'
                type='date'
                value={fromDate}
                onChange={(event) => void setFromDate(event.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='orders-to-date'>To date</Label>
              <Input
                id='orders-to-date'
                type='date'
                value={toDate}
                onChange={(event) => void setToDate(event.target.value)}
              />
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='orders-min-amount'>Min total</Label>
              <Input
                id='orders-min-amount'
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
              <Label htmlFor='orders-max-amount'>Max total</Label>
              <Input
                id='orders-max-amount'
                type='number'
                min={0}
                step='0.01'
                placeholder='Any'
                value={maxAmount ?? ''}
                onChange={(event) => {
                  const value = event.target.value;
                  void setMaxAmount(value === '' ? null : Number(value));
                }}
              />
            </div>
          </div>
        </Flex>

        <SheetFooter className='gap-2 sm:justify-between'>
          <Button type='button' variant='ghost' onClick={onReset}>
            Reset filters
          </Button>
          <Button type='button' onClick={() => onOpenChange(false)}>
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
