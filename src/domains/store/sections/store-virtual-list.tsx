'use client';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef } from 'react';

import { mapStoreToView } from '~/src/domains/store/store.utils';
import type { DtoStoreResponse } from '~/src/services/-stores-get.schemas';

import { StoreListItem } from '../components/store-list-item';
import type { ModelsStoreReview } from '../store.types';

export function StoresVirtualList({ stores }: { stores: DtoStoreResponse[] }) {
  const mappedStores = useMemo(() => stores.map(mapStoreToView), [stores]);

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: mappedStores.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 170,
    overscan: 6
  });

  return (
    <div ref={parentRef} className='h-[80vh] overflow-y-auto rounded-2xl'>
      <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
        {rowVirtualizer.getVirtualItems().map((vi) => {
          const store = mappedStores[vi.index];
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
