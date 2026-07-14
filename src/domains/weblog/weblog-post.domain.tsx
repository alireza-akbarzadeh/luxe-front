import { getTranslations } from 'next-intl/server';

import type { DtoBlogPostResponse } from '@/services/-blog-posts-{slug}-get.schemas';

interface WeblogPostDomainProps {
  post: DtoBlogPostResponse;
}
export async function WeblogPostDomain({ post }: WeblogPostDomainProps) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
      <p>{post.content_blocks?.map((block) => block['type'] as string)}</p>
      <p>{post.content_blocks?.map((block) => block['content'] as string)}</p>
      <p>{post.content_blocks?.map((block) => block['content'] as string)}</p>
      <p>{post.content_blocks?.map((block) => block['content'] as string)}</p>
    </div>
  );
}
