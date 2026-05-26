import { IconGrid3x3, IconList } from '@tabler/icons-react';

import { Checkbox } from '~/src/components/forms/checkbox';
import { Button } from '~/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/src/components/ui/select';
import useWishlistStore, { type SortOption } from '~/src/domains/wishlist/wishlist.store';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
}

interface InteractiveActionToolbarProperties {
  items: WishlistItem[];
}

export default function InteractiveActionToolbar({
  items
}: Readonly<InteractiveActionToolbarProperties>) {
  const { selectedItems, setSortBy, viewMode, setViewMode, sortBy, setSelectedItems } =
    useWishlistStore();

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map((_, index) => index));
    } else {
      setSelectedItems([]);
    }
  };

  return (
    <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-center gap-2'>
        <Checkbox
          label='Select All'
          checked={items.length > 0 && selectedItems.length === items.length}
          onCheckedChange={toggleSelectAll}
        />

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
              onClick={() => {
                setSelectedItems([]);
              }}
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
            // Fix type mismatch and suppress the floating promise error safely with `void`
            void setSortBy(v as SortOption);
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
