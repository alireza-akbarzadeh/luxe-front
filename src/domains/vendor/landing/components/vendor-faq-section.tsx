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
import { FAQ_ITEMS } from '@/domains/vendor/landing/data/vendor-landing.data';

export function VendorFaqSection() {
  return (
    <LandingContainer id='faq' className='py-20 md:py-28'>
      <FadeInView>
        <SectionTitle
          eyebrow='FAQ'
          title='Questions sellers ask us'
          description='Everything you need to know before launching on Luxe.'
        />
      </FadeInView>

      <FadeInView delay={0.1}>
        <Accordion type='single' collapsible className='mx-auto max-w-3xl'>
          {FAQ_ITEMS.map((item, index) => (
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
      </FadeInView>
    </LandingContainer>
  );
}
