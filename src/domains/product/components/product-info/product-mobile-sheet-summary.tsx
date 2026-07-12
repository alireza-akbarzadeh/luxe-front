'use client';

import { IconRosetteDiscountCheck, IconShieldCheck, IconTruck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { FreeShippingProgress } from '@/domains/cart/components/free-shipping-progress';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

interface ProductMobileSheetSummaryProps {
  product: DtoProductWithLike;
  subtotal: number;
  isOutOfStock: boolean;
  isLowStock: boolean;
  stock: number;
}

/** Expandable PDP bottom-sheet body — shipping progress, description, trust signals. */
export function ProductMobileSheetSummary({
  product,
  subtotal,
  isOutOfStock,
  isLowStock,
  stock
}: ProductMobileSheetSummaryProps) {
  const t = useTranslations('pdp.info');
  const tCard = useTranslations('shop.productCard');
  const tSheet = useTranslations('pdp.mobileSheet');

  const trustItems = [
    { icon: IconTruck, label: t('freeShipping') },
    { icon: IconRosetteDiscountCheck, label: t('authenticity') },
    { icon: IconShieldCheck, label: t('returns') }
  ] as const;

  return (
    <Flex direction='column' gap={3} className='pb-1'>
      <Typography.Text weight='semibold' className='text-base leading-snug'>
        {product.name}
      </Typography.Text>

      {product.description ? (
        <Typography.Muted className='text-sm leading-relaxed'>
          {product.description}
        </Typography.Muted>
      ) : null}

      <FreeShippingProgress subtotal={subtotal} />

      <Flex direction='row' wrap='wrap' gap={2}>
        {isOutOfStock ? (
          <Typography.Muted className='text-destructive text-xs font-medium'>
            {tCard('outOfStock')}
          </Typography.Muted>
        ) : isLowStock ? (
          <Typography.Muted className='text-xs font-medium'>
            {tCard('onlyLeft', { count: stock })}
          </Typography.Muted>
        ) : (
          <Typography.Muted className='text-xs font-medium'>{t('inStock')}</Typography.Muted>
        )}
        {product.sku ? (
          <Typography.Muted className='text-xs'>{t('sku', { sku: product.sku })}</Typography.Muted>
        ) : null}
      </Flex>

      <Flex direction='column' gap={2}>
        <Typography.Muted className='text-[11px] font-medium tracking-wide uppercase'>
          {tSheet('trustTitle')}
        </Typography.Muted>
        <Flex direction='column' gap={2}>
          {trustItems.map(({ icon: Icon, label }) => (
            <Flex key={label} direction='row' align='center' gap={2}>
              <Icon className='text-accent size-4 shrink-0' aria-hidden />
              <Typography.Muted className='text-sm'>{label}</Typography.Muted>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
}
