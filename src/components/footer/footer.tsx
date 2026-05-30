'use client';
import {
  IconArrowUp,
  IconCreditCard,
  IconLock,
  IconMail,
  IconMapPin,
  IconPackage,
  IconPhone
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import {
  footerSections,
  legalLinks,
  paymentMethods,
  socialLinks
} from '~/src/components/footer/footer.data';
import { FooterLinkColumn } from '~/src/components/footer/footer-link-column';
import { Newsletter } from '~/src/components/footer/news-letter';
import { TrustStrip } from '~/src/components/footer/trust-stripe';

function BackToTop() {
  return (
    <button
      type='button'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='group border-border/60 bg-card/60 hover:border-accent/40 hover:bg-card inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur transition-all'
      aria-label='Back to top'
    >
      <IconArrowUp className='size-4 transition-transform group-hover:-translate-y-0.5' />
      Back to top
    </button>
  );
}

export function Footer() {
  return (
    <footer className='border-border/60 bg-background relative mt-24 border-t'>
      {/* Top gradient hairline */}
      <div
        aria-hidden
        className='via-accent/40 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent'
      />
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Newsletter */}
        <div className='-mt-16'>
          <Newsletter />
        </div>
        {/* Trust */}
        <div className='mt-12'>
          <TrustStrip />
        </div>
        {/* Main grid */}
        <div className='mt-16 grid gap-12 lg:grid-cols-12'>
          {/* Brand */}
          <div className='lg:col-span-4'>
            <Link
              href='/'
              className='inline-flex items-baseline gap-1 text-3xl font-semibold tracking-tight'
            >
              LUXE
              <span className='bg-accent size-1.5 rounded-full' />
            </Link>
            <p className='text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed'>
              A curated multi-vendor marketplace for timeless design, premium craftsmanship, and
              independent luxury brands — all in one place.
            </p>
            {/* Contact */}
            <ul className='mt-6 space-y-3 text-sm'>
              <li className='text-muted-foreground flex items-start gap-3'>
                <IconMapPin className='text-accent mt-0.5 size-4 shrink-0' />
                <span>500 Madison Avenue, New York, NY 10022</span>
              </li>
              <li className='text-muted-foreground flex items-center gap-3'>
                <IconPhone className='text-accent size-4 shrink-0' />
                <a href='tel:+18001234567' className='hover:text-foreground'>
                  +1 (800) 123-4567
                </a>
              </li>
              <li className='text-muted-foreground flex items-center gap-3'>
                <IconMail className='text-accent size-4 shrink-0' />
                <a href='mailto:concierge@luxe.com' className='hover:text-foreground'>
                  concierge@luxe.com
                </a>
              </li>
            </ul>
            {/* Socials */}
            <div className='mt-6'>
              <div className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                Follow us
              </div>
              <div className='mt-3 flex flex-wrap gap-2'>
                {socialLinks.map((s) => (
                  <motion.a
                    key={s.name}
                    href={s.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={s.name}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className='group border-border/60 bg-card/60 text-muted-foreground hover:border-accent/40 hover:text-accent flex size-10 items-center justify-center rounded-xl border backdrop-blur transition-colors'
                  >
                    <s.icon className='size-4.5' />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          {/* Link columns */}
          <div className='grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8'>
            {footerSections.map((section) => (
              <FooterLinkColumn key={section.title} title={section.title} links={section.links} />
            ))}
          </div>
        </div>
        {/* App download + language */}
        <div className='border-border/60 bg-card/40 mt-16 flex flex-col gap-6 rounded-3xl border p-6 backdrop-blur md:flex-row md:items-center md:justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-accent/10 text-accent flex size-12 items-center justify-center rounded-2xl'>
              <IconPackage className='size-6' />
            </div>
            <div>
              <div className='text-sm font-semibold'>Shop on the go</div>
              <p className='text-muted-foreground text-xs'>
                Get the Luxe app for exclusive in-app drops & order tracking.
              </p>
            </div>
          </div>
          <div className='flex flex-wrap gap-3'>
            <a
              href='#'
              className='border-border/60 bg-background hover:bg-muted/60 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition'
            >
              <span className='text-xs opacity-70'>Download on the</span>
              <span className='font-semibold'>App Store</span>
            </a>
            <a
              href='#'
              className='border-border/60 bg-background hover:bg-muted/60 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition'
            >
              <span className='text-xs opacity-70'>Get it on</span>
              <span className='font-semibold'>Google Play</span>
            </a>
          </div>
        </div>
        {/* Divider */}
        <div className='via-border mt-12 h-px w-full bg-linear-to-r from-transparent to-transparent' />
        {/* Bottom bar */}
        <div className='flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between'>
          <div className='text-muted-foreground flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:gap-5'>
            <span>© {new Date().getFullYear()} Luxe Marketplace, Inc. All rights reserved.</span>
            <span className='hidden sm:inline'>·</span>
            <span className='inline-flex items-center gap-1.5'>
              <IconLock className='size-3.5' />
              Secure checkout · 256-bit SSL
            </span>
          </div>
          <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-xs'>
            {legalLinks.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>
        {/* Payments + Back to top */}
        <div className='border-border/60 flex flex-col-reverse items-start justify-between gap-6 border-t py-6 md:flex-row md:items-center'>
          <div className='flex items-center gap-3'>
            <IconCreditCard className='text-muted-foreground size-4' />
            <div className='flex flex-wrap gap-1.5'>
              {paymentMethods.map((p) => (
                <span
                  key={p}
                  className='border-border/60 bg-card text-muted-foreground rounded-md border px-2 py-1 text-[10px] font-semibold tracking-wider uppercase'
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
          <BackToTop />
        </div>
        {/* Oversized brand wordmark */}
        <div
          aria-hidden
          className='pointer-events-none -mt-4 overflow-hidden pb-2 text-center select-none'
        >
          <div className='from-foreground/8 bg-linear-to-b to-transparent bg-clip-text text-[18vw] leading-[0.9] font-black tracking-tighter text-transparent'>
            LUXE
          </div>
        </div>
      </div>
    </footer>
  );
}
