import { IconMail, IconMapPin, IconPhone } from '@tabler/icons-react';
import Link from 'next/link';

import { Newsletter } from '@/components/footer/news-letter';
import { LandingContainer } from '@/domains/vendor/landing/components/ui/vendor-landing-primitives';
import { FOOTER_CONTACT, FOOTER_SECTIONS } from '@/domains/vendor/landing/data/vendor-landing.data';

export function VendorLandingFooter() {
  return (
    <footer id='contact' className='border-border/60 bg-muted/20 border-t'>
      <LandingContainer className='py-16 md:py-20'>
        <div className='-mt-8 mb-12'>
          <Newsletter />
        </div>

        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-6'>
          <div className='lg:col-span-2'>
            <Link href='/vendor' className='inline-flex items-center gap-2'>
              <span className='text-xl font-bold tracking-tight'>LUXE</span>
              <span className='text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase'>
                Sellers
              </span>
            </Link>
            <p className='text-muted-foreground mt-4 max-w-xs text-sm leading-relaxed'>
              The premium marketplace platform for modern brands. Sell smarter, scale faster.
            </p>
            <ul className='text-muted-foreground mt-6 space-y-2 text-sm'>
              <li className='flex items-center gap-2'>
                <IconMail className='size-4 shrink-0' aria-hidden />
                <a href={`mailto:${FOOTER_CONTACT.email}`} className='hover:text-foreground'>
                  {FOOTER_CONTACT.email}
                </a>
              </li>
              <li className='flex items-center gap-2'>
                <IconPhone className='size-4 shrink-0' aria-hidden />
                <span>{FOOTER_CONTACT.phone}</span>
              </li>
              <li className='flex items-start gap-2'>
                <IconMapPin className='mt-0.5 size-4 shrink-0' aria-hidden />
                <span>{FOOTER_CONTACT.address}</span>
              </li>
            </ul>
          </div>

          <FooterColumn title='Company' links={FOOTER_SECTIONS.company} />
          <FooterColumn title='Marketplace' links={FOOTER_SECTIONS.marketplace} />
          <FooterColumn title='Resources' links={FOOTER_SECTIONS.resources} />
          <FooterColumn title='Support' links={FOOTER_SECTIONS.support} />
          <FooterColumn title='Legal' links={FOOTER_SECTIONS.legal} />
        </div>

        <div className='border-border/50 text-muted-foreground mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row'>
          <p>© {new Date().getFullYear()} Luxe Marketplace. All rights reserved.</p>
          <div className='flex gap-4'>
            <Link href='/legal/terms' className='hover:text-foreground'>
              Terms
            </Link>
            <Link href='/legal/privacy' className='hover:text-foreground'>
              Privacy
            </Link>
            <Link href='/store' className='hover:text-foreground'>
              Shop as customer
            </Link>
          </div>
        </div>
      </LandingContainer>
    </footer>
  );
}

function FooterColumn({
  title,
  links
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className='text-sm font-semibold'>{title}</h3>
      <ul className='mt-4 space-y-2.5'>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className='text-muted-foreground hover:text-foreground text-sm transition-colors'
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
