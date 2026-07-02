import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline',
  robots: {
    index: false,
    follow: false
  }
};

export default function OfflinePage() {
  return (
    <main className='mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-3 px-6 text-center'>
      <h1 className='text-2xl font-semibold'>You are offline</h1>
      <p className='text-muted-foreground'>
        The page could not be loaded right now. Check your connection and try again.
      </p>
    </main>
  );
}
