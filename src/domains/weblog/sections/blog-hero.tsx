import { IconFlame } from '@tabler/icons-react';

import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { ArticleCard } from '@/domains/weblog/components/article-card';
import type { DtoBlogPostListItem } from '@/services/-blog-homepage-get.schemas';

interface BlogHeroProps {
  featured?: DtoBlogPostListItem;
  trending: DtoBlogPostListItem[];
}

/** Editorial hero: large featured article beside a compact trending list. */
export function BlogHero({ featured, trending }: BlogHeroProps) {
  if (!featured) return null;

  const trendingList = trending.filter((post) => post.slug !== featured.slug).slice(0, 4);

  return (
    <section className='py-6'>
      <Grid template='1-3' gap={6} className='items-stretch'>
        <div className='lg:col-span-2'>
          <ArticleCard post={featured} variant='feature' priority />
        </div>

        <Flex direction='column' gap={3} className='bg-card rounded-2xl border p-5 shadow-sm'>
          <Flex align='center' gap={2} className='text-accent'>
            <IconFlame className='size-5' />
            <Typography.Overline className='text-accent'>Trending now</Typography.Overline>
          </Flex>

          <Flex direction='column' gap={1}>
            {trendingList.length > 0 ? (
              trendingList.map((post) => (
                <ArticleCard key={post.id ?? post.slug} post={post} variant='list' />
              ))
            ) : (
              <Typography.Muted className='text-sm'>No trending stories yet.</Typography.Muted>
            )}
          </Flex>
        </Flex>
      </Grid>
    </section>
  );
}
