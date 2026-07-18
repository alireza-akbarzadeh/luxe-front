'use client';

import { IconStar, IconStarFilled } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DtoMenuItemResponse } from '@/services/-user-menu-structure-get.schemas';

import { ICON_MAP } from '../data';

interface SidebarNavIconProps {
  iconName?: string;
  active?: boolean;
}

export function SidebarNavIcon({ iconName, active }: SidebarNavIconProps) {
  const IconComponent = iconName ? ICON_MAP[iconName as keyof typeof ICON_MAP] : null;

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center transition-colors',
        active ? 'text-emerald-400' : 'text-muted-foreground group-hover:text-foreground'
      )}
    >
      {IconComponent ? (
        <IconComponent size={20} strokeWidth={active ? 2.5 : 2} />
      ) : (
        <div
          className={cn(
            'h-1.5 w-1.5 rounded-full bg-current transition-all',
            active ? 'scale-125 opacity-100' : 'opacity-30'
          )}
        />
      )}
    </div>
  );
}

export function SidebarNavBadge({ item }: { item: DtoMenuItemResponse }) {
  if (!item.badge_count || item.badge_count <= 0) return null;

  return (
    <Badge
      variant='outline'
      className={cn(
        'ms-auto h-5 min-w-5 rounded-full px-1 text-[10px] font-semibold',
        item.badge_variant === 'destructive' && 'border-rose-500/30 text-rose-500'
      )}
    >
      {item.badge_count > 99 ? '99+' : item.badge_count}
    </Badge>
  );
}

interface SidebarNavFavoriteButtonProps {
  href?: string;
  label?: string;
  isCollapsed: boolean;
  isFavorite: (href: string) => boolean;
  favoritePendingHref: string | null;
  onToggle: (href: string, label: string) => void;
}

export function SidebarNavFavoriteButton({
  href,
  label,
  isCollapsed,
  isFavorite,
  favoritePendingHref,
  onToggle
}: SidebarNavFavoriteButtonProps) {
  if (!href || isCollapsed) return null;

  const activeFavorite = isFavorite(href);
  const pending = favoritePendingHref === href;

  return (
    <button
      type='button'
      aria-label={activeFavorite ? 'Remove from favorites' : 'Add to favorites'}
      disabled={pending}
      className={cn(
        'ms-1 shrink-0 transition-opacity hover:text-amber-500',
        activeFavorite
          ? 'text-amber-500 opacity-100'
          : 'text-muted-foreground opacity-40 group-hover:opacity-100 focus-visible:opacity-100'
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle(href, label ?? href);
      }}
    >
      {activeFavorite ? (
        <IconStarFilled className='size-3.5 text-amber-500' />
      ) : (
        <IconStar className='size-3.5' />
      )}
    </button>
  );
}
