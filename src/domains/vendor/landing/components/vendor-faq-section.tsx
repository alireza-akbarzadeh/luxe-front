'use client';

import { useTranslations } from 'next-intl';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  FadeInView,
  LandingContainer,
  SectionTitle
} from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { useVendorLandingContent } from '@/domains/vendor/landing/hooks/use-vendor-landing-content';

export function VendorFaqSection() {
  const t = useTranslations('vendor.landing.faq');
  const { faqItems } = useVendorLandingContent();

  return (
    <LandingContainer id='faq' className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('subtitle')} />
      </FadeInView>

      <FadeInView delay={0.1}>
        <Accordion type='single' collapsible className='mx-auto max-w-3xl'>
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className='text-base font-medium hover:no-underline'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='text-muted-foreground leading-relaxed'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeInView>
    </LandingContainer>
  );
}
