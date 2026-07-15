import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { blogCategoryPath } from '@/domains/weblog/lib/blog-format';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoBlogCategoryResponse } from '@/services/-blog-homepage-get.schemas';

interface BlogCategoryGridProps {
  categories: DtoBlogCategoryResponse[];
}

/** Featured categories as image tiles linking to their landing pages. */
export function BlogCategoryGrid({ categories }: BlogCategoryGridProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className='py-6'>
      <Typography.H2 className='font-display mb-5 text-2xl md:text-3xl'>
        Browse by topic
      </Typography.H2>

      <Grid autoFit='md' gap={4}>
        {categories.map((category) => (
          <Link
            key={category.id ?? category.slug}
            href={blogCategoryPath(category.slug)}
            className='group relative aspect-[16/9] overflow-hidden rounded-2xl border shadow-sm'
          >
            <AppImage
              src={category.image_url || IMAGE_FALLBACK}
              alt={category.name ?? 'Category'}
              fill
              sizes='(min-width: 768px) 25vw, 50vw'
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />
            <div className='absolute inset-x-0 bottom-0 p-4'>
              <Typography.Large className='text-white'>{category.name}</Typography.Large>
              {category.post_count ? (
                <Typography.S className='block text-xs text-white/80'>
                  {category.post_count} article{category.post_count === 1 ? '' : 's'}
                </Typography.S>
              ) : null}
            </div>
          </Link>
        ))}
      </Grid>
    </section>
  );
}
