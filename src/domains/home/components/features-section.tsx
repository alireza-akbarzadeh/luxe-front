'use client';

import { motion } from 'framer-motion';
import { IconGeometry, IconHeadphones, IconShield, IconTruck } from '@tabler/icons-react';
import { features } from '@/lib/data';

const iconMap = {
  truck: IconTruck,
  gem: IconGeometry,
  shield: IconShield,
  headphones: IconHeadphones
};

export function FeaturesSection() {
  return (
    <section id='features' className='py-24 lg:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-16 text-center'
        >
          <span className='text-accent text-sm font-medium tracking-wider uppercase'>Why Luxe</span>
          <h2 className='mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
            The Luxe Difference
          </h2>
          <p className='text-muted-foreground mx-auto mt-4 max-w-2xl'>
            We go above and beyond to ensure every aspect of your experience is exceptional.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className='group'
              >
                <div className='bg-card border-border/50 hover:border-border h-full rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl'>
                  {/* Icon */}
                  <div className='bg-secondary group-hover:bg-accent group-hover:text-accent-foreground mb-6 flex h-14 w-14 items-center justify-center rounded-xl transition-colors duration-300'>
                    <Icon className='h-6 w-6' />
                  </div>

                  <h3 className='mb-2 text-lg font-semibold'>{feature.title}</h3>
                  <p className='text-muted-foreground text-sm'>{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
