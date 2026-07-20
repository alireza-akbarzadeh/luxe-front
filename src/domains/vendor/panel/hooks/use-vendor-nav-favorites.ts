'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';

/** Pinned vendor panel routes — persisted in `luxe-vendor-panel` local storage. */
export function useVendorNavFavorites() {
  const t = useTranslations('vendor.panel.nav');
  const favoriteHrefs = useVendorPanelStore((state) => state.favoriteHrefs);
  const toggleFavoriteHref = useVendorPanelStore((state) => state.toggleFavoriteHref);
  const isFavoriteHref = useVendorPanelStore((state) => state.isFavoriteHref);

  const toggleFavorite = useCallback(
    (href: string, label: string) => {
      const removing = isFavoriteHref(href);
      toggleFavoriteHref(href);
      toast.success(
        removing ? t('removedFromFavorites', { label }) : t('addedToFavorites', { label })
      );
    },
    [isFavoriteHref, t, toggleFavoriteHref]
  );

  return {
    favoriteHrefs,
    isFavorite: isFavoriteHref,
    toggleFavorite
  };
}
