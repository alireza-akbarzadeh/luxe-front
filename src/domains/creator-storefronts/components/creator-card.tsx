import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoCreatorStorefrontListItem } from '@/services/-creators-get.schemas';

type CreatorCardProps = {
  creator: DtoCreatorStorefrontListItem;
  picksLabel?: string;
  shopLabel: string;
  className?: string;
};

/** Discovery card for a creator storefront profile. */
export function CreatorCard({ creator, picksLabel, shopLabel, className }: CreatorCardProps) {
  const href = creator.slug ? `/creators/${creator.slug}` : '/creators';

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
          src={creator.cover_image_url ?? IMAGE_FALLBACK}
          alt=''
          aria-hidden
          fill
          sizes='(max-width: 768px) 90vw, 33vw'
          className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
        />
        <span
          aria-hidden
          className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10'
        />
        <Flex
          direction='row'
          align='center'
          gap={3}
          className='absolute inset-x-0 bottom-0 px-4 py-4'
        >
          <div className='border-background/80 relative size-14 shrink-0 overflow-hidden rounded-full border-2 shadow-lg'>
            <AppImage
              src={creator.avatar_url ?? IMAGE_FALLBACK}
              alt={creator.display_name ?? ''}
              fill
              sizes='56px'
              className='object-cover'
            />
          </div>
          <Flex direction='column' gap={0.5} className='min-w-0 flex-1'>
            <Typography.Small weight='semibold' className='truncate text-lg text-white'>
              {creator.display_name}
            </Typography.Small>
            {creator.handle ? (
              <Typography.Small className='text-white/75'>{creator.handle}</Typography.Small>
            ) : null}
            {creator.specialty ? (
              <Typography.Small className='line-clamp-1 text-white/70'>
                {creator.specialty}
              </Typography.Small>
            ) : null}
            {creator.pick_count != null && creator.pick_count > 0 && picksLabel ? (
              <Typography.Small className='text-gold text-xs font-medium'>
                {picksLabel}
              </Typography.Small>
            ) : null}
          </Flex>
        </Flex>
      </div>
      <Flex align='center' justify='between' className='border-border/50 border-t px-4 py-3'>
        <Typography.Muted className='line-clamp-2 text-xs leading-relaxed'>
          {creator.bio}
        </Typography.Muted>
        <span className='text-gold ms-3 shrink-0 text-xs font-semibold tracking-wide uppercase'>
          {shopLabel}
        </span>
      </Flex>
    </Link>
  );
}
