'use client';

import { IconLayoutGrid, IconLayoutList } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import {
  type ProductsViewMode,
  useProductsViewMode
} from '@/domains/product-dashboard/hooks/use-products-view-mode';

export function ProductsViewToggle() {
  const [view, setView] = useProductsViewMode();

  return (
    <Flex
      direction='row'
      align='center'
      className='border-border/60 shrink-0 rounded-xl border p-0.5'
    >
      <ViewButton mode='list' active={view === 'list'} label='List view' onSelect={setView}>
        <IconLayoutList className='size-4' />
      </ViewButton>
      <ViewButton mode='grid' active={view === 'grid'} label='Grid view' onSelect={setView}>
        <IconLayoutGrid className='size-4' />
      </ViewButton>
    </Flex>
  );
}

function ViewButton({
  mode,
  active,
  label,
  onSelect,
  children
}: {
  mode: ProductsViewMode;
  active: boolean;
  label: string;
  onSelect: (mode: ProductsViewMode) => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type='button'
      size='sm'
      variant={active ? 'secondary' : 'ghost'}
      className='h-8 rounded-lg px-2.5'
      aria-label={label}
      aria-pressed={active}
      onClick={() => void onSelect(mode)}
    >
      {children}
    </Button>
  );
}
