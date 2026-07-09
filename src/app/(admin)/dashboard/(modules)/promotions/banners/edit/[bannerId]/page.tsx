import { BannerForm } from '@/domains/promotions-admin/sections/banner-form';

interface EditBannerPageProps {
  params: Promise<{ bannerId: string }>;
}

export default async function EditBannerPage(props: EditBannerPageProps) {
  const { bannerId } = await props.params;

  return <BannerForm isEdit bannerId={bannerId} />;
}
