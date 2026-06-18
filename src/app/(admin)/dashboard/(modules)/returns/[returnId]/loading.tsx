import { ReturnDetailSkeleton } from '@/domains/returns-admin/sections/return-detail-skeleton';

export default function ReturnDetailLoading() {
  return (
    <div className='mx-auto max-w-350 px-6 py-8'>
      <ReturnDetailSkeleton />
    </div>
  );
}
