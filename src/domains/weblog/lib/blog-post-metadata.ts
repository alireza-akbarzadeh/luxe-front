import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { cache } from 'react';

import { getBlogPostsSlug } from '@/services/-blog-posts-{slug}-get';
import type { GetBlogPostsSlug200 } from '@/services/-blog-posts-{slug}-get.schemas';

export interface BlogPostPagePayload {
  post: GetBlogPostsSlug200['data'];
}

export const getBlogPostPageData = cache(
  async (slug: string): Promise<BlogPostPagePayload | null> => {
    const cookieStore = await cookies();

    try {
      const response = await getBlogPostsSlug(slug, {
        headers: {
          Cookie: cookieStore.toString()
        }
      });

      if (!response.data) {
        return null;
      }

      return {
        post: response.data
      };
    } catch {
      return null;
    }
  }
);

export function buildBlogMetadata(
  post: NonNullable<BlogPostPagePayload['post']>,
  slug: string
): Metadata {
  const title = post.meta_title?.trim() || post.title;

  const description =
    post.meta_description?.trim() || post.excerpt?.trim() || 'Read this article on Luxe.';

  const image = post.hero_image_url;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${slug}`
    },
    openGraph: {
      title,
      description,
      url: `/blog/${slug}`,
      type: 'article',
      siteName: 'Luxe',
      publishedTime: post.published_at,
      modifiedTime: post.content_updated_at,
      authors: post.author ? [post.author.name ?? ''] : undefined,
      images: image
        ? [
            {
              url: image,
              alt: title
            }
          ]
        : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined
    }
  };
}
