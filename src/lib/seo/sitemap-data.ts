import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/seo/site-url';
import { getCategories } from '@/services/-categories-get';
import { getProducts } from '@/services/-products-get';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import { getStores } from '@/services/-stores-get';
import type { DtoStoreResponse } from '@/services/-stores-get.schemas';

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
  { url: absoluteUrl('/shop'), changeFrequency: 'daily', priority: 0.9 },
  { url: absoluteUrl('/products'), changeFrequency: 'daily', priority: 0.9 },
  { url: absoluteUrl('/store'), changeFrequency: 'weekly', priority: 0.8 },
  { url: absoluteUrl('/collections'), changeFrequency: 'weekly', priority: 0.8 },
  { url: absoluteUrl('/search'), changeFrequency: 'weekly', priority: 0.5 },
  { url: absoluteUrl('/contact'), changeFrequency: 'monthly', priority: 0.6 },
  { url: absoluteUrl('/help'), changeFrequency: 'monthly', priority: 0.5 },
  { url: absoluteUrl('/help/faq'), changeFrequency: 'monthly', priority: 0.4 },
  { url: absoluteUrl('/help/shipping'), changeFrequency: 'monthly', priority: 0.4 },
  { url: absoluteUrl('/help/returns'), changeFrequency: 'monthly', priority: 0.4 },
  { url: absoluteUrl('/help/size-guide'), changeFrequency: 'monthly', priority: 0.4 },
  { url: absoluteUrl('/help/order-tracking'), changeFrequency: 'monthly', priority: 0.4 },
  { url: absoluteUrl('/legal/privacy'), changeFrequency: 'yearly', priority: 0.3 },
  { url: absoluteUrl('/legal/terms'), changeFrequency: 'yearly', priority: 0.3 },
  { url: absoluteUrl('/legal/cookies'), changeFrequency: 'yearly', priority: 0.3 },
  { url: absoluteUrl('/legal/accessibility'), changeFrequency: 'yearly', priority: 0.3 },
  { url: absoluteUrl('/gift-cards'), changeFrequency: 'monthly', priority: 0.5 },
  { url: absoluteUrl('/gift-cards/finder'), changeFrequency: 'monthly', priority: 0.5 },
  { url: absoluteUrl('/apps'), changeFrequency: 'monthly', priority: 0.4 }
];

async function fetchAllActiveProducts(): Promise<DtoProductWithLike[]> {
  const items: DtoProductWithLike[] = [];
  const limit = 100;
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const response = await getProducts({ status: 'active', limit, offset });
    const batch = response.data?.products ?? [];
    total = response.data?.total ?? batch.length;
    items.push(...batch);
    if (batch.length === 0) {
      break;
    }
    offset += limit;
  }

  return items;
}

async function fetchAllStores(): Promise<DtoStoreResponse[]> {
  const items: DtoStoreResponse[] = [];
  const limit = 100;
  let offset = 0;
  let total = Number.POSITIVE_INFINITY;

  while (offset < total) {
    const response = await getStores({ limit, offset });
    const batch = response.data?.stores ?? [];
    total = response.data?.total ?? batch.length;
    items.push(...batch);
    if (batch.length === 0) {
      break;
    }
    offset += limit;
  }

  return items;
}

/** Build sitemap entries from API catalog data (server-only). */
export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [...STATIC_ROUTES];

  try {
    const [products, stores, categoriesResponse] = await Promise.all([
      fetchAllActiveProducts(),
      fetchAllStores(),
      getCategories({ is_active: true, limit: 100, offset: 0 })
    ]);

    for (const product of products) {
      if (!product.slug || product.visibility === 'private') {
        continue;
      }

      entries.push({
        url: absoluteUrl(`/product/${product.slug}`),
        lastModified: product.updated_at ? new Date(product.updated_at) : undefined,
        changeFrequency: 'weekly',
        priority: 0.7
      });
    }

    for (const store of stores) {
      if (!store.slug) {
        continue;
      }

      entries.push({
        url: absoluteUrl(`/store/${store.slug}`),
        changeFrequency: 'weekly',
        priority: 0.6
      });
    }

    const categories = categoriesResponse.data?.categories ?? [];
    for (const category of categories) {
      if (!category.slug) {
        continue;
      }

      entries.push({
        url: absoluteUrl(`/shop?category=${encodeURIComponent(category.slug)}`),
        changeFrequency: 'weekly',
        priority: 0.6
      });
    }
  } catch {
    // API may be unavailable during build — static routes still publish.
  }

  return entries;
}
