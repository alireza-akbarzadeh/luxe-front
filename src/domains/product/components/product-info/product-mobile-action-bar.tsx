'use client';

import { IconBasket } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';

interface ProductMobileActionBarProps {
  price: number;
  isLoading: boolean;
  isOutOfStock: boolean;
  itemCount: number;
  cartBadgeLabel: string;
  onAddToCart: () => void;
  onOpenCart: () => void;
}

/** Sticky PDP bar on mobile — price row + full-width CTA above tab nav. */
export function ProductMobileActionBar({
  price,
  isLoading,
  isOutOfStock,
  itemCount,
  cartBadgeLabel,
  onAddToCart,
  onOpenCart
}: ProductMobileActionBarProps) {
  const tCard = useTranslations('shop.productCard');
  const t = useTranslations('pdp.info');
  const { formatPrice, moneyClassName } = useLocaleFormatters();

  return (
    <Flex
      direction='column'
      gap={0}
      className={cn(
        'bg-background/95 fixed inset-x-0 z-[45] rounded-t-2xl border-t shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl',
        'dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)]',
        'bottom-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden'
      )}
    >
      <Flex direction='row' align='center' justify='between' className='w-full px-4 py-3'>
        <Flex direction='column' align='start' gap={0.5} className='min-w-0'>
          <Typography.Muted className='text-[11px] font-medium tracking-wide uppercase'>
            {tCard('addToCart')}
          </Typography.Muted>
          <Typography.Text className={cn('text-xl font-bold tabular-nums', moneyClassName)}>
            {formatPrice(price)}
          </Typography.Text>
        </Flex>

        <Button
          type='button'
          variant='outline'
          size='icon'
          className='border-border/80 bg-background relative h-11 w-11 shrink-0 rounded-full'
          onClick={onOpenCart}
          aria-label={itemCount > 0 ? t('viewCartWithCount', { count: itemCount }) : t('viewCart')}
        >
          <IconBasket className='h-5 w-5' />
          {itemCount > 0 ? (
            <span className='bg-gold text-gold-foreground ring-background absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-bold ring-2'>
              {cartBadgeLabel}
            </span>
          ) : null}
        </Button>
      </Flex>

      <Flex direction='column' className='border-border/50 w-full border-t px-4 pt-3 pb-3.5'>
        <Button
          onClick={onAddToCart}
          size='lg'
          className='bg-accent text-accent-foreground hover:bg-accent/90 h-14 w-full rounded-2xl text-base font-semibold shadow-none active:scale-[0.98]'
          disabled={isLoading || isOutOfStock}
        >
          {isLoading ? tCard('adding') : isOutOfStock ? tCard('soldOut') : tCard('addToCart')}
        </Button>
      </Flex>
    </Flex>
  );
}
