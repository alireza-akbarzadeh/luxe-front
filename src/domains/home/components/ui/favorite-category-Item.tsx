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
    <CategoryCard
      variant='compact'
      name={category.name}
      categoryId={category.id}
      image={getHomeCategoryImage(category, index)}
      shopNowLabel={shopNowLabel}
      categoryAlt={categoryAlt}
      animationIndex={index}
    />
  );
}
