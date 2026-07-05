import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoCommunityShoppingListListItem } from '@/services/-community-lists-get.schemas';

type ShoppingListCardProps = {
  list: DtoCommunityShoppingListListItem;
  itemsLabel?: string;
  viewLabel: string;
  className?: string;
};

/** Discovery card for a community shopping list. */
export function ShoppingListCard({
  list,
  itemsLabel,
  viewLabel,
  className
}: ShoppingListCardProps) {
  const href = list.slug ? `/lists/${list.slug}` : '/lists';

  return (
    <Link
      href={href}
      className={cn(
        'group border-border/70 bg-card relative block overflow-hidden rounded-2xl border no-underline',
        className
      )}
    >
      <div className='relative aspect-[16/10] w-full'>
        <AppImage
          src={list.cover_image_url ?? IMAGE_FALLBACK}
          alt=''
          aria-hidden
          fill
          sizes='(max-width: 768px) 90vw, 33vw'
          className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
        />
        <span
          aria-hidden
          className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent'
        />
        {list.theme ? (
          <Typography.Overline className='text-gold absolute start-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[10px] backdrop-blur-sm'>
            {list.theme}
          </Typography.Overline>
        ) : null}
        <Flex direction='column' gap={1} className='absolute inset-x-0 bottom-0 px-4 pb-4'>
          <Typography.Small weight='semibold' className='text-xl text-white'>
            {list.title}
          </Typography.Small>
          {list.author_name ? (
            <Typography.Small className='text-white/75'>
              {list.author_name}
              {list.author_handle ? ` · ${list.author_handle}` : ''}
            </Typography.Small>
          ) : null}
          {list.item_count != null && list.item_count > 0 && itemsLabel ? (
            <Typography.Small className='text-gold text-xs font-medium'>
              {itemsLabel}
            </Typography.Small>
          ) : null}
        </Flex>
      </div>
      <Flex align='center' justify='between' className='border-border/50 border-t px-4 py-3'>
        <Typography.Muted className='line-clamp-2 text-xs leading-relaxed'>
          {list.description}
        </Typography.Muted>
        <span className='text-gold ms-3 shrink-0 text-xs font-semibold tracking-wide uppercase'>
          {viewLabel}
        </span>
      </Flex>
    </Link>
  );
}
