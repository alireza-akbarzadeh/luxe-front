/** Backend AI task identifiers — must match luxe `ai_service.go` constants. */
export const AI_TASKS = {
  productDescription: 'product_description',
  seoMeta: 'seo_meta',
  couponCopy: 'coupon_copy',
  productChat: 'product_chat',
  qaReply: 'qa_reply'
} as const;

export type AiTask = (typeof AI_TASKS)[keyof typeof AI_TASKS];
