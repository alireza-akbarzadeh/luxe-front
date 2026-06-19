import { HOME_HOW_IT_WORKS } from '../lib/home-mock-data';
import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';
import { HomeFadeIn } from './ui/home-fade-in';

export function HowItWorksSection() {
  return (
    <section id='how-it-works' className='bg-secondary/25 py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <HomeFadeIn>
          <SectionHeader
            eyebrow='How it works'
            title='From discovery to doorstep'
            description='A shopping journey designed to feel simple, premium, and trustworthy at every step.'
          />
        </HomeFadeIn>

        <ol className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {HOME_HOW_IT_WORKS.map((step, index) => (
            <HomeFadeIn key={step.step} delay={index * 0.06}>
              <li className='border-border/50 bg-card/60 relative h-full rounded-3xl border p-6 backdrop-blur-sm'>
                <span className='text-gold text-xs font-bold tracking-[0.2em]'>{step.step}</span>
                <div className='bg-gold/10 mt-4 flex size-11 items-center justify-center rounded-2xl text-base font-semibold'>
                  {index + 1}
                </div>
                <h3 className='font-display mt-4 text-lg font-semibold'>{step.title}</h3>
                <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{step.description}</p>
              </li>
            </HomeFadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
