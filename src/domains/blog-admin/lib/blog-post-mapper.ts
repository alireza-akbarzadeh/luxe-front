import type { BlogPostFormValues } from '@/domains/blog-admin/schemas/blog-post-schema';
import type { DtoBlogPostResponse } from '@/services/-admin-blog-posts-{id}-get.schemas';
import type { DtoCreateBlogPostRequest } from '@/services/-admin-blog-posts-post.schemas';

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function categoryIdFromForm(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

/** Maps admin form values to the create/update blog post API payload. */
export function mapFormToBlogPostRequest(values: BlogPostFormValues): DtoCreateBlogPostRequest {
  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    excerpt: optionalText(values.excerpt) ?? '',
    hero_image_url: optionalText(values.hero_image_url) ?? '',
    hero_image_alt: optionalText(values.hero_image_alt) ?? '',
    section_type: values.section_type,
    status: values.status,
    category_id: categoryIdFromForm(values.category_id),
    content_blocks: values.content_blocks,
    is_featured: values.is_featured,
    is_editor_pick: values.is_editor_pick,
    is_trending: values.is_trending,
    reading_time_minutes: values.reading_time_minutes,
    meta_title: optionalText(values.meta_title) ?? '',
    meta_description: optionalText(values.meta_description) ?? '',
    canonical_url: optionalText(values.canonical_url) ?? ''
  };
}

/** Maps an API blog post into admin form values for edit mode. */
export function mapBlogPostToFormValues(post: DtoBlogPostResponse): BlogPostFormValues {
  const status = post.status;
  const validStatus =
    status === 'draft' ||
    status === 'in_review' ||
    status === 'scheduled' ||
    status === 'published' ||
    status === 'archived'
      ? status
      : 'draft';

  return {
    title: post.title ?? '',
    slug: post.slug ?? '',
    excerpt: post.excerpt ?? '',
    hero_image_url: post.hero_image_url ?? '',
    hero_image_alt: post.hero_image_alt ?? '',
    section_type: post.section_type || 'article',
    status: validStatus,
    category_id: post.category?.id ? String(post.category.id) : '',
    content_blocks: Array.isArray(post.content_blocks) ? post.content_blocks : [],
    is_featured: post.is_featured ?? false,
    is_editor_pick: post.is_editor_pick ?? false,
    is_trending: post.is_trending ?? false,
    reading_time_minutes: post.reading_time_minutes ?? 5,
    meta_title: post.meta_title ?? '',
    meta_description: post.meta_description ?? '',
    canonical_url: post.canonical_url ?? ''
  };
}
