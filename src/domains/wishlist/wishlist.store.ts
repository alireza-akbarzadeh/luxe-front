import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useState } from 'react';

export type SortOption = 'price-asc' | 'price-desc' | 'name';
export type ViewMode = 'grid' | 'list';

export default function useWishlistStore() {
  const [sortBy, setSortBy] = useQueryState(
    'sort',
    parseAsStringLiteral<SortOption>(['name', 'price-asc', 'price-desc']).withDefault('name')
  );
  const [viewMode, setViewMode] = useQueryState(
    'view',
    parseAsStringLiteral<ViewMode>(['grid', 'list']).withDefault('grid')
  );
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  const toggleSelectItem = (productId: number) => {
    setSelectedItems((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId]
    );
  };

  const removeItem = (productId: number) => {
    setSelectedItems((previous) => previous.filter((id) => id !== productId));
  };

  return {
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    selectedItems,
    setSelectedItems,
    isCopied,
    setIsCopied,
    toggleSelectItem,
    removeItem
  };
}
