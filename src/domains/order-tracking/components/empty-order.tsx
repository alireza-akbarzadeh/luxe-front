import { IconBasket } from '@tabler/icons-react';
import Link from 'next/link';
import { Empty } from '@/components/empty';
import { Button } from '@/components/ui/button';

export function EmptyOrder() {
    return (
        <Empty
            title='Order Not Found'
            icon={IconBasket}
            description="We couldn't find your order. It may have been removed or the link is incorrect."
            content={
                <Link href='/shop'>
                    <Button size='lg' className='rounded-full'>
                        Continue Shopping
                    </Button>
                </Link>
            }
        />
    );
}
