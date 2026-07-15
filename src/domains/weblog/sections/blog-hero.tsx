import { IconBolt } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { ArticleCard } from '@/domains/weblog/components/article-card';
import { BlogTrendingCarousel } from '@/domains/weblog/sections/blog-trending-carousel';
import type { DtoBlogPostListItem } from '@/services/-blog-homepage-get.schemas';

interface BlogHeroProps {
  featured?: DtoBlogPostListItem;
}

/** Large featured article hero for the blog homepage. */
export async function BlogHero({ featured }: BlogHeroProps) {
  const t = await getTranslations('weblog.home');
  if (!featured) {
    return (
      <section className='bg-muted/40 rounded-2xl border border-dashed px-6 py-16 text-center'>
        <Typography.Muted>{t('emptyFeatured')}</Typography.Muted>
      </section>
    );
  }

  return (
    <section>
      <ArticleCard post={featured} variant='feature' priority />
    </section>
  );
}

interface BlogTrendingRowProps {
  posts: DtoBlogPostListItem[];
  excludeSlug?: string;
}

/** Horizontal trending carousel under the featured hero. */
export async function BlogTrendingRow({ posts, excludeSlug }: BlogTrendingRowProps) {
  const t = await getTranslations('weblog.home');
  const trending = posts.filter((post) => post.slug !== excludeSlug).slice(0, 8);
  if (trending.length === 0) return null;

  return (
    <section className='py-2'>
      <Flex align='center' gap={2} className='mb-4'>
        <IconBolt className='text-primary size-5 shrink-0' aria-hidden />
        <Typography.H2 className='font-display text-xl sm:text-2xl'>
          {t('trendingTitle')}
        </Typography.H2>
      </Flex>
      <BlogTrendingCarousel posts={trending} />
    </section>
  );
}
