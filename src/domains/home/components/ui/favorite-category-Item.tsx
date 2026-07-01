'use client';
import { motion } from 'framer-motion';

import { CategoryCard } from '@/domains/home/components/category-card';
import { getHomeCategoryImage } from '@/domains/home/lib/home-utils';
import type { DtoHomeCategoryItem } from '@/services/-home-categories-get.schemas';

export function FavoriteCategoryItem({
  category,
  index,
  shopNowLabel,
  categoryAlt
}: Readonly<{
  category: DtoHomeCategoryItem;
  index: number;
  shopNowLabel: string;
  categoryAlt: string;
}>) {
  return (
    <motion.div
      className='shrink-0'
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <CategoryCard
        variant='compact'
        name={category.name}
        categoryId={category.id}
        image={getHomeCategoryImage(category, index)}
        shopNowLabel={shopNowLabel}
        categoryAlt={categoryAlt}
      />
    </motion.div>
  );
}
