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
import { useTranslations } from 'next-intl';

import { LanguageSwitcher } from '@/components/i18n/language-switcher';
import { getFooterBarCopyParams } from '@/lib/i18n/marketing-copy-params';
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
  const t = useTranslations('common');

  return (
    <button
      type='button'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className='group border-border/60 bg-card/60 hover:border-accent/40 hover:bg-card inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur transition-all'
      aria-label={t('backToTop')}
    >
      <IconArrowUp className='size-4 transition-transform group-hover:-translate-y-0.5' />
      {t('backToTop')}
    </button>
  );
}

export function Footer() {
  const t = useTranslations('footer');
  const tLinks = useTranslations('footer.links');
  const tSections = useTranslations('footer.sections');
  const tLegal = useTranslations('footer.legal');
  const footerBarCopy = getFooterBarCopyParams();

  return (
    <footer className='border-border/60 bg-background relative mt-24 overflow-x-hidden border-t pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0'>
      <div
        aria-hidden
        className='via-accent/40 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent'
      />
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='-mt-16'>
          <Newsletter />
        </div>
        <div className='mt-12'>
          <TrustStrip />
        </div>
        <div className='mt-16 grid gap-12 lg:grid-cols-12'>
          <div className='lg:col-span-4'>
            <Link
              href='/'
              className='inline-flex items-baseline gap-1 text-3xl font-semibold tracking-tight'
            >
              LUXE
              <span className='bg-accent size-1.5 rounded-full' />
            </Link>
            <p className='text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed'>
              {t('tagline')}
            </p>
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
            <div className='mt-6'>
              <div className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                {t('followUs')}
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
          <div className='grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8'>
            {footerSections.map((section) => (
              <FooterLinkColumn
                key={section.titleKey}
                title={tSections(section.titleKey)}
                links={section.links.map((link) => ({
                  name: tLinks(link.nameKey),
                  href: link.href,
                  badge: link.badge
                }))}
              />
            ))}
          </div>
        </div>
        <div className='border-border/60 bg-card/40 mt-16 flex flex-col gap-6 rounded-3xl border p-6 backdrop-blur md:flex-row md:items-center md:justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-accent/10 text-accent flex size-12 items-center justify-center rounded-2xl'>
              <IconPackage className='size-6' />
            </div>
            <div>
              <div className='text-sm font-semibold'>{t('shopOnTheGoTitle')}</div>
              <p className='text-muted-foreground text-xs'>{t('shopOnTheGoDescription')}</p>
            </div>
          </div>
          <div className='flex flex-wrap gap-3'>
            <Link
              href='/apps'
              className='border-border/60 bg-background hover:bg-muted/60 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition'
            >
              <span className='text-xs opacity-70'>{t('downloadOn')}</span>
              <span className='font-semibold'>{t('appStore')}</span>
            </Link>
            <Link
              href='/apps'
              className='border-border/60 bg-background hover:bg-muted/60 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition'
            >
              <span className='text-xs opacity-70'>{t('getItOn')}</span>
              <span className='font-semibold'>{t('googlePlay')}</span>
            </Link>
            <LanguageSwitcher variant='footer' />
          </div>
        </div>
        <div className='via-border mt-12 h-px w-full bg-linear-to-r from-transparent to-transparent' />
        <div className='flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between'>
          <div className='text-muted-foreground flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:gap-5'>
            <span>{t('copyright', footerBarCopy)}</span>
            <span className='hidden sm:inline'>·</span>
            <span className='inline-flex items-center gap-1.5'>
              <IconLock className='size-3.5' />
              {t('secureCheckout', footerBarCopy)}
            </span>
          </div>
          <div className='flex flex-wrap items-center gap-x-5 gap-y-2 text-xs'>
            {legalLinks.map((l) => (
              <Link
                key={l.key}
                href={l.href}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                {tLegal(l.key)}
              </Link>
            ))}
          </div>
        </div>
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
        <div
          aria-hidden
          className='pointer-events-none -mt-4 overflow-hidden pb-2 text-center select-none'
        >
          <div className='from-foreground/20 via-foreground/8 dark:from-foreground/10 dark:via-foreground/4 bg-linear-to-b to-transparent bg-clip-text text-[18vw] leading-[0.9] font-black tracking-tighter text-transparent'>
            LUXE
          </div>
        </div>
      </div>
    </footer>
  );
}
