import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { Suspense } from 'react';

import { CollectionDetailDomain } from '@/domains/collections/containers/collection-detail.domain';
import { absoluteUrl } from '@/lib/seo/site-url';
import { getCollectionsSlugSlug } from '@/services/-collections-slug-{slug}-get';

type CollectionDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CollectionDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const response = await getCollectionsSlugSlug(slug);
    const collection = response.data;

    if (!collection?.slug || !collection.title) {
      return { title: 'Collection Not Found' };
    }

    const canonicalPath =
      collection.canonical_url || absoluteUrl(`/collections/${collection.slug}`);

    return {
      title: collection.seo_title || collection.hero_title || collection.title,
      description:
        collection.seo_description ||
        collection.hero_description ||
        collection.description ||
        `Explore ${collection.title} on Luxe.`,
      keywords: collection.meta_keywords,
      alternates: {
        canonical: canonicalPath
      },
      openGraph: {
        title: collection.og_title || collection.seo_title || collection.title,
        description:
          collection.og_description || collection.seo_description || collection.description || '',
        url: canonicalPath,
        type: 'website',
        siteName: 'Luxe',
        images:
          collection.og_image_url || collection.desktop_image_url || collection.image_url
            ? [
                {
                  url:
                    collection.og_image_url ||
                    collection.desktop_image_url ||
                    collection.image_url ||
                    '',
                  alt: collection.title
                }
              ]
            : undefined
      },
      twitter: {
        card:
          collection.twitter_image_url || collection.og_image_url || collection.desktop_image_url
            ? 'summary_large_image'
            : 'summary',
        title: collection.twitter_title || collection.og_title || collection.title,
        description:
          collection.twitter_description ||
          collection.og_description ||
          collection.description ||
          '',
        images:
          collection.twitter_image_url || collection.og_image_url || collection.desktop_image_url
            ? [
                collection.twitter_image_url ||
                  collection.og_image_url ||
                  collection.desktop_image_url ||
                  ''
              ]
            : undefined
      },
      robots: {
        index: collection.is_indexable ?? true,
        follow: true
      }
    };
  } catch {
    return { title: 'Collection Not Found' };
  }
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { slug } = await params;
  const response = await getCollectionsSlugSlug(slug).catch(() => null);
  const collection = response?.data;

  if (collection?.slug && collection.slug !== slug) {
    permanentRedirect(`/collections/${collection.slug}`);
  }

  const jsonLd = collection?.slug
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: collection.title,
          description: collection.seo_description || collection.description,
          url: absoluteUrl(`/collections/${collection.slug}`)
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Collections',
              item: absoluteUrl('/collections')
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: collection.title,
              item: absoluteUrl(`/collections/${collection.slug}`)
            }
          ]
        }
      ]
    : [];

  return (
    <Suspense
      fallback={
        <main className='app-container py-10'>
          <div className='bg-muted/40 h-64 animate-pulse rounded-[1.75rem]' />
        </main>
      }
    >
      {jsonLd.length > 0 ? (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <CollectionDetailDomain slug={slug} />
    </Suspense>
  );
}
