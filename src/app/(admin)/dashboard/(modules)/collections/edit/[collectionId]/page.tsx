import { CollectionForm } from '@/domains/collections-admin/sections/collection-form';

interface EditCollectionPageProps {
  params: Promise<{ collectionId: string }>;
}

export default async function EditCollectionPage(props: EditCollectionPageProps) {
  const { collectionId } = await props.params;
  return <CollectionForm isEdit collectionId={collectionId} />;
}
