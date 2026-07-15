import { getTranslations } from 'next-intl/server';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { BlogCategoryGrid } from '@/domains/weblog/sections/blog-category-grid';
import { BlogHero, BlogTrendingRow } from '@/domains/weblog/sections/blog-hero';
import { BlogNewsletterCta } from '@/domains/weblog/sections/blog-newsletter-cta';
import { BlogPopularList } from '@/domains/weblog/sections/blog-popular-list';
import { BlogSectionRow } from '@/domains/weblog/sections/blog-section-row';
import type { DtoBlogHomepageData } from '@/services/-blog-homepage-get.schemas';

interface WeblogDomainProps {
  data: DtoBlogHomepageData;
}

/** Blog homepage — main magazine column + sticky sidebar. */
export async function WeblogHomeDomain({ data }: WeblogDomainProps) {
  const t = await getTranslations('weblog.home');

  return (
    <div className='app-container py-8'>
      <Flex direction='column' gap={2} className='mb-8'>
        <Typography.H1 className='font-display text-3xl md:text-5xl'>{t('title')}</Typography.H1>
        <Typography.Lead className='text-muted-foreground max-w-2xl text-base md:text-lg'>
          {t('subtitle')}
        </Typography.Lead>
      </Flex>

      <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]'>
        <Flex direction='column' gap={8} className='min-w-0'>
          <BlogHero featured={data.featured} />

          <BlogTrendingRow posts={data.trending ?? []} excludeSlug={data.featured?.slug} />

          <BlogSectionRow
            title={t('editorsPicks')}
            description={t('editorsPicksDescription')}
            posts={data.editor_picks ?? []}
          />

          <BlogCategoryGrid categories={data.categories ?? []} />

          <BlogSectionRow title={t('latest')} posts={data.latest ?? []} limit={8} variant='list' />

          <BlogSectionRow
            title={t('buyingGuides')}
            description={t('buyingGuidesDescription')}
            posts={data.buying_guides ?? []}
            viewAllHref='/weblog/category/buying-guides'
          />

          <BlogSectionRow title={t('productReviews')} posts={data.product_reviews ?? []} />

          <BlogSectionRow title={t('comparisons')} posts={data.comparisons ?? []} />
        </Flex>

        <aside className='hidden lg:block'>
          <div className='sticky top-24 flex flex-col gap-6'>
            <BlogNewsletterCta source='home' variant='compact' />
            <BlogPopularList posts={data.most_popular ?? []} />
          </div>
        </aside>
      </div>

      <div className='mt-10 space-y-2 lg:hidden'>
        <BlogPopularList posts={data.most_popular ?? []} />
        <BlogNewsletterCta source='home' variant='band' />
      </div>
    </div>
  );
}
