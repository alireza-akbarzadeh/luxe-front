import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  buildBlogHomeMetadata,
  getBlogHomePageData
} from '@/domains/weblog/lib/blog-home-metadata-data';
import { WeblogHomeDomain } from '@/domains/weblog/weblog.domain';
import { getQueryClient } from '@/lib/query-client';
import { getGetBlogHomepageQueryOptions } from '@/services/-blog-homepage-get';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getBlogHomePageData();

  if (!pageData) {
    return {
      title: 'Blog'
    };
  }

  return buildBlogHomeMetadata(pageData.data);
}

export default async function WeblogPage() {
  const pageData = await getBlogHomePageData();
  const queryClient = getQueryClient();

  if (!pageData) {
    notFound();
  }

  await queryClient.prefetchQuery(getGetBlogHomepageQueryOptions({}));

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <WeblogHomeDomain data={pageData.data} />
      </HydrationBoundary>
    </>
  );
}
