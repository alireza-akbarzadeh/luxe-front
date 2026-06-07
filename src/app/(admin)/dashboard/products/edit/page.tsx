// app/dashboard/products/[id]/edit/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Flex } from '@/components/ui/flex';
import { ProductForm } from '@/domains/product-dashboard/containers/product-form';
import type { ProductFormValues } from '@/domains/product-dashboard/prodcut-schema';

async function getProduct(): Promise<ProductFormValues | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    name: 'Example Product',
    slug: 'example-product',
    description: 'This is an example product description.',
    brandId: 'brand-1',
    categoryId: 'cat-1',
    price: 29.99,
    compareAtPrice: 39.99,
    costPerItem: 15.0,
    taxable: true,
    attributes: [
      { name: 'Size', values: ['S', 'M', 'L'] },
      { name: 'Color', values: ['Red', 'Blue'] }
    ],
    sku: 'EX-123',
    barcode: '123456789012',
    trackInventory: true,
    quantity: 100,
    lowStockThreshold: 10,
    warehouseLocation: 'A-12',
    allowBackorder: false,
    images: [
      {
        id: 'img-1',
        previewUrl: 'https://via.placeholder.com/400',
        alt: 'Product image',
        isThumbnail: true
      }
    ],
    status: 'active',
    visibility: 'public',
    tags: ['featured', 'sale'],
    seoTitle: 'Example Product - Best Deal',
    seoDescription: 'Buy the best example product online.',
    channels: ['online_store', 'pos'],
    publishedAt: new Date()
  };
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  // Optional: fetch product name for dynamic title
  const product = await getProduct();
  return {
    title: product ? `Edit ${product.name} as id ${id} — Dashboard` : 'Edit Product — Dashboard',
    description: 'Update your product details'
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct();

  if (!product) {
    notFound();
  }

  return (
    <Flex direction='column' spacing={6} className='mx-auto max-w-4xl px-4 py-8'>
      <Flex direction='column' spacing={1}>
        <h1 className='text-2xl font-semibold tracking-tight'>Edit product</h1>
        <p className='text-muted-foreground text-sm'>
          Update the information for "{product.name}" and id {id}.
        </p>
      </Flex>
      <ProductForm isEditMode initialValues={product} />
    </Flex>
  );
}
