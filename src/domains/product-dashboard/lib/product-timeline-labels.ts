import type { DtoProductTimelineEvent } from '@/services/-products-{id}-timeline-get.schemas';

const EVENT_LABELS: Record<string, string> = {
  listed: 'Listed on Luxe',
  published: 'Published to storefront',
  price_drop: 'Price dropped',
  price_increase: 'Price increased',
  sold_out: 'Sold out',
  restocked: 'Back in stock',
  status_change: 'Listing updated',
  first_review: 'First review',
  reviews_milestone: 'Review milestone'
};

/** Maps a product timeline event to admin-facing label and detail text. */
export function describeProductTimelineEvent(
  event: DtoProductTimelineEvent,
  formatPrice: (value: number) => string
): { label: string; detail?: string } {
  const type = event.type ?? 'status_change';
  const label = EVENT_LABELS[type] ?? 'Listing updated';

  let detail: string | undefined;

  if (type === 'price_drop' || type === 'price_increase') {
    const from = event.meta?.price_from;
    const to = event.meta?.price_to;
    if (from != null && to != null) {
      detail = `${formatPrice(from)} → ${formatPrice(to)}`;
    }
  } else if (type === 'first_review' && event.meta?.review_rating != null) {
    detail = `First review · ${event.meta.review_rating} stars`;
  } else if (type === 'reviews_milestone' && event.meta?.review_count != null) {
    detail = `${event.meta.review_count} verified reviews`;
  } else if (event.meta?.workflow_state) {
    detail = event.meta.workflow_state;
  }

  return { label, detail };
}
