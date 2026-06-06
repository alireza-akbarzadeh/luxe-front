// hooks/use-orders-query-state.ts
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

import type { Filter, SortDirection } from '@/domains/orders/orders-types';

const SORTABLE_KEYS = ['order_number', 'total', 'ordered_at'] as const;
type SortableKey = (typeof SORTABLE_KEYS)[number];

export function useOrdersQueryState() {
  // ---------- Search, status tab, sorting, pagination ----------
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''));
  const [statusTab, setStatusTab] = useQueryState('status', parseAsString.withDefault('All'));
  const [sortKey, setSortKey] = useQueryState(
    'sort',
    parseAsStringEnum<SortableKey>(SORTABLE_KEYS as unknown as SortableKey[]).withDefault(
      'ordered_at'
    )
  );
  const [sortDir, setSortDir] = useQueryState(
    'dir',
    parseAsStringEnum<SortDirection>(['asc', 'desc']).withDefault('desc')
  );
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(0));
  const [pageSize, setPageSize] = useQueryState('size', parseAsInteger.withDefault(10));

  // ---------- Advanced filters (existing) ----------
  const [filtersRaw, setFiltersRaw] = useQueryState('filters', parseAsString.withDefault('[]'));
  const filters = useMemo(() => JSON.parse(filtersRaw) as Filter[], [filtersRaw]);

  const setFilters = useCallback(
    async (newFilters: Filter[]) => {
      await setFiltersRaw(JSON.stringify(newFilters));
    },
    [setFiltersRaw]
  );

  const getFilterValue = useCallback(
    (id: string): string[] => {
      const filter = filters.find((f) => f.id === id);
      return (filter?.value as string[]) || [];
    },
    [filters]
  );

  const setStatus = useCallback(
    async (values: string[]) => {
      const others = filters.filter((f) => f.id !== 'status');
      await setFilters(values.length ? [...others, { id: 'status', value: values }] : others);
    },
    [filters, setFilters]
  );

  const setPaymentStatus = useCallback(
    async (values: string[]) => {
      const others = filters.filter((f) => f.id !== 'payment_status');
      await setFilters(
        values.length ? [...others, { id: 'payment_status', value: values }] : others
      );
    },
    [filters, setFilters]
  );

  const setChannel = useCallback(
    async (values: string[]) => {
      const others = filters.filter((f) => f.id !== 'channel');
      await setFilters(values.length ? [...others, { id: 'channel', value: values }] : others);
    },
    [filters, setFilters]
  );

  const setPriority = useCallback(
    async (values: string[]) => {
      const others = filters.filter((f) => f.id !== 'priority');
      await setFilters(values.length ? [...others, { id: 'priority', value: values }] : others);
    },
    [filters, setFilters]
  );

  const setTotalRange = useCallback(
    async (min: number | null, max: number | null) => {
      const others = filters.filter((f) => f.id !== 'total_range');
      if (min !== null || max !== null) {
        await setFilters([
          ...others,
          { id: 'total_range', value: [String(min ?? ''), String(max ?? '')] }
        ]);
      } else {
        await setFilters(others);
      }
    },
    [filters, setFilters]
  );

  const minTotal = useMemo(() => {
    const range = getFilterValue('total_range');
    return range[0] ? Number(range[0]) : null;
  }, [getFilterValue]);

  const maxTotal = useMemo(() => {
    const range = getFilterValue('total_range');
    return range[1] ? Number(range[1]) : null;
  }, [getFilterValue]);

  const resetAdvancedFilters = useCallback(() => setFilters([]), [setFilters]);

  const resetAllFilters = useCallback(async () => {
    await setSearch('');
    await setStatusTab('All');
    await setFilters([]);
    await setPage(0);
    // optionally reset sorting to defaults
    await setSortKey('ordered_at');
    await setSortDir('desc');
  }, [setSearch, setStatusTab, setFilters, setPage, setSortKey, setSortDir]);

  return {
    search,
    setSearch,
    statusTab,
    setStatusTab,
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,
    page,
    setPage,
    pageSize,
    setPageSize,
    filters,
    setFilters: setFiltersRaw,
    status: getFilterValue('status'),
    setStatus,
    paymentStatus: getFilterValue('payment_status'),
    setPaymentStatus,
    channel: getFilterValue('channel'),
    setChannel,
    priority: getFilterValue('priority'),
    setPriority,
    minTotal,
    maxTotal,
    setTotalRange,
    resetAdvancedFilters,
    resetAllFilters
  };
}
