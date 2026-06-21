'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

import { useHomeContent } from '../hooks/use-home-content';
import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';
import { HomeFadeIn } from './ui/home-fade-in';

export function FaqSection() {
  const { faqItems, t } = useHomeContent();

  return (
    <section id='faq' className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <HomeFadeIn>
          <SectionHeader
            eyebrow={t('faq.eyebrow')}
            title={t('faq.title')}
            description={t('faq.description')}
          />
        </HomeFadeIn>

        <HomeFadeIn delay={0.08}>
          <Accordion type='single' collapsible className='mx-auto max-w-3xl'>
            {faqItems.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`}>
                <AccordionTrigger className='text-base font-medium hover:no-underline'>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground leading-relaxed'>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </HomeFadeIn>
      </div>
    </section>
  );
}
