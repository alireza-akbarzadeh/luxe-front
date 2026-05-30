import Link from 'next/link';

import { cn } from '~/src/lib/utils';

export function FooterLinkColumn({
  title,
  links
}: {
  title: string;
  links: ReadonlyArray<{ name: string; href: string; badge?: string }>;
}) {
  return (
    <div>
      <h4 className='text-sm font-semibold tracking-wider uppercase'>{title}</h4>
      <ul className='mt-5 space-y-3'>
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className='group text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors'
            >
              <span className='relative'>
                {link.name}
                <span className='bg-foreground absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full' />
              </span>
              {link.badge && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] leading-none font-medium',
                    link.badge.startsWith('-')
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-accent/15 text-accent'
                  )}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
