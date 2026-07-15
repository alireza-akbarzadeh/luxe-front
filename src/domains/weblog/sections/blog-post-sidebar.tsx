import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { BlogProsCons } from '@/domains/weblog/components/blog-pros-cons';
import { BlogRelatedPosts } from '@/domains/weblog/components/blog-related-posts';
import { BlogReviewSummary } from '@/domains/weblog/components/blog-review-summary';
import type { ProsConsBlock, VerdictBlock } from '@/domains/weblog/lib/content-blocks';
import { BlogNewsletterCta } from '@/domains/weblog/sections/blog-newsletter-cta';
import { IMAGE_FALLBACK } from '@/lib/images';
import type {
  DtoBlogPostListItem,
  DtoBlogPostProductItem
} from '@/services/-blog-posts-{slug}-get.schemas';

interface BlogPostSidebarProps {
  verdict: VerdictBlock | null;
  prosCons: ProsConsBlock | null;
  relatedPosts: DtoBlogPostListItem[];
  products?: DtoBlogPostProductItem[];
}

/** Sticky desktop sidebar matching the blog detail mockup. */
export async function BlogPostSidebar({
  verdict,
  prosCons,
  relatedPosts,
  products
}: BlogPostSidebarProps) {
  const t = await getTranslations('weblog.post');
  const linkedProducts = (products ?? []).filter((item) => item.product?.id);

  return (
    <aside className='hidden lg:block'>
      <div className='sticky top-24 flex flex-col gap-6'>
        {verdict ? <BlogReviewSummary verdict={verdict} /> : null}
        {prosCons ? <BlogProsCons block={prosCons} /> : null}

        {linkedProducts.length > 0 ? (
          <div className='bg-card rounded-2xl border p-5 shadow-sm'>
            <Typography.H3 className='font-display mb-4 text-lg'>
              {t('productsTitle')}
            </Typography.H3>
            <Flex direction='column' gap={3}>
              {linkedProducts.slice(0, 4).map((item) => {
                const product = item.product!;
                const href = getProductPath(product);
                const image = product.images?.[0] || IMAGE_FALLBACK;
                return (
                  <Link
                    key={item.id ?? product.id}
                    href={href}
                    className='group flex gap-3 rounded-xl'
                  >
                    <div className='bg-muted relative size-14 shrink-0 overflow-hidden rounded-lg'>
                      <AppImage
                        src={image}
                        alt={product.name ?? ''}
                        fill
                        sizes='56px'
                        className='object-cover'
                      />
                    </div>
                    <Flex direction='column' justify='center' className='min-w-0'>
                      <Typography.S className='line-clamp-2 text-sm font-medium group-hover:underline'>
                        {product.name}
                      </Typography.S>
                    </Flex>
                  </Link>
                );
              })}
            </Flex>
          </div>
        ) : null}

        <BlogRelatedPosts posts={relatedPosts} />
        <BlogNewsletterCta source='footer' variant='compact' />
      </div>
    </aside>
  );
}
