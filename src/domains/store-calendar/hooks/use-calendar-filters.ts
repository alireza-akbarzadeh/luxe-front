import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

import { shiftMonth } from '@/domains/store-calendar/lib/calendar-format';

const now = new Date();

/** URL-synced filters for the store calendar dashboard (month grid, KPIs, events). */
export function useCalendarFilters() {
  const [storeId, setStoreId] = useQueryState('store_id', parseAsInteger);
  const [region, setRegion] = useQueryState('region', parseAsString);
  const [status, setStatus] = useQueryState('status', parseAsString);
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  const [year, setYear] = useQueryState(
    'year',
    parseAsInteger.withDefault(now.getFullYear())
  );
  const [month, setMonth] = useQueryState(
    'month',
    parseAsInteger.withDefault(now.getMonth() + 1)
  );

  const goToMonth = async (delta: number) => {
    const next = shiftMonth(year, month, delta);
    await setYear(next.year);
    await setMonth(next.month);
  };

  const goToToday = async () => {
    await setYear(now.getFullYear());
    await setMonth(now.getMonth() + 1);
  };

  const hasActiveFilters = Boolean(storeId != null || region || status || search);

  const resetFilters = async () => {
    await setStoreId(null);
    await setRegion(null);
    await setStatus(null);
    await setSearch('');
  };

  return {
    storeId,
    setStoreId,
    region,
    setRegion,
    status,
    setStatus,
    search,
    setSearch,
    year,
    month,
    goToMonth,
    goToToday,
    hasActiveFilters,
    resetFilters
  };
}
