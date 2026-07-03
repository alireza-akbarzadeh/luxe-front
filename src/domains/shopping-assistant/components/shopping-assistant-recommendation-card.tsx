'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoAiRecommendedProduct } from '@/services/-ai-shopping-assistant-post.schemas';

interface ShoppingAssistantRecommendationCardProps {
  item: DtoAiRecommendedProduct;
}

/** Compact product pick shown inside the shopping assistant chat. */
export function ShoppingAssistantRecommendationCard({
  item
}: ShoppingAssistantRecommendationCardProps) {
  const t = useTranslations('shoppingAssistant');
  const { formatPrice, moneyClassName } = useLocaleFormatters();
  const product = item.product;
  if (!product?.id) {
    return null;
  }

  const href = getProductPath(product);
  const imageSrc = product.images?.[0] ?? IMAGE_FALLBACK;

  return (
    <Link
      href={href}
      className='border-border bg-card hover:bg-muted/40 focus-visible:ring-ring block rounded-xl border p-3 transition-colors focus-visible:ring-2 focus-visible:outline-none'
    >
      <Flex direction='row' align='start' spacing={3}>
        <Flex
          align='center'
          justify='center'
          className='bg-muted relative size-16 shrink-0 overflow-hidden rounded-lg'
        >
          <AppImage
            src={imageSrc}
            alt={product.name ?? ''}
            fill
            sizes='64px'
            className='object-cover'
          />
        </Flex>
        <Flex direction='column' spacing={1} className='min-w-0 flex-1'>
          <Typography.Text variant='small' className='line-clamp-2 font-medium'>
            {product.name}
          </Typography.Text>
          <Typography.Text variant='small' className={cn('text-gold-strong', moneyClassName)}>
            {formatPrice(product.price)}
          </Typography.Text>
          {item.reason ? (
            <Typography.Muted className='line-clamp-2 text-xs leading-relaxed'>
              {item.reason}
            </Typography.Muted>
          ) : null}
          <Typography.Overline className='text-gold-strong text-xs'>
            {t('viewProduct')}
          </Typography.Overline>
        </Flex>
      </Flex>
    </Link>
  );
}
