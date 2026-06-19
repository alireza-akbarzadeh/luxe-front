import { StoreForm } from '@/domains/stores-admin/sections/store-form';

interface EditStorePageProps {
  params: Promise<{ storeId: string }>;
}

export default async function EditStorePage(props: EditStorePageProps) {
  const { storeId } = await props.params;

  return <StoreForm isEdit storeId={storeId} />;
}
