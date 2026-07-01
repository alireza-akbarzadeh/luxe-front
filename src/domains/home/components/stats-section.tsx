import { getHomeContent } from '../lib/get-home-content';
import { fullBleedClass, sectionContainerClass } from '../lib/home-utils';
import { SectionHeaderStatic } from './section-header-static';
import { AnimatedStat } from './ui/animated-stat';

export async function StatsSection() {
  const { platformStats, locale, t } = await getHomeContent();

  return (
    <section className={`${fullBleedClass} py-16 sm:py-20 lg:py-28`}>
      <div className={sectionContainerClass}>
        <div className='border-border/50 from-gold/5 via-card/50 to-secondary/30 rounded-[2rem] border bg-gradient-to-b px-6 py-14 sm:px-10 sm:py-16'>
          <SectionHeaderStatic
            eyebrow={t('statsSection.eyebrow')}
            title={t('statsSection.title')}
            description={t('statsSection.description')}
            className='mb-10 sm:mb-12'
          />

          <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-3'>
            {platformStats.map((stat, index) => (
              <div key={stat.label} className='luxe-fade' style={{ animationDelay: `${index * 40}ms` }}>
                <AnimatedStat
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  decimals={stat.decimals}
                  locale={locale}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
