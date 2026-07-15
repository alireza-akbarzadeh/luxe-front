import { BlogPostForm } from '@/domains/blog-admin/sections/blog-post-form';

interface EditBlogPostPageProps {
  params: Promise<{ postId: string }>;
}

export default async function EditBlogPostPage(props: EditBlogPostPageProps) {
  const { postId } = await props.params;

  return <BlogPostForm isEdit postId={postId} />;
}
