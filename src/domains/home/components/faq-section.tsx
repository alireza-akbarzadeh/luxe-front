import { getTranslations } from 'next-intl/server';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';

const FAQ_KEYS = ['different', 'shipping', 'returns', 'payments', 'sell'] as const;

// Variables needed for placeholders in translations
const getTranslationVariables = (key: string) => {
  switch (key) {
    case 'shipping':
      return { amount: 100 }; // Free delivery threshold in USD
    case 'returns':
      return { days: 30 }; // Return window in days
    default:
      return {};
  }
};

export async function FaqSection() {
  const t = await getTranslations('home.faq');

  return (
    <section id='faq' className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <div className='luxe-rise'>
          <SectionHeader eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
        </div>

        <div className='luxe-rise luxe-delay-1'>
          <Accordion type='single' collapsible className='mx-auto max-w-3xl'>
            {FAQ_KEYS.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className='text-base font-medium hover:no-underline'>
                  {t(`items.${key}.question`)}
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground leading-relaxed'>
                  {t(
                    `items.${key}.answer`,
                    getTranslationVariables(key) as Record<string, string | number>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
