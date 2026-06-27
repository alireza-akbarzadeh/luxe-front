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
} from '@/domains/plus/components/plus-landing-primitives';

const FAQ_KEYS = ['billing', 'discount', 'returns', 'cancel', 'payment', 'giftCard'] as const;

export function PlusFaqSection() {
  const t = useTranslations('plus.landing.faq');

  return (
    <LandingContainer id='faq' className='bg-muted/15 py-16 md:py-24'>
      <FadeInView>
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      </FadeInView>

      <FadeInView delay={0.08}>
        <Accordion type='single' collapsible className='mx-auto max-w-3xl'>
          {FAQ_KEYS.map((key) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className='text-base font-medium hover:no-underline'>
                {t(`${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className='text-muted-foreground leading-relaxed'>
                {t(`${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeInView>
    </LandingContainer>
  );
}
