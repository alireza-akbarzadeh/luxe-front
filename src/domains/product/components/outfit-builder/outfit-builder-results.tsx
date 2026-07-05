'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoAiOutfitBuilderPiece } from '@/services/-ai-outfit-builder-post.schemas';
import type { DtoAiOutfitBuilderResponse } from '@/services/-ai-outfit-builder-post.schemas';

import { VisualizationResultList } from '../visualization/visualization-result-list';

interface OutfitBuilderResultsProps {
  result: DtoAiOutfitBuilderResponse;
  onStartOver: () => void;
}

function OutfitPieceCard({ piece }: { piece: DtoAiOutfitBuilderPiece }) {
  const t = useTranslations('pdp.outfitBuilder');
  const { formatPrice, moneyClassName } = useLocaleFormatters();
  const product = piece.product;

  if (!product?.id) {
    return (
      <Flex
        direction='column'
        spacing={1}
        className='border-border rounded-2xl border border-dashed px-4 py-3'
      >
        <Flex direction='row' align='center' justify='between' spacing={2} className='flex-wrap'>
          <Typography.Text className='text-sm font-medium'>{piece.label}</Typography.Text>
          <Typography.Muted className='text-xs capitalize'>{piece.role}</Typography.Muted>
        </Flex>
        {piece.reason ? (
          <Typography.Muted className='text-xs leading-relaxed'>{piece.reason}</Typography.Muted>
        ) : null}
        <Typography.Muted className='text-xs'>{t('noMatch')}</Typography.Muted>
      </Flex>
    );
  }

  const href = getProductPath(product);
  const imageSrc = product.images?.[0] ?? IMAGE_FALLBACK;

  return (
    <Link
      href={href}
      className='border-border bg-card hover:bg-muted/40 focus-visible:ring-ring block rounded-2xl border p-3 transition-colors focus-visible:ring-2 focus-visible:outline-none'
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
          <Flex direction='row' align='center' spacing={2} className='flex-wrap'>
            <Typography.Text variant='small' className='line-clamp-2 font-medium'>
              {piece.label ?? product.name}
            </Typography.Text>
            {piece.is_anchor ? (
              <Badge variant='secondary' className='rounded-full px-2 py-0 text-[10px]'>
                {t('anchorBadge')}
              </Badge>
            ) : (
              <Typography.Muted className='text-xs capitalize'>{piece.role}</Typography.Muted>
            )}
          </Flex>
          <Typography.Text variant='small' className={cn('text-gold-strong', moneyClassName)}>
            {formatPrice(product.price)}
          </Typography.Text>
          {piece.reason ? (
            <Typography.Muted className='line-clamp-2 text-xs leading-relaxed'>
              {piece.reason}
            </Typography.Muted>
          ) : null}
        </Flex>
      </Flex>
    </Link>
  );
}

/** AI outfit plan with slot cards and styling tips. */
export function OutfitBuilderResults({ result, onStartOver }: OutfitBuilderResultsProps) {
  const t = useTranslations('pdp.outfitBuilder');

  return (
    <Flex direction='column' spacing={5} className='max-h-[50vh] overflow-y-auto pe-1'>
      <Flex direction='column' spacing={2}>
        {result.style_theme ? (
          <Typography.Muted className='text-xs tracking-[0.14em] uppercase'>
            {result.style_theme}
          </Typography.Muted>
        ) : null}
        <Typography.Text className='leading-relaxed'>{result.summary}</Typography.Text>
      </Flex>

      {result.pieces && result.pieces.length > 0 ? (
        <Flex direction='column' spacing={3}>
          <Typography.Text className='font-medium'>{t('piecesTitle')}</Typography.Text>
          {result.pieces.map((piece) => (
            <OutfitPieceCard
              key={`${piece.role}-${piece.label}-${piece.product?.id ?? 'slot'}`}
              piece={piece}
            />
          ))}
        </Flex>
      ) : null}

      <VisualizationResultList title={t('tips')} items={result.tips} />

      <button
        type='button'
        onClick={onStartOver}
        className='text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline'
      >
        {t('startOver')}
      </button>
    </Flex>
  );
}
