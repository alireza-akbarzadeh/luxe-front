import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Typography } from '@/components/ui/typography';
import { ArticleCard } from '@/domains/weblog/components/article-card';
import type { DtoBlogPostListItem } from '@/services/-blog-homepage-get.schemas';

interface BlogSectionRowProps {
  title: string;
  description?: string;
  posts: DtoBlogPostListItem[];
  /** Optional "view all" destination. */
  viewAllHref?: string;
  variant?: 'standard' | 'compact';
  /** Max cards to render (defaults to 4). */
  limit?: number;
}

/** Titled row of article cards for the blog homepage. Renders nothing when empty. */
export function BlogSectionRow({
  title,
  description,
  posts,
  viewAllHref,
  variant = 'standard',
  limit = 4
}: BlogSectionRowProps) {
  if (!posts || posts.length === 0) return null;
  const visible = posts.slice(0, limit);

  return (
    <section className='py-6'>
      <Flex align='end' justify='between' gap={4} className='mb-5'>
        <div>
          <Typography.H2 className='font-display text-2xl md:text-3xl'>{title}</Typography.H2>
          {description ? <Typography.Muted className='mt-1'>{description}</Typography.Muted> : null}
        </div>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className='text-accent hover:text-accent/80 flex shrink-0 items-center gap-1 text-sm font-medium'
          >
            View all
            <IconArrowRight className='size-4' />
          </Link>
        ) : null}
      </Flex>

      <Grid autoFit={variant === 'compact' ? 'md' : 'lg'} gap={5}>
        {visible.map((post) => (
          <ArticleCard key={post.id ?? post.slug} post={post} variant={variant} />
        ))}
      </Grid>
    </section>
  );
}
