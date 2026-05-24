'use client';

import { motion } from 'framer-motion';
import { categories } from '@/lib/data';
import Image from 'next/image';
import { IconArrowRight } from '@tabler/icons-react';

export function CategoriesSection() {
  return (
    <section id='categories' className='bg-secondary/50 py-24 lg:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-16 text-center'
        >
          <span className='text-accent text-sm font-medium tracking-wider uppercase'>
            Browse By Style
          </span>
          <h2 className='mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
            Shop Categories
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='group cursor-pointer'
            >
              <div className='relative h-80 overflow-hidden rounded-2xl lg:h-96'>
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-110'
                />

                {/* Overlay */}
                <div className='from-foreground/80 via-foreground/20 absolute inset-0 bg-gradient-to-t to-transparent' />

                {/* Content */}
                <div className='absolute right-0 bottom-0 left-0 p-6'>
                  <span className='text-primary-foreground/70 text-sm'>
                    {category.productCount} Products
                  </span>
                  <h3 className='text-primary-foreground mt-1 text-xl font-semibold'>
                    {category.name}
                  </h3>
                  <p className='text-primary-foreground/70 mt-1 text-sm'>{category.description}</p>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ x: 5 }}
                    className='text-primary-foreground mt-4 flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-3'
                  >
                    Explore
                    <IconArrowRight className='h-4 w-4' />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
