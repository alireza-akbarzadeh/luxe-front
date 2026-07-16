import type { DtoBrandResponse } from '@/services/-brands-get.schemas';

export type BrandsDirectoryTab = 'all' | 'popular' | 'newest' | 'name_asc';

export type BrandProductSort = 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export type BrandProductGender = 'all' | 'men' | 'women' | 'kids';

export interface BrandDirectoryCardData {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  productCount: number;
  isFeatured: boolean;
}

export function toBrandDirectoryCard(brand: DtoBrandResponse): BrandDirectoryCardData | null {
  if (!brand.id || !brand.slug?.trim() || !brand.name?.trim()) return null;
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    description: brand.description,
    logoUrl: brand.logo_url,
    productCount: brand.product_count ?? 0,
    isFeatured: Boolean(brand.is_featured)
  };
}
