import { Skeleton } from '@/components/ui/skeleton';

export function CheckoutLoading() {
    return (
        <div className='pt-24 pb-16'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                {/* Breadcrumb skeleton */}
                <div className='mb-6'>
                    <Skeleton className='h-6 w-48' />
                </div>

                {/* Steps skeleton */}
                <div className='mb-8 flex gap-4'>
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className='h-10 w-32 rounded-full' />
                    ))}
                </div>

                <div className='grid gap-8 lg:grid-cols-5 lg:gap-12'>
                    {/* Left column – form skeleton */}
                    <div className='lg:col-span-3 space-y-6'>
                        <Skeleton className='h-8 w-48' />
                        <div className='space-y-4'>
                            <Skeleton className='h-10 w-full' />
                            <Skeleton className='h-10 w-full' />
                            <div className='grid grid-cols-2 gap-4'>
                                <Skeleton className='h-10 w-full' />
                                <Skeleton className='h-10 w-full' />
                            </div>
                            <Skeleton className='h-24 w-full' />
                            <div className='grid grid-cols-3 gap-4'>
                                <Skeleton className='h-10 w-full' />
                                <Skeleton className='h-10 w-full' />
                                <Skeleton className='h-10 w-full' />
                            </div>
                            <Skeleton className='h-10 w-full' />
                        </div>
                        <div className='pt-6'>
                            <Skeleton className='h-6 w-40 mb-4' />
                            <div className='space-y-3'>
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className='h-20 w-full rounded-xl' />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column – summary skeleton */}
                    <div className='lg:col-span-2'>
                        <Skeleton className='h-64 w-full rounded-xl' />
                    </div>
                </div>
            </div>
        </div>
    );
}
