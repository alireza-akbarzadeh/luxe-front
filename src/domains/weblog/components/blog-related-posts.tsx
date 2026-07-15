import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { blogPostPath, formatPublishedDate } from '@/domains/weblog/lib/blog-format';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoBlogPostListItem } from '@/services/-blog-posts-{slug}-get.schemas';

interface BlogRelatedPostsProps {
  posts: DtoBlogPostListItem[];
  className?: string;
}

/** Compact related-stories list for the article sidebar. */
export async function BlogRelatedPosts({ posts, className }: BlogRelatedPostsProps) {
  const t = await getTranslations('weblog.post');
  if (!posts || posts.length === 0) return null;

  return (
    <aside className={cn('bg-card rounded-2xl border p-5 shadow-sm', className)}>
      <Typography.H3 className='font-display mb-4 text-lg'>{t('relatedTitle')}</Typography.H3>
      <Flex direction='column' gap={3}>
        {posts.slice(0, 4).map((post) => {
          const href = blogPostPath(post.slug);
          const image = post.hero_image_url || IMAGE_FALLBACK;
          const date = formatPublishedDate(post.published_at);

          return (
            <Link
              key={post.id ?? post.slug}
              href={href}
              className='group flex gap-3 rounded-xl transition-colors'
            >
              <div className='bg-muted relative size-16 shrink-0 overflow-hidden rounded-xl'>
                <AppImage
                  src={image}
                  alt={post.hero_image_alt || post.title || ''}
                  fill
                  sizes='64px'
                  className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                />
              </div>
              <Flex direction='column' gap={1} justify='center' className='min-w-0 flex-1'>
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
