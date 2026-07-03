'use client';

import { IconPlus, IconSparkles } from '@tabler/icons-react';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { type CartItemPayload, useCartController } from '@/hooks/useCartController';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoSmartBundleItem } from '@/services/-products-{id}-smart-bundles-get.schemas';

type SmartBundleCardProps = {
  bundle: DtoSmartBundleItem;
  addAllLabel: string;
  compatibilityLabel: string;
  className?: string;
};

/** Smart bundle card with product strip and add-all-to-cart action. */
export function SmartBundleCard({
  bundle,
  addAllLabel,
  compatibilityLabel,
  className,
}: SmartBundleCardProps) {
  const { formatPrice, moneyClassName } = useLocaleFormatters();
  const { increment } = useCartController();
  const products = bundle.products ?? [];

  const handleAddAll = () => {
    for (const product of products) {
      if (!product.id) continue;
      const payload: CartItemPayload = {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        image_url: product.images?.[0],
        stock: product.stock,
      };
      increment(payload);
    }
  };

  return (
    <article
      className={cn(
        'border-border/70 bg-card flex h-full flex-col overflow-hidden rounded-2xl border',
        className
      )}
    >
      <Flex direction='column' spacing={2} className='border-border/60 border-b p-4 sm:p-5'>
        <Flex align='center' justify='between' className='gap-3'>
          <Flex align='center' spacing={2}>
            <IconSparkles className='text-accent size-4 shrink-0' aria-hidden />
            <Typography.H3 family='display' className='text-lg font-semibold'>
              {bundle.title}
            </Typography.H3>
          </Flex>
          {bundle.compatibility_score != null ? (
            <Badge variant='secondary' className='rounded-full text-[10px] tracking-wide uppercase'>
              {compatibilityLabel}
            </Badge>
          ) : null}
        </Flex>
        {bundle.description ? (
          <Typography.Muted className='text-sm leading-relaxed'>{bundle.description}</Typography.Muted>
        ) : null}
      </Flex>

      <Grid cols={2} className='gap-3 p-4 sm:grid-cols-3 sm:p-5'>
        {products.map((product) => (
          <Link
            key={product.id}
            href={getProductPath(product)}
            className='group block no-underline'
          >
            <div className='bg-muted relative mb-2 aspect-square overflow-hidden rounded-xl'>
              <AppImage
                src={product.images?.[0] ?? IMAGE_FALLBACK}
                alt={product.name ?? ''}
                fill
                sizes='120px'
                className='object-cover transition-transform duration-300 group-hover:scale-105'
              />
            </div>
            <Typography.Small className='line-clamp-2 text-xs leading-snug font-medium'>
              {product.name}
            </Typography.Small>
            <Typography.Small className={cn('mt-1 text-xs font-semibold', moneyClassName)}>
              {formatPrice(product.price)}
            </Typography.Small>
          </Link>
        ))}
      </Grid>

      <Flex
        align='center'
        justify='between'
        className='border-border/60 mt-auto border-t px-4 py-4 sm:px-5'
      >
        <div>
          <Typography.Overline className='text-muted-foreground'>{addAllLabel}</Typography.Overline>
          <Typography.P weight='semibold' className={cn('text-base', moneyClassName)}>
            {formatPrice(bundle.subtotal)}
          </Typography.P>
        </div>
        <Button type='button' className='rounded-full' onClick={handleAddAll}>
          <IconPlus className='me-1 size-4' />
          {addAllLabel}
        </Button>
      </Flex>
    </article>
  );
}
