'use client';

import { IconMinus, IconPlus, IconTrash } from '@tabler/icons-react';

import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import {
  cartMoneyClassName,
  formatCartMoney,
  getCartItemImage,
  getCartItemName
} from '@/domains/cart/lib/cart-utils';
import { cn } from '@/lib/utils';
import type { DtoCartItemDetail } from '@/services/-cart-get.schemas';

interface CheckoutMobileSummaryItemProps {
  item: DtoCartItemDetail;
  isUpdating?: boolean;
  isRemoving?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
  decreaseLabel: string;
  increaseLabel: string;
  removeLabel: string;
}

/** Compact checkout summary row — quantity stepper + remove in one horizontal row. */
export function CheckoutMobileSummaryItem({
  item,
  isUpdating,
  isRemoving,
  onDecrease,
  onIncrease,
  onRemove,
  decreaseLabel,
  increaseLabel,
  removeLabel
}: CheckoutMobileSummaryItemProps) {
  const quantity = item.quantity ?? 0;
  const maxStock = item.stock ?? 99;
  const lineTotal = (item.price ?? 0) * quantity;
  const name = getCartItemName(item);
  const isBusy = isUpdating || isRemoving;

  return (
    <li className='border-border/60 bg-card rounded-2xl border p-3 shadow-sm'>
      <Flex direction='row' gap={3} align='start'>
        <div className='bg-muted relative size-16 shrink-0 overflow-hidden rounded-xl'>
          <AppImage
            src={getCartItemImage(item)}
            alt=''
            aria-hidden
            fill
            sizes='64px'
            className='object-cover'
          />
        </div>

        <Flex direction='column' gap={2} className='min-w-0 flex-1'>
          <Flex direction='row' align='start' justify='between' gap={2}>
            <Flex direction='column' gap={0.5} className='min-w-0 flex-1'>
              <Typography.Small weight='medium' className='line-clamp-2 leading-snug'>
                {name}
              </Typography.Small>
              {item.selected_color || item.selected_size ? (
                <Typography.Muted className='text-xs'>
                  {[item.selected_color, item.selected_size].filter(Boolean).join(' · ')}
                </Typography.Muted>
              ) : null}
            </Flex>
            <Typography.Text
              weight='semibold'
              className={cn(cartMoneyClassName, 'shrink-0 text-end tabular-nums')}
            >
              {formatCartMoney(lineTotal)}
            </Typography.Text>
          </Flex>

          <Flex direction='row' align='center' gap={2}>
            <div className='border-border bg-background flex h-10 items-center rounded-full border'>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-l-full'
                onClick={onDecrease}
                disabled={isBusy}
                aria-label={decreaseLabel}
              >
                <IconMinus className='size-4' />
              </Button>
              <Typography.Small
                weight='semibold'
                className='min-w-8 text-center text-sm tabular-nums'
                aria-live='polite'
              >
                {quantity}
              </Typography.Small>
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-r-full'
                onClick={onIncrease}
                disabled={isBusy || quantity >= maxStock}
                aria-label={increaseLabel}
              >
                <IconPlus className='size-4' />
              </Button>
            </div>

            <Button
              type='button'
              variant='ghost'
              size='icon-sm'
              className='text-muted-foreground hover:text-destructive ms-auto shrink-0 rounded-full'
              onClick={onRemove}
              disabled={isBusy}
              loading={isRemoving}
              aria-label={removeLabel}
            >
              {!isRemoving ? <IconTrash className='size-4' /> : null}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </li>
  );
}
