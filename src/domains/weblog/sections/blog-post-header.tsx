import { IconEye, IconThumbUp } from '@tabler/icons-react';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { ArticleMeta } from '@/domains/weblog/components/article-meta';
import { BlogShareBar } from '@/domains/weblog/components/blog-share-bar';
import { CategoryPill } from '@/domains/weblog/components/category-pill';
import {
  formatPublishedDate,
  formatViews,
  readingTimeLabel
} from '@/domains/weblog/lib/blog-format';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoBlogPostResponse } from '@/services/-blog-posts-{slug}-get.schemas';

interface BlogPostHeaderProps {
  post: DtoBlogPostResponse;
  shareUrl: string;
}

/** Category, title, excerpt, author meta, and hero for an article. */
export function BlogPostHeader({ post, shareUrl }: BlogPostHeaderProps) {
  const date = formatPublishedDate(post.published_at);

  return (
    <header className='mb-8'>
      <Flex align='center' justify='between' gap={4} className='mb-4 flex-wrap'>
        <CategoryPill category={post.category} sectionType={post.section_type} />
        <BlogShareBar title={post.title ?? ''} url={shareUrl} />
      </Flex>

      <Typography.H1 className='font-display mb-4 text-3xl leading-tight md:text-5xl'>
        {post.title}
      </Typography.H1>

      {post.excerpt ? (
        <Typography.Lead className='text-muted-foreground mb-6 max-w-3xl text-base md:text-lg'>
          {post.excerpt}
        </Typography.Lead>
      ) : null}

      <Flex align='center' justify='between' gap={4} className='mb-6 flex-wrap'>
        <ArticleMeta
          author={post.author}
          publishedAt={post.published_at}
          readingTimeMinutes={post.reading_time_minutes}
        />
        <Flex align='center' gap={4} className='text-muted-foreground text-sm'>
          {date ? <span className='hidden sm:inline'>{date}</span> : null}
          <span>{readingTimeLabel(post.reading_time_minutes)}</span>
          <span className='inline-flex items-center gap-1'>
            <IconEye className='size-4' />
            {formatViews(post.view_count)}
          </span>
          {post.helpful_votes ? (
            <span className='inline-flex items-center gap-1'>
              <IconThumbUp className='size-4' />
              {post.helpful_votes.toLocaleString()}
            </span>
          ) : null}
        </Flex>
      </Flex>

      {post.hero_image_url ? (
        <div className='bg-muted relative aspect-16/10 overflow-hidden rounded-2xl md:aspect-[21/9]'>
          <AppImage
            src={post.hero_image_url || IMAGE_FALLBACK}
            alt={post.hero_image_alt || post.title || ''}
            fill
            priority
            sizes='(min-width: 1024px) 70vw, 100vw'
            className='object-cover'
          />
        </div>
      ) : null}
    </header>
  );
}
