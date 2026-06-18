import { DiscountForm } from '~/src/domains/discounts/sections/discount-form';

interface EditDiscountPageProps {
  params: Promise<{ discountId: string }>;
}

export default async function EditDiscountPage(props: EditDiscountPageProps) {
  const { params } = props;
  const { discountId } = await params;

  return <DiscountForm isEdit discountId={discountId} />;
}
