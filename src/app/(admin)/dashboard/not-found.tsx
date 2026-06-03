// app/dashboard/not-found.tsx
'use client';

import { IconMoodSad } from '@tabler/icons-react';
import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div className='flex h-[60vh] flex-col items-center justify-center gap-4 text-center'>
      <IconMoodSad className='text-muted-foreground h-20 w-20' />
      <h1 className='text-3xl font-bold tracking-tight'>Page Not Found</h1>
      <p className='text-muted-foreground max-w-md'>
        Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn’t
        exist.
      </p>
      <div className='mt-4'>
        <Link
          href='/dashboard'
          className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors'
        >
          Go to Dashboard Home
        </Link>
      </div>
    </div>
  );
}
