'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube
} from '@tabler/icons-react';
import { cn } from '../lib/utils';
import { APP_CONFIG } from '../lib/config';

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '#' },
    { name: 'Best Sellers', href: '#' },
    { name: 'Sale', href: '#' },
    { name: 'Gift Cards', href: '#' }
  ],
  help: [
    { name: 'FAQ', href: '#' },
    { name: 'Shipping', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Contact', href: '#' }
  ],
  about: [
    { name: 'Our Story', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' }
  ]
};

const socialLinks = [
  { name: 'Instagram', icon: IconBrandInstagram, href: '#' },
  { name: 'Twitter', icon: IconBrandTwitter, href: '#' },
  { name: 'Facebook', icon: IconBrandFacebook, href: '#' },
  { name: 'Youtube', icon: IconBrandYoutube, href: '#' }
];

export function Footer() {
  return (
    <footer className='border-border/50 border-t'>
      <div
        className={cn('px-4 py-16 sm:px-6 lg:px-8 lg:py-20', APP_CONFIG.CONTAINER_SPACING_PADDING)}
      >
        <div className='grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8'>
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='lg:col-span-2'
          >
            <Link href='/' className='inline-block'>
              <span className='text-2xl font-bold tracking-tight'>LUXE</span>
            </Link>
            <p className='text-muted-foreground mt-4 max-w-sm leading-relaxed'>
              Curating premium products for those who appreciate timeless design and exceptional
              quality.
            </p>

            {/* Social Links */}
            <div className='mt-6 flex items-center gap-4'>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className='bg-secondary hover:bg-accent hover:text-accent-foreground rounded-full p-2 transition-colors'
                >
                  <social.icon className='h-5 w-5' />
                  <span className='sr-only'>{social.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className='mb-4 font-semibold'>Shop</h3>
            <ul className='space-y-3'>
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className='mb-4 font-semibold'>Help</h3>
            <ul className='space-y-3'>
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className='mb-4 font-semibold'>About</h3>
            <ul className='space-y-3'>
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-foreground text-sm transition-colors'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className='border-border/50 mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row'
        >
          <p className='text-muted-foreground text-sm'>
            &copy; {new Date().getFullYear()} Luxe. All rights reserved.
          </p>
          <div className='flex items-center gap-6'>
            <Link
              href='#'
              className='text-muted-foreground hover:text-foreground text-sm transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              href='#'
              className='text-muted-foreground hover:text-foreground text-sm transition-colors'
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
