'use client';

import { IconAlertTriangle } from '@tabler/icons-react';

import type { DtoCartItemDetail } from '~/src/services/-cart-get.schemas';

import {
  describeVariantSelectionGap,
  getCartItemName,
  getItemsNeedingVariantSelection
} from '../lib/cart-utils';

interface CartVariantAlertProps {
  items: DtoCartItemDetail[];
}

/** Prominent warning when cart items still need color/size selection. */
export function CartVariantAlert({ items }: CartVariantAlertProps) {
  const incompleteItems = getItemsNeedingVariantSelection(items);

  if (incompleteItems.length === 0) {
    return null;
  }

  return (
    <div
      role='alert'
      className='border-warning/40 bg-warning/10 rounded-2xl border px-4 py-4 sm:px-5'
    >
      <div className='flex gap-3'>
        <IconAlertTriangle className='text-warning mt-0.5 size-5 shrink-0' />
        <div className='space-y-2'>
          <div>
            <p className='font-medium'>Select product options before checkout</p>
            <p className='text-muted-foreground mt-1 text-sm leading-relaxed'>
              Some items in your cart require a color or size. Choose the options on the highlighted
              items below, then continue to checkout.
            </p>
          </div>
          <ul className='space-y-1 text-sm'>
            {incompleteItems.map((item) => (
              <li key={item.id}>
                <span className='font-medium'>{getCartItemName(item)}</span>
                <span className='text-muted-foreground'>
                  {' '}
                  — select {describeVariantSelectionGap(item)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
