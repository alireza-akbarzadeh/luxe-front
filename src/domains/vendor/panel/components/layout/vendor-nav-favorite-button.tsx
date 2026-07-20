'use client';

import { IconStar, IconStarFilled } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

interface VendorNavFavoriteButtonProps {
  href: string;
  label: string;
  isCollapsed: boolean;
  isFavorite: (href: string) => boolean;
  onToggle: (href: string, label: string) => void;
}

/** Star control to pin/unpin a vendor panel route. */
export function VendorNavFavoriteButton({
  href,
  label,
  isCollapsed,
  isFavorite,
  onToggle
}: VendorNavFavoriteButtonProps) {
  const t = useTranslations('vendor.panel.nav');

  if (isCollapsed) {
    return null;
  }

  const activeFavorite = isFavorite(href);

  return (
    <button
      type='button'
      aria-label={activeFavorite ? t('removeFromFavorites') : t('addToFavorites')}
      className={cn(
        'ms-1 shrink-0 transition-opacity hover:text-amber-500',
        activeFavorite
          ? 'text-amber-500 opacity-100'
          : 'text-muted-foreground opacity-40 group-hover:opacity-100 focus-visible:opacity-100'
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle(href, label);
      }}
    >
      {activeFavorite ? (
        <IconStarFilled className='size-3.5 text-amber-500' aria-hidden />
      ) : (
        <IconStar className='size-3.5' aria-hidden />
      )}
    </button>
  );
}
