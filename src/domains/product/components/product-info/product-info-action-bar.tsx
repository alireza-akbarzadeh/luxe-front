'use client';

import { IconArrowsLeftRight, IconBasket, IconShare2 } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { LikeButton } from '@/components/buttons/like-button';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

interface ProductInfoActionBarProps {
  product: DtoProductWithLike;
  isLiked: boolean;
  isLoading: boolean;
  isOutOfStock: boolean;
  inCompare: boolean;
  itemCount: number;
  cartBadgeLabel: string;
  onAddToCart: () => void;
  onShare: () => void;
  onCompare: () => void;
  onOpenCart: () => void;
}

const iconActionClassName =
  'border-border/80 bg-background hover:bg-muted h-11 w-11 shrink-0 rounded-full border shadow-sm';

export function ProductInfoActionBar({
  product,
  isLiked,
  isLoading,
  isOutOfStock,
  inCompare,
  itemCount,
  cartBadgeLabel,
  onAddToCart,
  onShare,
  onCompare,
  onOpenCart
}: ProductInfoActionBarProps) {
  const t = useTranslations('pdp.info');
  const tCard = useTranslations('shop.productCard');

  return (
    <TooltipProvider delayDuration={200}>
      <div className='flex flex-wrap items-center gap-2'>
        <Button
          onClick={onAddToCart}
          size='lg'
          className='bg-accent text-accent-foreground hover:bg-accent/90 h-14 min-w-0 flex-1 basis-[12rem] rounded-full text-base font-medium shadow-none'
          disabled={isLoading || isOutOfStock}
        >
          {isLoading ? tCard('adding') : isOutOfStock ? tCard('soldOut') : tCard('addToCart')}
        </Button>

        <div className='flex shrink-0 items-center gap-1.5'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='outline'
                size='icon'
                className={iconActionClassName}
                onClick={() => void onShare()}
                aria-label={t('shareProduct')}
              >
                <IconShare2 className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top'>{t('shareProduct')}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='outline'
                size='icon'
                className={cn(
                  iconActionClassName,
                  inCompare && 'border-accent/40 bg-accent/10 text-accent'
                )}
                disabled={!product.id}
                onClick={onCompare}
                aria-label={inCompare ? t('openCompare') : t('addToCompare')}
              >
                <IconArrowsLeftRight className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top'>
              {inCompare ? t('openCompare') : t('addToCompare')}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type='button'
                variant='outline'
                size='icon'
                className={cn(iconActionClassName, 'relative')}
                onClick={onOpenCart}
                aria-label={
                  itemCount > 0 ? t('viewCartWithCount', { count: itemCount }) : t('viewCart')
                }
              >
                <IconBasket className='h-4 w-4' />
                {itemCount > 0 ? (
                  <span className='bg-gold text-gold-foreground ring-background absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[10px] font-bold ring-2'>
                    {cartBadgeLabel}
                  </span>
                ) : null}
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top'>
              {itemCount > 0 ? t('viewCartWithCount', { count: itemCount }) : t('viewCart')}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className='inline-flex'>
                <LikeButton
                  productName={product.name as string}
                  isLiked={isLiked}
                  productId={product.id as number}
                  className={iconActionClassName}
                />
              </span>
            </TooltipTrigger>
            <TooltipContent side='top'>
              {isLiked ? t('removeWishlist') : t('addWishlist')}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
