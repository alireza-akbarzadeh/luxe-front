'use client';

import { useStoresFilters } from '@/domains/store/hooks/useStoresFilter';
import { SORT_OPTIONS } from '../constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { SortKey } from '@/domains/store/store.types';

export function SortDropdown() {
  const { filters, setFilters } = useStoresFilters();
  return (
    <Select value={filters.sort} onValueChange={(v) => setFilters({ sort: v as SortKey, page: 1 })}>
      <SelectTrigger className='h-9 w-[180px] rounded-full' aria-label='Sort stores'>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
