'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

import { useAdminNavStore } from '@/domains/admin/stores/admin-nav-store';
import {
  getGetAdminNavPreferencesQueryKey,
  useGetAdminNavPreferences
} from '@/services/-admin-nav-preferences-get';
import type {
  DtoAdminNavRecentPage,
  GetAdminNavPreferences200
} from '@/services/-admin-nav-preferences-get.schemas';
import { usePutAdminNavPreferences } from '@/services/-admin-nav-preferences-put';

type NavPrefsPatch = {
  favorites?: string[];
  recent?: DtoAdminNavRecentPage[];
};

type CachedNavPrefs = {
  favorites: string[];
  recent: DtoAdminNavRecentPage[];
};

function readCachedPrefs(cached: GetAdminNavPreferences200 | undefined): CachedNavPrefs {
  return {
    favorites: cached?.data?.favorites ?? [],
    recent: cached?.data?.recent ?? []
  };
}

/** Loads and mutates admin navigation favorites and recent pages. */
export function useAdminNavPreferences() {
  const queryClient = useQueryClient();
  const favoritePendingHref = useAdminNavStore((state) => state.favoritePendingHref);
  const setFavoritePendingHref = useAdminNavStore((state) => state.setFavoritePendingHref);
  /** Serializes preference PUTs so recent-page tracking cannot wipe a concurrent favorite toggle. */
  const saveQueueRef = useRef(Promise.resolve());

  const query = useGetAdminNavPreferences({
    query: { staleTime: 30_000 }
  });

  const mutation = usePutAdminNavPreferences({
    mutation: {
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
  const mutateAsync = mutation.mutateAsync;

  const enqueueSave = useCallback(
    (buildPatch: (latest: CachedNavPrefs) => NavPrefsPatch) => {
      const queryKey = getGetAdminNavPreferencesQueryKey();

      const applyCache = (next: CachedNavPrefs) => {
        queryClient.setQueryData<GetAdminNavPreferences200>(queryKey, (current) => ({
          ...(current ?? { success: true }),
          data: next
        }));
      };

      const run = async () => {
        const latest = readCachedPrefs(
          queryClient.getQueryData<GetAdminNavPreferences200>(queryKey)
        );
        const patch = buildPatch(latest);
        const next: CachedNavPrefs = {
          favorites: patch.favorites ?? latest.favorites,
          recent: patch.recent ?? latest.recent
        };

        applyCache(next);

        const response = await mutateAsync({ data: next });
        applyCache(readCachedPrefs({ data: response.data }));
        return response;
      };

      const queued = saveQueueRef.current.then(run, run);
      saveQueueRef.current = queued.then(
        () => undefined,
        () => undefined
      );
      return queued;
    },
    [mutateAsync, queryClient]
  );

  const savePreferences = useCallback(
    (payload: NavPrefsPatch) => enqueueSave(() => payload),
    [enqueueSave]
  );

  const toggleFavorite = useCallback(
    async (href: string, label: string) => {
      const queryKey = getGetAdminNavPreferencesQueryKey();
      const latest = readCachedPrefs(queryClient.getQueryData<GetAdminNavPreferences200>(queryKey));
      const removing = latest.favorites.includes(href);
      const nextFavorites = removing
        ? latest.favorites.filter((item) => item !== href)
        : [...latest.favorites, href];

      setFavoritePendingHref(href);
      queryClient.setQueryData<GetAdminNavPreferences200>(queryKey, (current) => ({
        ...(current ?? { success: true }),
        data: { ...latest, favorites: nextFavorites }
      }));

      try {
        await enqueueSave(() => ({ favorites: nextFavorites }));
        toast.success(removing ? `Removed ${label} from favorites` : `Added ${label} to favorites`);
      } catch {
        void queryClient.invalidateQueries({ queryKey });
      }
    },
    [enqueueSave, queryClient, setFavoritePendingHref]
  );

  /** Appends a recent page using the latest cached favorites (safe with concurrent toggles). */
  const trackRecentPage = useCallback(
    (page: { href: string; label: string }) =>
      enqueueSave((latest) => ({
        recent: [
          {
            href: page.href,
            label: page.label,
            visited_at: new Date().toISOString()
          },
          ...latest.recent.filter((item) => item.href !== page.href)
        ].slice(0, 10)
      })),
    [enqueueSave]
  );

  const isFavorite = (href: string) => favorites.includes(href);

  return {
    favorites,
    recent,
    isLoading: query.isLoading,
    isSaving: mutation.isPending,
    favoritePendingHref,
    toggleFavorite,
    trackRecentPage,
    savePreferences,
    isFavorite
  };
}
