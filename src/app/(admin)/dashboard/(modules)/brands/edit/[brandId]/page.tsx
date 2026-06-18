import { BrandForm } from '@/domains/brands/sections/brand-form';

interface EditBrandPageProps {
  params: Promise<{ brandId: string }>;
}

export default async function EditBrandPage(props: EditBrandPageProps) {
  const { brandId } = await props.params;

  return <BrandForm isEdit brandId={brandId} />;
}
