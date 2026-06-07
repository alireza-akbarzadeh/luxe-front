import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';

export function ProductsDomains() {
  return (
    <Flex direction='row' justify='between'>
      Products
      <Button asChild>
        <Link href='/dashboard/products/create'>
          <IconPlus />
          New Product
        </Link>
      </Button>
    </Flex>
  );
}
