import { getTranslations } from 'next-intl/server';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Typography } from '@/components/ui/typography';
import type { FaqItem } from '@/domains/weblog/lib/content-blocks';

interface BlogFaqProps {
  items: FaqItem[];
}

/** FAQ accordion rendered from faq content blocks. */
export async function BlogFaq({ items }: BlogFaqProps) {
  const t = await getTranslations('weblog.post');
  if (items.length === 0) return null;

  return (
    <section className='mt-10'>
      <Typography.H2 className='font-display mb-4 text-2xl'>{t('faqTitle')}</Typography.H2>
      <Accordion
        type='multiple'
        className='border-border/60 divide-border/60 rounded-2xl border px-4'
      >
        {items.map((item, index) => (
          <AccordionItem key={`${item.question}-${index}`} value={`faq-${index}`}>
            <AccordionTrigger className='text-start text-sm font-medium md:text-base'>
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <Typography.P className='text-muted-foreground text-sm leading-relaxed'>
                {item.answer}
              </Typography.P>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
