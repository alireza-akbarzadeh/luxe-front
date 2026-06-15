import type { DtoProductWithLike } from '@/services/-products-get.schemas';

interface ProductJsonLdProps {
  product: DtoProductWithLike;
  slug: string;
}

/** Product structured data for search engines. */
export function ProductJsonLd({ product, slug }: ProductJsonLdProps) {
  const inStock = Number(product.stock ?? 0) > 0;
  const price = product.price != null ? String(product.price) : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images?.length ? product.images : undefined,
    url: `/product/${slug}`,
    ...(product.brand?.name
      ? {
          brand: {
            '@type': 'Brand',
            name: product.brand.name
          }
        }
      : {}),
    ...(product.rating && product.reviews_count
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviews_count
          }
        }
      : {}),
    ...(price
      ? {
          offers: {
            '@type': 'Offer',
            price,
            priceCurrency: 'USD',
            availability: inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: `/product/${slug}`
          }
        }
      : {})
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
