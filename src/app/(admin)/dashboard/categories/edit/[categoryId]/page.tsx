import { CategoryForm } from '@/domains/categories/sections/category-form';

interface EditCategoryProps {
  params: Promise<{ categoryId: string }>;
}

export default async function EditCategory(props: EditCategoryProps) {
  const { params } = props;
  const { categoryId } = await params;

  return <CategoryForm isEdit categoryId={categoryId} />;
}
