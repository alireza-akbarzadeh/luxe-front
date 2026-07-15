import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { blogPostPath, formatPublishedDate } from '@/domains/weblog/lib/blog-format';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoBlogPostListItem } from '@/services/-blog-homepage-get.schemas';

interface BlogPopularListProps {
  posts: DtoBlogPostListItem[];
  className?: string;
}

/** Numbered popular-posts list for the blog sidebar. */
export async function BlogPopularList({ posts, className }: BlogPopularListProps) {
  const t = await getTranslations('weblog.home');
  if (!posts || posts.length === 0) return null;

  const visible = posts.slice(0, 5);

  return (
    <aside className={cn('bg-card rounded-2xl border p-5 shadow-sm', className)}>
      <Typography.H3 className='font-display mb-4 text-lg'>{t('popularTitle')}</Typography.H3>
      <Flex direction='column' gap={3}>
        {visible.map((post, index) => {
          const href = blogPostPath(post.slug);
          const image = post.hero_image_url || IMAGE_FALLBACK;
          const date = formatPublishedDate(post.published_at);
          const rank = String(index + 1).padStart(2, '0');

          return (
            <Link
              key={post.id ?? post.slug}
              href={href}
              className='group flex gap-3 rounded-xl transition-colors'
            >
              <span className='text-muted-foreground/50 w-7 shrink-0 pt-1 text-sm font-semibold tabular-nums'>
                {rank}
              </span>
              <div className='bg-muted relative size-14 shrink-0 overflow-hidden rounded-lg'>
                <AppImage
                  src={image}
                  alt={post.hero_image_alt || post.title || ''}
                  fill
                  sizes='56px'
                  className='object-cover'
                />
              </div>
              <Flex direction='column' gap={1} className='min-w-0 flex-1'>
                <Typography.S className='line-clamp-2 text-sm leading-snug font-semibold group-hover:underline'>
                  {post.title}
                </Typography.S>
                {date ? <Typography.Muted className='text-xs'>{date}</Typography.Muted> : null}
              </Flex>
            </Link>
          );
        })}
      </Flex>
    </aside>
  );
}
