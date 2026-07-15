import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { BlogCategoryGrid } from '@/domains/weblog/sections/blog-category-grid';
import { BlogHero } from '@/domains/weblog/sections/blog-hero';
import { BlogNewsletterCta } from '@/domains/weblog/sections/blog-newsletter-cta';
import { BlogSectionRow } from '@/domains/weblog/sections/blog-section-row';
import type { DtoBlogHomepageData } from '@/services/-blog-homepage-get.schemas';

interface WeblogDomainProps {
  data: DtoBlogHomepageData;
}

/** Blog homepage — editorial magazine layout composed of curated sections. */
export function WeblogHomeDomain({ data }: WeblogDomainProps) {
  return (
    <div className='app-container py-8'>
      <Flex direction='column' gap={2} className='mb-2'>
        <Typography.Overline>The Luxe Journal</Typography.Overline>
        <Typography.H1 className='font-display text-4xl md:text-5xl'>
          Stories, guides &amp; reviews
        </Typography.H1>
        <Typography.Lead className='max-w-2xl'>
          Expert buying guides, honest product reviews, and the trends shaping premium living.
        </Typography.Lead>
      </Flex>

      <BlogHero featured={data.featured} trending={data.trending ?? []} />

      <BlogSectionRow
        title="Editor's picks"
        description='Hand-selected reads from our editorial team.'
        posts={data.editor_picks ?? []}
      />

      <BlogSectionRow
        title='Buying guides'
        description='Make confident decisions before you buy.'
        posts={data.buying_guides ?? []}
        viewAllHref='/blog/category/buying-guides'
      />

      <BlogSectionRow title='Product reviews' posts={data.product_reviews ?? []} />

      <BlogSectionRow title='Comparisons' posts={data.comparisons ?? []} />

      <BlogCategoryGrid categories={data.categories ?? []} />

      <BlogSectionRow title='Tutorials & how-tos' posts={data.tutorials ?? []} />

      <BlogSectionRow title='Latest articles' posts={data.latest ?? []} limit={8} />

      <BlogSectionRow title='Most popular' posts={data.most_popular ?? []} variant='compact' />

      <BlogSectionRow title='Industry news' posts={data.industry_news ?? []} />

      <BlogSectionRow title='Gift guides' posts={data.gift_guides ?? []} />

      <BlogSectionRow title='Seasonal' posts={data.seasonal ?? []} />

      <BlogSectionRow title='New technology' posts={data.new_technology ?? []} />

      <BlogNewsletterCta source='home' />
    </div>
  );
}
