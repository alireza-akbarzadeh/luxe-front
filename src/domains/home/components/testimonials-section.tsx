'use client';

import { motion } from 'framer-motion';
import { testimonials } from '@/lib/data';
import Image from 'next/image';
import { IconQuote, IconStar } from '@tabler/icons-react';

export function TestimonialsSection() {
  return (
    <section id='testimonials' className='bg-secondary/50 py-24 lg:py-32'>
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
            Testimonials
          </span>
          <h2 className='mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
            What Our Customers Say
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8'>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className='group'
            >
              <div className='bg-card border-border/50 hover:border-border relative h-full rounded-2xl border p-8 transition-all duration-300 hover:shadow-xl'>
                {/* Quote Icon */}
                <IconQuote className='text-muted-foreground/20 absolute top-6 right-6 h-8 w-8' />

                {/* Rating */}
                <div className='mb-6 flex gap-1'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <IconStar key={i} className='fill-accent text-accent h-4 w-4' />
                  ))}
                </div>

                {/* Content */}
                <p className='text-muted-foreground mb-8 leading-relaxed'>
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className='flex items-center gap-4'>
                  <div className='relative h-12 w-12 overflow-hidden rounded-full'>
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className='object-cover'
                    />
                  </div>
                  <div>
                    <p className='text-sm font-semibold'>{testimonial.name}</p>
                    <p className='text-muted-foreground text-sm'>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
