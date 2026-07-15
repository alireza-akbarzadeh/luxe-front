'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { ArticleCard } from '@/domains/weblog/components/article-card';
import type { DtoBlogPostListItem } from '@/services/-blog-homepage-get.schemas';

interface BlogTrendingCarouselProps {
  posts: DtoBlogPostListItem[];
}

/** Horizontal trending carousel with prev/next controls. */
export function BlogTrendingCarousel({ posts }: BlogTrendingCarouselProps) {
  if (posts.length === 0) return null;

  return (
    <Carousel
      opts={{ align: 'start', loop: false, skipSnaps: false }}
      className='relative w-full px-10'
    >
      <CarouselContent className='-ml-4'>
        {posts.map((post) => (
          <CarouselItem
            key={post.id ?? post.slug}
            className='basis-[11.5rem] pl-4 sm:basis-[13.5rem]'
          >
            <ArticleCard post={post} variant='trending' className='w-full' />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='bg-background border-border absolute top-1/2 left-0 z-10 size-9 -translate-y-1/2 shadow-sm' />
      <CarouselNext className='bg-background border-border absolute top-1/2 right-0 z-10 size-9 -translate-y-1/2 shadow-sm' />
    </Carousel>
  );
}
