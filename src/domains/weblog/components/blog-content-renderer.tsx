import { IconCheck, IconExternalLink } from '@tabler/icons-react';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import type { BlogBlock } from '@/domains/weblog/lib/content-blocks';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';

interface BlogContentRendererProps {
  blocks: BlogBlock[];
  className?: string;
}

/** Renders typed blog content blocks into article body markup. */
export function BlogContentRenderer({ blocks, className }: BlogContentRendererProps) {
  if (blocks.length === 0) return null;

  return (
    <div className={cn('prose-blog flex flex-col gap-6', className)}>
      {blocks.map((block, index) => (
        <BlogBlockView key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}

function BlogBlockView({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <Typography.P className='text-foreground/90 text-base leading-relaxed md:text-[1.05rem]'>
          {block.text}
        </Typography.P>
      );
    case 'heading': {
      const Heading =
        block.level === 4 ? Typography.H4 : block.level === 3 ? Typography.H3 : Typography.H2;
      return (
        <Heading id={block.id} className='font-display scroll-mt-28 text-2xl md:text-3xl'>
          {block.text}
        </Heading>
      );
    }
    case 'image':
      return (
        <figure className='my-2'>
          <div className='bg-muted relative aspect-video overflow-hidden rounded-2xl'>
            <AppImage
              src={block.url || IMAGE_FALLBACK}
              alt={block.alt}
              fill
              sizes='(min-width: 1024px) 66vw, 100vw'
              className='object-cover'
            />
          </div>
          {block.caption ? (
            <figcaption className='text-muted-foreground mt-2 text-center text-sm'>
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case 'gallery':
      return (
        <div className='grid gap-3 sm:grid-cols-2'>
          {block.images.map((image, i) => (
            <figure key={`${image.url}-${i}`} className='overflow-hidden rounded-xl'>
              <div className='bg-muted relative aspect-4/3'>
                <AppImage
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes='(min-width: 640px) 33vw, 100vw'
                  className='object-cover'
                />
              </div>
              {image.caption ? (
                <figcaption className='text-muted-foreground mt-1.5 text-xs'>
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      );
    case 'quote':
      return (
        <blockquote className='border-accent/40 bg-muted/40 rounded-2xl border-s-4 px-5 py-4'>
          <Typography.P className='font-display text-lg leading-relaxed italic md:text-xl'>
            {block.text}
          </Typography.P>
          {block.cite ? (
            <Typography.Muted className='mt-2 text-sm'>— {block.cite}</Typography.Muted>
          ) : null}
        </blockquote>
      );
    case 'list':
      if (block.style === 'ordered') {
        return (
          <ol className='flex list-decimal flex-col gap-2 ps-5'>
            {block.items.map((item, i) => (
              <li key={i} className='text-foreground/90 leading-relaxed'>
                {item.text}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <ul className='flex flex-col gap-2.5'>
          {block.items.map((item, i) => (
            <li key={i} className='flex items-start gap-2.5'>
              <IconCheck className='text-accent mt-1 size-4 shrink-0' />
              <span className='text-foreground/90 leading-relaxed'>{item.text}</span>
            </li>
          ))}
        </ul>
      );
    case 'code':
      return (
        <pre className='bg-muted overflow-x-auto rounded-2xl border p-4 text-sm'>
          <code>{block.code}</code>
        </pre>
      );
    case 'callout': {
      const toneClass =
        block.tone === 'warning'
          ? 'border-amber-500/30 bg-amber-500/10'
          : block.tone === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/10'
            : block.tone === 'tip'
              ? 'border-accent/30 bg-accent/10'
              : 'border-border bg-muted/50';
      return (
        <aside className={cn('rounded-2xl border p-5', toneClass)}>
          {block.title ? (
            <Typography.S className='mb-1 font-semibold'>{block.title}</Typography.S>
          ) : null}
          <Typography.P className='text-sm leading-relaxed'>{block.text}</Typography.P>
        </aside>
      );
    }
    case 'divider':
      return <hr className='border-border/60 my-2' />;
    case 'embed':
      return (
        <div className='overflow-hidden rounded-2xl border'>
          <div className='bg-muted aspect-video'>
            <iframe
              src={block.url}
              title={block.title || 'Embedded media'}
              className='h-full w-full'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </div>
        </div>
      );
    case 'product':
      return <Typography.Muted className='text-sm'>Product #{block.productId}</Typography.Muted>;
    case 'faq':
      return null;
    case 'pros_cons':
    case 'verdict':
      return null;
    case 'table':
      return (
        <div className='overflow-x-auto rounded-2xl border'>
          <table className='w-full min-w-[28rem] text-sm'>
            {block.headers.length > 0 ? (
              <thead className='bg-muted/60'>
                <tr>
                  {block.headers.map((header) => (
                    <th key={header} className='px-4 py-3 text-start font-semibold'>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className='border-t'>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className='px-4 py-3'>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'cta':
      return (
        <Flex justify='start'>
          <Button asChild>
            <Link href={block.href} className='gap-2'>
              {block.label}
              <IconExternalLink className='size-4' />
            </Link>
          </Button>
        </Flex>
      );
    default:
      return null;
  }
}
