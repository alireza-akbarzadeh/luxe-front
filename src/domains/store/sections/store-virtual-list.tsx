'use client';
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

import type { ModelsStoreReview } from '../store.types';

import { StoreListItem } from '../components/store-list-item';

export function StoresVirtualList({ stores }: { stores: ModelsStoreReview[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: stores.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 170,
    overscan: 6
  });

  return (
    <div ref={parentRef} className='h-[80vh] overflow-y-auto rounded-2xl'>
      <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
        {rowVirtualizer.getVirtualItems().map((vi) => {
          const store = stores[vi.index];
          return (
            <div
              key={store?.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${vi.start}px)`,
                padding: '0 0 12px 0'
              }}
            >
              <StoreListItem store={store as ModelsStoreReview} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
