'use client';

import { parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { useMemo, useState } from 'react';

import type { BrandsDirectoryTab } from '@/domains/brands/types/brands.types';
import type { GetBrandsParams } from '@/services/-brands-get.schemas';

export const BRANDS_PAGE_SIZE = 24;

const tabValues = ['all', 'popular', 'newest', 'name_asc'] as const;

function tabToApiSort(tab: BrandsDirectoryTab): GetBrandsParams['sort'] {
  switch (tab) {
    case 'popular':
      return 'popular';
    case 'name_asc':
      return 'name_asc';
    case 'newest':
      return 'newest';
    default:
      return undefined;
  }
}

/** URL state for the storefront brands directory (search + tab). */
export function useBrandsDirectoryFilters() {
  const [params, setParams] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      tab: parseAsStringLiteral(tabValues).withDefault('all')
    },
    { shallow: false }
  );

  const [limit, setLimit] = useState(BRANDS_PAGE_SIZE);

  const apiParams = useMemo((): GetBrandsParams => {
    return {
      page: 1,
      limit,
      search: params.q.trim() || undefined,
      status: 'active',
      sort: tabToApiSort(params.tab as BrandsDirectoryTab)
    };
  }, [limit, params.q, params.tab]);

  return {
    search: params.q,
    tab: params.tab as BrandsDirectoryTab,
    limit,
    setSearch: (q: string) => {
      setLimit(BRANDS_PAGE_SIZE);
      void setParams({ q });
    },
    setTab: (tab: BrandsDirectoryTab) => {
      setLimit(BRANDS_PAGE_SIZE);
      void setParams({ tab });
    },
    loadMore: () => setLimit((prev) => prev + BRANDS_PAGE_SIZE),
    apiParams
  };
}
