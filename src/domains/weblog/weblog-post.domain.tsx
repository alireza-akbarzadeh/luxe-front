import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { BlogBreadcrumbs } from '@/domains/weblog/components/blog-breadcrumbs';
import { BlogContentRenderer } from '@/domains/weblog/components/blog-content-renderer';
import { BlogEngagementBar } from '@/domains/weblog/components/blog-engagement-bar';
import { BlogFaq } from '@/domains/weblog/components/blog-faq';
import { BlogToc } from '@/domains/weblog/components/blog-toc';
import { BlogVerdict } from '@/domains/weblog/components/blog-verdict';
import { blogCategoryPath, blogPostPath } from '@/domains/weblog/lib/blog-format';
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd
} from '@/domains/weblog/lib/blog-jsonld';
import {
  extractFaqs,
  extractHeadings,
  extractProsCons,
  extractVerdict,
  parseBlocks
} from '@/domains/weblog/lib/content-blocks';
import { BlogPostHeader } from '@/domains/weblog/sections/blog-post-header';
import { BlogPostSidebar } from '@/domains/weblog/sections/blog-post-sidebar';
import { absoluteUrl } from '@/lib/seo/site-url';
import type { DtoBlogPostResponse } from '@/services/-blog-posts-{slug}-get.schemas';

interface WeblogPostDomainProps {
  post: DtoBlogPostResponse;
}

/** Full article reader — header, body blocks, FAQ, sidebar, engagement. */
export async function WeblogPostDomain({ post }: WeblogPostDomainProps) {
  const t = await getTranslations('weblog.post');
  const blocks = parseBlocks(post.content_blocks);
  const headings = extractHeadings(blocks);
  const faqs = extractFaqs(blocks);
  const verdict = extractVerdict(blocks);
  const prosCons = extractProsCons(blocks);
  const sharePath = blogPostPath(post.slug);
  const shareUrl = absoluteUrl(sharePath);

  const bodyBlocks = blocks.filter((block) => {
    if (block.type === 'faq' || block.type === 'pros_cons' || block.type === 'verdict') {
      return false;
    }
    if (
      block.type === 'callout' &&
      verdict &&
      (block.title?.toLowerCase().includes('verdict') || block.tone === 'success')
    ) {
      return false;
    }
    return true;
  });

  const articleJsonLd = buildArticleJsonLd(post);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/weblog' },
    ...(post.category?.slug
      ? [{ name: post.category.name ?? '', path: blogCategoryPath(post.category.slug) }]
      : []),
    { name: post.title ?? '', path: sharePath }
  ]);
  const faqJsonLd = buildFaqJsonLd(faqs);

  return (
    <article className='app-container py-6 pb-24 lg:pb-10'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <div className='mb-6'>
        <BlogBreadcrumbs category={post.category} title={post.title} />
      </div>

      <div className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]'>
        <div className='min-w-0'>
          <BlogPostHeader post={post} shareUrl={shareUrl} />

          {verdict ? (
            <div className='mb-8 lg:hidden'>
              <BlogVerdict verdict={verdict} />
            </div>
          ) : null}

          <BlogToc headings={headings} />

          <BlogContentRenderer blocks={bodyBlocks} />

          <BlogFaq items={faqs} />

          {post.tags && post.tags.length > 0 ? (
            <Flex align='center' gap={2} className='mt-10 flex-wrap'>
              <Typography.Muted className='text-sm'>{t('tags')}</Typography.Muted>
              {post.tags.map((tag) => (
                <Link
                  key={tag.id ?? tag.slug}
                  href={`/weblog?tag=${tag.slug ?? ''}`}
                  className='bg-muted hover:bg-muted/80 rounded-full px-3 py-1 text-xs font-medium transition-colors'
                >
                  {tag.name}
                </Link>
              ))}
            </Flex>
          ) : null}

          <div className='mt-10 hidden lg:block'>
            <BlogEngagementBar
              slug={post.slug ?? ''}
              title={post.title ?? ''}
              url={shareUrl}
              helpfulVotes={post.helpful_votes}
              variant='inline'
            />
          </div>
        </div>

        <BlogPostSidebar
          verdict={verdict}
          prosCons={prosCons}
          relatedPosts={post.related_posts ?? []}
          products={post.products}
        />
      </div>

      <BlogEngagementBar
        slug={post.slug ?? ''}
        title={post.title ?? ''}
        url={shareUrl}
        helpfulVotes={post.helpful_votes}
        variant='sticky'
      />
    </article>
  );
}
