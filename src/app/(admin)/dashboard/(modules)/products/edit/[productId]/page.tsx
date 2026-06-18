import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Flex } from '@/components/ui/flex';
import { ProductForm } from '@/domains/product-dashboard/containers/product-form';
import { mapProductToFormValues } from '@/domains/product-dashboard/lib/product-mapper';
import { getProductsId } from '@/services/-products-{id}-get';

interface EditProductPageProps {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProductsId(productId);
  return {
    title: product
      ? `Edit ${product.data?.product?.name} — Dashboard`
      : 'Edit Product — Dashboard',
    description: 'Update your product details'
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { productId } = await params;
  const products = await getProductsId(productId);
  const product = products.data?.product;

  if (!product?.id) {
    notFound();
  }

  return (
    <Flex direction='column' spacing={6} className='mx-auto max-w-4xl px-4 py-8'>
      <Flex direction='column' spacing={1}>
        <h1 className='text-2xl font-semibold tracking-tight'>Edit product</h1>
        <p className='text-muted-foreground text-sm'>
          Update the information for &ldquo;{product.name}&rdquo;.
        </p>
      </Flex>
      <ProductForm
        isEditMode
        productId={product.id}
        initialValues={mapProductToFormValues(product)}
      />
    </Flex>
  );
}
