export type ProductMock = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compare_at_price?: number;
  rating: number;
  reviews_count: number;
  stock: number;
  is_new: boolean;
  is_digital: boolean;
  images: string[];
  description: string;
  category: { id: number; name: string; slug: string };
  colors: string[];
  sizes: string[];
  status: string;
};

export function createProduct(overrides?: Partial<ProductMock>): ProductMock {
  return {
    id: 7,
    name: 'Heritage Leather Weekender',
    slug: 'heritage-leather-weekender',
    sku: 'LUXE-007',
    price: 289,
    compare_at_price: 349,
    rating: 4.8,
    reviews_count: 42,
    stock: 12,
    is_new: true,
    is_digital: false,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop'
    ],
    description:
      'Premium full-grain leather weekender with reinforced handles and cabin-friendly size.',
    category: { id: 1, name: 'Accessories', slug: 'accessories' },
    colors: ['#1a1a1a', '#8B4513'],
    sizes: ['S', 'M', 'L'],
    status: 'active',
    ...overrides
  };
}

export function productByIdResponse(product: ProductMock) {
  return {
    success: true,
    data: {
      product,
      is_liked: false
    }
  };
}

export function productsListResponse(products: ProductMock[], total?: number) {
  return {
    success: true,
    data: {
      products,
      total: total ?? products.length
    }
  };
}

export function emptyCartResponse() {
  return {
    success: true,
    data: {
      id: 1,
      items: [],
      total: 0
    }
  };
}

export function navMenusResponse() {
  return {
    success: true,
    data: {
      menus: [
        { id: 1, label: 'Shop', href: '/shop', sort_order: 1 },
        { id: 2, label: 'New', href: '/shop?sortBy=newest', sort_order: 2 }
      ]
    }
  };
}
