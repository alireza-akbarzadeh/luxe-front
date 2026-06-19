import { Skeleton } from '@/components/ui/skeleton';

export default function WalletLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-8 w-56' />
        <Skeleton className='h-4 w-96 max-w-full' />
      </div>
      <Skeleton className='h-96 max-w-2xl rounded-xl' />
    </div>
  );
}
