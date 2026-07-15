import Link from 'next/link';

import { type ProductMention, segmentBlogText } from '@/domains/weblog/lib/product-mention-links';
import { cn } from '@/lib/utils';

interface BlogLinkedTextProps {
  text: string;
  mentions: ProductMention[];
  className?: string;
}

/** Renders paragraph/list text with markdown + product-name PDP links. */
export function BlogLinkedText({ text, mentions, className }: BlogLinkedTextProps) {
  const segments = segmentBlogText(text, mentions);

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return <span key={index}>{segment.value}</span>;
        }

        const isInternal = segment.href.startsWith('/');
        if (isInternal) {
          return (
            <Link
              key={index}
              href={segment.href}
              className={cn(
                'text-accent decoration-accent/40 hover:decoration-accent font-medium underline underline-offset-4 transition-colors',
                className
              )}
            >
              {segment.value}
            </Link>
          );
        }

        return (
          <a
            key={index}
            href={segment.href}
            target='_blank'
            rel='noopener noreferrer'
            className={cn(
              'text-accent decoration-accent/40 hover:decoration-accent font-medium underline underline-offset-4 transition-colors',
              className
            )}
          >
            {segment.value}
          </a>
        );
      })}
    </>
  );
}
