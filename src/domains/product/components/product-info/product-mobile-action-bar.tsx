'use client';

import { IconBasket } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Grid } from '@/components/ui/grid';
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

/** Sticky PDP bar on mobile — price + add to cart above tab nav. */
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
    <Grid
      align='center'
      gap={3}
      className={cn(
        'bg-background/95 fixed inset-x-0 z-[55] grid-cols-[auto_minmax(0,1fr)_auto] border-t px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl',
        'dark:shadow-[0_-4px_24px_rgba(0,0,0,0.35)]',
        'bottom-[calc(4rem+env(safe-area-inset-bottom))] lg:hidden'
      )}
    >
      <Typography.Text
        className={cn('shrink-0 text-lg font-bold tabular-nums sm:text-xl', moneyClassName)}
      >
        {formatPrice(price)}
      </Typography.Text>

      <Button
        onClick={onAddToCart}
        size='lg'
        className='bg-accent text-accent-foreground hover:bg-accent/90 h-12 w-full min-w-0 rounded-full text-sm font-semibold shadow-none'
        disabled={isLoading || isOutOfStock}
      >
        {isLoading ? tCard('adding') : isOutOfStock ? tCard('soldOut') : tCard('addToCart')}
      </Button>

      <Button
        type='button'
        variant='outline'
        size='icon'
        className='border-border/80 bg-background relative h-12 w-12 shrink-0 rounded-full'
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
    </Grid>
  );
}
