import type { Metadata } from 'next';

import { Flex } from '@/components/ui/flex';
import { ProductForm } from '@/domains/product-dashboard/containers/product-form';

export const metadata: Metadata = {
  title: 'Create product — Dashboard',
  description: 'Add a new product to your store'
};

export default function CreateProductPage() {
  return (
    <Flex direction='column' spacing={6} className='px-4 py-8'>
      <Flex direction='column' spacing={1}>
        <h1 className='text-2xl font-semibold tracking-tight'>Create product</h1>
        <p className='text-muted-foreground text-sm'>
          Fill in each section to add a new product to your store.
        </p>
      </Flex>
      <ProductForm />
    </Flex>
  );
}
