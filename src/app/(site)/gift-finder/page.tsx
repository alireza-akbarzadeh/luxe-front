import { redirect } from 'next/navigation';

/** Legacy path — gift finder lives under the gift cards section. */
export default function GiftFinderRedirectPage() {
  redirect('/gift-cards/finder');
}
