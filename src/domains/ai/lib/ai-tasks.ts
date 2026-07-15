/** Backend AI task identifiers — must match luxe `ai_service.go` constants. */
export const AI_TASKS = {
  productDescription: 'product_description',
  seoMeta: 'seo_meta',
  couponCopy: 'coupon_copy',
  productChat: 'product_chat',
  productBrief: 'product_brief',
  qaReply: 'qa_reply',
  blogArticle: 'blog_article',
  blogExcerpt: 'blog_excerpt',
  blogSeo: 'blog_seo'
} as const;

export type AiTask = (typeof AI_TASKS)[keyof typeof AI_TASKS];
