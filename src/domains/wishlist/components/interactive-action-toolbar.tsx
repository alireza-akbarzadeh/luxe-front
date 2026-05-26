import { IconGrid3x3, IconList } from '@tabler/icons-react';

import { Button } from '~/src/components/ui/button';
import { Checkbox } from '~/src/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/src/components/ui/select';
import { useWishlistStore, type SortOption } from '~/src/domains/wishlist/wishlist.store';
import type { DtoWishlistItemDTO } from '~/src/services/-account-wishlist-get.schemas';

interface InteractiveActionToolbarProperties {
  items: DtoWishlistItemDTO[];
}

export default function InteractiveActionToolbar({
  items
}: Readonly<InteractiveActionToolbarProperties>) {
  const {
    selectedItems,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    toggleSelectAll,
    clearSelection
  } = useWishlistStore();

  const validItemIds = items
    .map((item) => Number(item.product_id))
    .filter((id) => !isNaN(id) && id !== 0);

  const isAllSelected =
    validItemIds.length > 0 && validItemIds.every((id) => selectedItems.includes(id));

  return (
    <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-center gap-2'>
        <Checkbox checked={isAllSelected} onCheckedChange={() => toggleSelectAll(validItemIds)} />
        <p className='text-muted-foreground text-sm font-medium select-none'>Select All</p>

        {selectedItems.length > 0 && (
          <div className='animate-in fade-in ml-4 flex items-center gap-2 duration-200'>
            <span className='text-muted-foreground mr-2 text-sm'>
              {selectedItems.length} selected
            </span>
            <Button size='sm' variant='secondary' onClick={() => {}}>
              Add to Cart
            </Button>
            <Button
              size='sm'
              variant='ghost'
              className='text-destructive hover:bg-destructive/10'
              onClick={clearSelection}
            >
              Remove
            </Button>
          </div>
        )}
      </div>

      <div className='flex items-center gap-3 self-end sm:self-auto'>
        <Select
          value={sortBy}
          onValueChange={(v) => {
            setSortBy(v as SortOption);
          }}
        >
          <SelectTrigger className='w-44'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='name'>Name: A-Z</SelectItem>
            <SelectItem value='price-asc'>Price: Low to High</SelectItem>
            <SelectItem value='price-desc'>Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        <div className='bg-background/50 flex items-center rounded-lg border p-1'>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size='icon'
            className='h-8 w-8'
            onClick={() => {
              setViewMode('grid');
            }}
          >
            <IconGrid3x3 className='h-4 w-4' />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size='icon'
            className='h-8 w-8'
            onClick={() => {
              setViewMode('list');
            }}
          >
            <IconList className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
