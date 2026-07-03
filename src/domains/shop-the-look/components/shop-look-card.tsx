import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoShopLookListItem } from '@/services/-shop-looks-get.schemas';

type ShopLookCardProps = {
  look: DtoShopLookListItem;
  eyebrow: string;
  shopLabel: string;
  piecesLabel?: string;
  className?: string;
};

export function ShopLookCard({ look, eyebrow, shopLabel, piecesLabel, className }: ShopLookCardProps) {
  const href = look.slug ? `/shop-the-look/${look.slug}` : '/shop-the-look';

  return (
    <Link
      href={href}
      className={cn(
        'group border-border/70 bg-card relative block overflow-hidden rounded-2xl border no-underline',
        className
      )}
    >
      <div className='relative aspect-[4/5] w-full'>
        <AppImage
          src={look.image_url ?? IMAGE_FALLBACK}
          alt={look.title ?? ''}
          fill
          sizes='(max-width: 768px) 90vw, 33vw'
          className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
        />
        <span
          aria-hidden
          className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent'
        />
        <Flex direction='column' spacing={1} className='absolute inset-x-0 bottom-0 px-4 py-4'>
          <Typography.Overline className='text-white/75'>{eyebrow}</Typography.Overline>
          <Typography.Small weight='semibold' className='text-lg text-white'>
            {look.title}
          </Typography.Small>
          {look.tag_count != null && look.tag_count > 0 && piecesLabel ? (
            <Typography.Small className='text-white/80'>{piecesLabel}</Typography.Small>
          ) : null}
          <span className='text-gold mt-2 text-xs font-semibold tracking-wide uppercase'>
            {shopLabel}
          </span>
        </Flex>
      </div>
    </Link>
  );
}
