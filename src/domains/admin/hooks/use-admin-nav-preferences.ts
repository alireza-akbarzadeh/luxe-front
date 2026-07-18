'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAdminNavStore } from '@/domains/admin/stores/admin-nav-store';
import {
  getGetAdminNavPreferencesQueryKey,
  useGetAdminNavPreferences
} from '@/services/-admin-nav-preferences-get';
import { usePutAdminNavPreferences } from '@/services/-admin-nav-preferences-put';
import type { DtoUpdateAdminNavPreferencesRequest } from '@/services/-admin-nav-preferences-put.schemas';

/** Loads and mutates admin navigation favorites and recent pages. */
export function useAdminNavPreferences() {
  const queryClient = useQueryClient();
  const favoritePendingHref = useAdminNavStore((state) => state.favoritePendingHref);
  const setFavoritePendingHref = useAdminNavStore((state) => state.setFavoritePendingHref);

  const query = useGetAdminNavPreferences({
    query: { staleTime: 30_000 }
  });

  const mutation = usePutAdminNavPreferences({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetAdminNavPreferencesQueryKey() });
      },
      onError: () => {
        toast.error('Failed to save navigation preferences');
      },
      onSettled: () => {
        setFavoritePendingHref(null);
      }
    }
  });

  const favorites = query.data?.data?.favorites ?? [];
  const recent = query.data?.data?.recent ?? [];

  const savePreferences = async (payload: DtoUpdateAdminNavPreferencesRequest) => {
    await mutation.mutateAsync({ data: payload });
  };

  const toggleFavorite = async (href: string, label: string) => {
    const removing = favorites.includes(href);
    const nextFavorites = removing
      ? favorites.filter((item) => item !== href)
      : [...favorites, href];

    setFavoritePendingHref(href);

    // Optimistic cache so the Favorites group updates immediately.
    queryClient.setQueryData(getGetAdminNavPreferencesQueryKey(), (current: unknown) => {
      if (!current || typeof current !== 'object') return current;
      const typed = current as { data?: { favorites?: string[]; recent?: unknown } };
      return {
        ...typed,
        data: {
          ...typed.data,
          favorites: nextFavorites,
          recent: typed.data?.recent ?? recent
        }
      };
    });

    try {
      await savePreferences({
        favorites: nextFavorites,
        recent
      });
      toast.success(removing ? `Removed ${label} from favorites` : `Added ${label} to favorites`);
    } catch {
      void queryClient.invalidateQueries({ queryKey: getGetAdminNavPreferencesQueryKey() });
    }
  };

  const isFavorite = (href: string) => favorites.includes(href);

  return {
    favorites,
    recent,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    favoritePendingHref,
    toggleFavorite,
    savePreferences,
    isFavorite
  };
}
