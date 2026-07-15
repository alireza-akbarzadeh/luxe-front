import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Typography } from '@/components/ui/typography';
import type { HeadingBlock } from '@/domains/weblog/lib/content-blocks';

interface BlogTocProps {
  headings: HeadingBlock[];
}

/** Table of contents from article heading blocks. */
export async function BlogToc({ headings }: BlogTocProps) {
  const t = await getTranslations('weblog.post');
  if (headings.length === 0) return null;

  const list = (
    <ul className='flex flex-col gap-1.5'>
      {headings.map((heading) => (
        <li key={heading.id}>
          <Link
            href={`#${heading.id}`}
            className='text-muted-foreground hover:text-foreground text-sm transition-colors'
          >
            {heading.text}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className='bg-muted/40 mb-6 hidden rounded-2xl border p-5 lg:block'>
        <Typography.S className='mb-3 font-semibold'>{t('tocTitle')}</Typography.S>
        {list}
      </div>

      <Accordion type='single' collapsible className='mb-6 rounded-2xl border px-4 lg:hidden'>
        <AccordionItem value='toc' className='border-0'>
          <AccordionTrigger className='py-3 text-sm font-semibold'>
            {t('tocTitle')}
          </AccordionTrigger>
          <AccordionContent className='pb-4'>{list}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
