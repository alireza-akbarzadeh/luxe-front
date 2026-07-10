import { redirect } from 'next/navigation';

interface EditStoreRedirectPageProps {
  params: Promise<{ storeId: string }>;
}

export default async function EditStoreRedirectPage({ params }: EditStoreRedirectPageProps) {
  const { storeId } = await params;
  redirect(`/dashboard/vendors/edit/${storeId}`);
}
