import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

export default function WeblogPostNotFound() {
  return (
    <div className='app-container py-20'>
      <Flex direction='column' align='center' gap={4} className='mx-auto max-w-md text-center'>
        <Typography.H1 className='font-display text-3xl'>Article not found</Typography.H1>
        <Typography.Muted>
          The story you are looking for may have been moved or is not published yet.
        </Typography.Muted>
        <Button asChild>
          <Link href='/weblog'>Back to blog</Link>
        </Button>
      </Flex>
    </div>
  );
}
