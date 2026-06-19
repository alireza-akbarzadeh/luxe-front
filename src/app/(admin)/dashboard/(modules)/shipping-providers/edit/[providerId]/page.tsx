import { ProviderForm } from '@/domains/shipping-providers/sections/provider-form';

interface EditShippingProviderPageProps {
  params: Promise<{ providerId: string }>;
}

export default async function EditShippingProviderPage(props: EditShippingProviderPageProps) {
  const { providerId } = await props.params;

  return <ProviderForm isEdit providerId={providerId} />;
}
