export function mapSortToAPI(sortBy: string): string | undefined {
  switch (sortBy) {
    case 'price-asc':
      return 'price_asc';
    case 'price-desc':
      return 'price_desc';
    case 'rating':
      return 'rating_desc';
    case 'newest':
      return 'newest';
    default:
      return undefined;
  }
}
