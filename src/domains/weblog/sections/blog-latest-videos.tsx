import { IconPlayerPlayFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import {
  blogPostPath,
  formatPublishedDate,
  formatVideoDuration
} from '@/domains/weblog/lib/blog-format';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoBlogPostListItem } from '@/services/-blog-homepage-get.schemas';

interface BlogLatestVideosProps {
  posts: DtoBlogPostListItem[];
  className?: string;
}

/** Sidebar “Latest Videos” list — thumbnail, duration badge, title, date. */
export async function BlogLatestVideos({ posts, className }: BlogLatestVideosProps) {
  const t = await getTranslations('weblog.home');
  if (!posts || posts.length === 0) return null;

  const visible = posts.slice(0, 5);

  return (
    <aside className={cn('bg-card rounded-2xl border p-5 shadow-sm', className)}>
      <Flex align='center' gap={2} className='mb-4'>
        <IconPlayerPlayFilled className='text-primary size-4 shrink-0' aria-hidden />
        <Typography.H3 className='font-display text-lg'>{t('latestVideosTitle')}</Typography.H3>
      </Flex>

      <Flex direction='column' gap={3}>
        {visible.map((post) => {
          const href = blogPostPath(post.slug);
          const image = post.hero_image_url || IMAGE_FALLBACK;
          const date = formatPublishedDate(post.published_at);
          const duration = formatVideoDuration(post.reading_time_minutes, post.id);

          return (
            <Link
              key={post.id ?? post.slug}
              href={href}
              className='group flex gap-3 rounded-xl transition-colors'
            >
              <div className='bg-muted relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg sm:w-28'>
                <AppImage
                  src={image}
                  alt={post.hero_image_alt || post.title || ''}
                  fill
                  sizes='112px'
                  className='object-cover'
                />
                <span className='absolute end-1 bottom-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-medium text-white tabular-nums'>
                  {duration}
                </span>
              </div>
              <Flex direction='column' gap={1} className='min-w-0 flex-1 justify-center'>
                <Typography.S className='line-clamp-2 text-sm leading-snug font-semibold group-hover:underline'>
                  {post.title}
                </Typography.S>
                {date ? <Typography.Muted className='text-xs'>{date}</Typography.Muted> : null}
              </Flex>
            </Link>
          );
        })}
      </Flex>

      <Link
        href='/weblog?section=tutorial'
        className='text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline'
      >
        {t('viewAllVideos')}
        <span aria-hidden>→</span>
      </Link>
    </aside>
  );
}
