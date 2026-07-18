'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useGetAdminStores } from '@/services/-admin-stores-get';

const ALL_STORES_VALUE = 'all';

interface StoreSelectProps {
  value: number | null;
  onChange: (storeId: number | null) => void;
  className?: string;
}

/** Store filter dropdown backed by `/admin/stores` (first 100, active first). */
export function StoreSelect({ value, onChange, className }: StoreSelectProps) {
  const { data, isLoading } = useGetAdminStores({ limit: 100, sort_by: 'newest' });
  const stores = data?.data?.stores ?? [];

  return (
    <Select
      value={value != null ? String(value) : ALL_STORES_VALUE}
      onValueChange={(next) => onChange(next === ALL_STORES_VALUE ? null : Number(next))}
    >
      <SelectTrigger className={className} size='sm' aria-label='Filter by store'>
        <SelectValue placeholder={isLoading ? 'Loading stores…' : 'All Stores'} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_STORES_VALUE}>All Stores</SelectItem>
        {stores.map((store) => (
          <SelectItem key={store.id} value={String(store.id)}>
            {store.name || `Store #${store.id}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
