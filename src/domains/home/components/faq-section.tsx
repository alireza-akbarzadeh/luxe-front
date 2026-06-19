import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

import { HOME_FAQ } from '../lib/home-mock-data';
import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';
import { HomeFadeIn } from './ui/home-fade-in';

export function FaqSection() {
  return (
    <section id='faq' className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <HomeFadeIn>
          <SectionHeader
            eyebrow='FAQ'
            title='Questions shoppers ask'
            description='Everything you need to know before your first order.'
          />
        </HomeFadeIn>

        <HomeFadeIn delay={0.08}>
          <Accordion type='single' collapsible className='mx-auto max-w-3xl'>
            {HOME_FAQ.map((item, index) => (
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
