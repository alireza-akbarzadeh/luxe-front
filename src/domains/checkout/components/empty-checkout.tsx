import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function EmptyCheckout() {
  return (
    <div className='bg-background min-h-screen'>
      <main className='pt-24 pb-16'>
        <div className='mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8'>
          <h1 className='mb-4 text-2xl font-bold'>Your cart is empty</h1>
          <p className='text-muted-foreground mb-8'>
            Add some items to your cart before checking out.
          </p>
          <Link href='/shop'>
            <Button size='lg' className='rounded-full'>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
