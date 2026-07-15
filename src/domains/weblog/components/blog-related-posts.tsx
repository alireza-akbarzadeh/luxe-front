import { getTranslations } from 'next-intl/server';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { ArticleCard } from '@/domains/weblog/components/article-card';
import { cn } from '@/lib/utils';
import type { DtoBlogPostListItem } from '@/services/-blog-posts-{slug}-get.schemas';

interface BlogRelatedPostsProps {
  posts: DtoBlogPostListItem[];
  className?: string;
}

/** Related stories list for the article sidebar. */
export async function BlogRelatedPosts({ posts, className }: BlogRelatedPostsProps) {
  const t = await getTranslations('weblog.post');
  if (!posts || posts.length === 0) return null;

  return (
    <aside className={cn('bg-card rounded-2xl border p-5 shadow-sm', className)}>
      <Typography.H3 className='font-display mb-4 text-lg'>{t('relatedTitle')}</Typography.H3>
      <Flex direction='column' gap={1}>
        {posts.slice(0, 4).map((post) => (
          <ArticleCard key={post.id ?? post.slug} post={post} variant='list' />
        ))}
      </Flex>
    </aside>
  );
}
