import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { buildBlogMetadata, getBlogPostPageData } from '@/domains/weblog/lib/blog-post-metadata';
import { WeblogPostDomain } from '@/domains/weblog/weblog-post.domain';
import { getQueryClient } from '@/lib/query-client';
import { getGetBlogPostsSlugQueryOptions } from '@/services/-blog-posts-{slug}-get';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const pageData = await getBlogPostPageData(slug);

  if (!pageData?.post) {
    return {
      title: 'Article Not Found'
    };
  }

  return buildBlogMetadata(pageData.post, slug);
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const pageData = await getBlogPostPageData(slug);

  if (!pageData?.post) {
    notFound();
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(getGetBlogPostsSlugQueryOptions(slug));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WeblogPostDomain post={pageData.post} />
    </HydrationBoundary>
  );
}
