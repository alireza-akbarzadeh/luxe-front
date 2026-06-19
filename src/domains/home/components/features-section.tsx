'use client';

import {
  IconDiamond,
  IconHeadphones,
  IconShield,
  IconTruck
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { features } from '../lib/home-mock-data';
import { sectionContainerClass } from '../lib/home-utils';
import { SectionHeader } from './section-header';

const iconMap = {
  truck: IconTruck,
  gem: IconDiamond,
  shield: IconShield,
  headphones: IconHeadphones
} as const;

export function FeaturesSection() {
  return (
    <section id='features' className='py-16 sm:py-20 lg:py-28'>
      <div className={sectionContainerClass}>
        <SectionHeader
          eyebrow='Shopping experience'
          title='Why shoppers choose LUXE'
          description='Every touchpoint — from discovery to delivery — is designed to feel premium, transparent, and effortless.'
        />

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5'>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className='group'
              >
                <div className='bg-card border-border/60 hover:border-border h-full rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg sm:rounded-3xl sm:p-8'>
                  <div className='bg-secondary text-accent group-hover:bg-accent group-hover:text-accent-foreground mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300'>
                    <Icon className='h-6 w-6' stroke={1.5} />
                  </div>
                  <h3 className='font-display text-lg font-semibold'>{feature.title}</h3>
                  <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
