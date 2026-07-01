import { getHomeContent } from '../lib/get-home-content';
import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeaderStatic } from './section-header-static';

export async function HowItWorksSection() {
  const { howItWorks, t } = await getHomeContent();

  return (
    <section id='how-it-works' className='bg-secondary/25 py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <SectionHeaderStatic
          eyebrow={t('howItWorks.eyebrow')}
          title={t('howItWorks.title')}
          description={t('howItWorks.description')}
        />

        <ol className='grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {howItWorks.map((step, index) => (
            <li key={step.step} className='luxe-fade list-none' style={{ animationDelay: `${index * 60}ms` }}>
              <div className='border-border/50 bg-card/60 relative h-full rounded-3xl border p-6 backdrop-blur-sm'>
                <span className='text-gold text-xs font-bold tracking-[0.2em]'>{step.step}</span>

                <div className='bg-gold/10 mt-4 flex size-11 items-center justify-center rounded-2xl text-base font-semibold'>
                  {index + 1}
                </div>

                <h3 className='font-display mt-4 text-lg font-semibold'>{step.title}</h3>

                <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
