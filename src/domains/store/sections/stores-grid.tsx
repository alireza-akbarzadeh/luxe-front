'use client';
import { motion } from 'framer-motion';

import { stagger } from '~/src/domains/store/store.utils';
import type { DtoStoreResponse } from '~/src/services/-stores-get.schemas';

import { StoreCard } from '../components/store-card';

export function StoresGrid({
  stores,
  dense = false
}: {
  stores: DtoStoreResponse[];
  dense?: boolean;
}) {
  return (
    <motion.div
      variants={stagger}
      initial='hidden'
      animate='show'
      className={
        dense
          ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
          : 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      }
    >
      {stores.map((s) => (
        <StoreCard key={s.id} store={s} />
      ))}
    </motion.div>
  );
}
