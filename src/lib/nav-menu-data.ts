import type { TablerIcon } from '@tabler/icons-react';

export type NavSubLink = {
  title: string;
  href: string;
  description?: string;
};

export type NavColumn = {
  title: string;
  links: NavSubLink[];
};

export type NavFeatured = {
  title: string;
  description: string;
  href: string;
  image: string;
  badge?: string;
};

export type NavMegaMenu = {
  type: 'mega';
  label: string;
  columns: NavColumn[];
  featured?: NavFeatured[];
  viewAll?: { label: string; href: string };
};

export type NavSimpleLink = {
  type: 'link';
  label: string;
  href: string;
  badge?: string;
  Icon?: TablerIcon;
};

export type NavItem = NavMegaMenu | NavSimpleLink;

/** Mock navigation — replace with API-driven data later */
export const navMenuItems: NavItem[] = [
  {
    type: 'mega',
    label: 'Women',
    viewAll: { label: 'Shop all Women', href: '/shop?categoryId=1' },
    columns: [
      {
        title: 'Clothing',
        links: [
          { title: 'Dresses', href: '/shop?categoryId=1&searchQuery=dresses' },
          { title: 'Tops & Blouses', href: '/shop?categoryId=1&searchQuery=tops' },
          { title: 'Knitwear', href: '/shop?categoryId=1&searchQuery=knitwear' },
          { title: 'Coats & Jackets', href: '/shop?categoryId=1&searchQuery=coats' },
          { title: 'Trousers & Skirts', href: '/shop?categoryId=1&searchQuery=trousers' }
        ]
      },
      {
        title: 'Shoes & Bags',
        links: [
          { title: 'Heels', href: '/shop?categoryId=1&searchQuery=heels' },
          { title: 'Flats & Loafers', href: '/shop?categoryId=1&searchQuery=flats' },
          { title: 'Boots', href: '/shop?categoryId=1&searchQuery=boots' },
          { title: 'Handbags', href: '/shop?categoryId=1&searchQuery=handbags' },
          { title: 'Crossbody & Clutch', href: '/shop?categoryId=1&searchQuery=clutch' }
        ]
      },
      {
        title: 'Accessories',
        links: [
          { title: 'Jewelry', href: '/shop?categoryId=1&searchQuery=jewelry' },
          { title: 'Watches', href: '/shop?categoryId=1&searchQuery=watches' },
          { title: 'Sunglasses', href: '/shop?categoryId=1&searchQuery=sunglasses' },
          { title: 'Scarves & Belts', href: '/shop?categoryId=1&searchQuery=scarves' },
          { title: 'Small Leather Goods', href: '/shop?categoryId=1&searchQuery=leather' }
        ]
      }
    ],
    featured: [
      {
        title: 'New Arrivals',
        description: 'Fresh edits for the season',
        href: '/shop?sortBy=newest&showOnlyNew=true',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
        badge: 'New'
      }
    ]
  },
  {
    type: 'mega',
    label: 'Men',
    viewAll: { label: 'Shop all Men', href: '/shop?categoryId=2' },
    columns: [
      {
        title: 'Clothing',
        links: [
          { title: 'Shirts', href: '/shop?categoryId=2&searchQuery=shirts' },
          { title: 'Suits & Blazers', href: '/shop?categoryId=2&searchQuery=suits' },
          { title: 'Knitwear', href: '/shop?categoryId=2&searchQuery=knitwear' },
          { title: 'Outerwear', href: '/shop?categoryId=2&searchQuery=outerwear' },
          { title: 'Casualwear', href: '/shop?categoryId=2&searchQuery=casual' }
        ]
      },
      {
        title: 'Shoes',
        links: [
          { title: 'Dress Shoes', href: '/shop?categoryId=2&searchQuery=dress-shoes' },
          { title: 'Sneakers', href: '/shop?categoryId=2&searchQuery=sneakers' },
          { title: 'Boots', href: '/shop?categoryId=2&searchQuery=boots' },
          { title: 'Loafers', href: '/shop?categoryId=2&searchQuery=loafers' }
        ]
      },
      {
        title: 'Accessories',
        links: [
          { title: 'Watches', href: '/shop?categoryId=2&searchQuery=watches' },
          { title: 'Belts & Wallets', href: '/shop?categoryId=2&searchQuery=wallets' },
          { title: 'Ties & Pocket Squares', href: '/shop?categoryId=2&searchQuery=ties' },
          { title: 'Sunglasses', href: '/shop?categoryId=2&searchQuery=sunglasses' },
          { title: 'Bags', href: '/shop?categoryId=2&searchQuery=bags' }
        ]
      }
    ],
    featured: [
      {
        title: 'Essential Tailoring',
        description: 'Refined silhouettes for every occasion',
        href: '/shop?categoryId=2&searchQuery=suits',
        image: 'https://images.unsplash.com/photo-1617137984095-74e4e91032ab?w=600&h=800&fit=crop'
      }
    ]
  },
  {
    type: 'mega',
    label: 'Accessories',
    viewAll: { label: 'Shop all Accessories', href: '/shop?categoryId=1' },
    columns: [
      {
        title: 'Jewelry & Watches',
        links: [
          { title: 'Fine Jewelry', href: '/shop?searchQuery=jewelry' },
          { title: 'Watches', href: '/shop?searchQuery=watches' },
          { title: 'Bracelets', href: '/shop?searchQuery=bracelets' },
          { title: 'Necklaces', href: '/shop?searchQuery=necklaces' },
          { title: 'Rings', href: '/shop?searchQuery=rings' }
        ]
      },
      {
        title: 'Eyewear & Leather',
        links: [
          { title: 'Sunglasses', href: '/shop?searchQuery=sunglasses' },
          { title: 'Optical Frames', href: '/shop?searchQuery=eyewear' },
          { title: 'Handbags', href: '/shop?searchQuery=handbags' },
          { title: 'Wallets & Cardholders', href: '/shop?searchQuery=wallets' },
          { title: 'Belts', href: '/shop?searchQuery=belts' }
        ]
      },
      {
        title: 'Tech & Travel',
        links: [
          { title: 'Phone Cases', href: '/shop?searchQuery=phone' },
          { title: 'Headphones', href: '/shop?searchQuery=headphones' },
          { title: 'Luggage', href: '/shop?searchQuery=luggage' },
          { title: 'Travel Accessories', href: '/shop?searchQuery=travel' }
        ]
      }
    ],
    featured: [
      {
        title: 'Icon Watches',
        description: 'Timepieces that define your look',
        href: '/shop?searchQuery=watches',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop',
        badge: 'Trending'
      }
    ]
  },
  {
    type: 'mega',
    label: 'Home & Living',
    viewAll: { label: 'Shop all Home', href: '/shop?categoryId=2' },
    columns: [
      {
        title: 'Furniture',
        links: [
          { title: 'Sofas & Seating', href: '/shop?categoryId=2&searchQuery=sofas' },
          { title: 'Tables', href: '/shop?categoryId=2&searchQuery=tables' },
          { title: 'Storage', href: '/shop?categoryId=2&searchQuery=storage' },
          { title: 'Bedroom', href: '/shop?categoryId=2&searchQuery=bedroom' }
        ]
      },
      {
        title: 'Decor',
        links: [
          { title: 'Lighting', href: '/shop?searchQuery=lighting' },
          { title: 'Vases & Objects', href: '/shop?searchQuery=vases' },
          { title: 'Wall Art', href: '/shop?searchQuery=art' },
          { title: 'Candles & Fragrance', href: '/shop?searchQuery=candles' },
          { title: 'Mirrors', href: '/shop?searchQuery=mirrors' }
        ]
      },
      {
        title: 'Kitchen & Table',
        links: [
          { title: 'Tableware', href: '/shop?searchQuery=tableware' },
          { title: 'Glassware', href: '/shop?searchQuery=glassware' },
          { title: 'Cookware', href: '/shop?searchQuery=cookware' },
          { title: 'Linens', href: '/shop?searchQuery=linens' }
        ]
      }
    ],
    featured: [
      {
        title: 'Curated Interiors',
        description: 'Elevate every room',
        href: '/shop?categoryId=2',
        image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=800&fit=crop'
      }
    ]
  },
  {
    type: 'mega',
    label: 'Electronics',
    viewAll: { label: 'Shop all Electronics', href: '/shop?categoryId=3' },
    columns: [
      {
        title: 'Audio',
        links: [
          { title: 'Headphones', href: '/shop?categoryId=3&searchQuery=headphones' },
          { title: 'Speakers', href: '/shop?categoryId=3&searchQuery=speakers' },
          { title: 'Earbuds', href: '/shop?categoryId=3&searchQuery=earbuds' }
        ]
      },
      {
        title: 'Mobile & Computing',
        links: [
          { title: 'Phones & Tablets', href: '/shop?categoryId=3&searchQuery=phones' },
          { title: 'Laptops', href: '/shop?categoryId=3&searchQuery=laptops' },
          { title: 'Accessories', href: '/shop?categoryId=3&searchQuery=accessories' }
        ]
      },
      {
        title: 'Smart Home',
        links: [
          { title: 'Smart Speakers', href: '/shop?categoryId=3&searchQuery=smart' },
          { title: 'Wearables', href: '/shop?categoryId=3&searchQuery=wearables' },
          { title: 'Charging', href: '/shop?categoryId=3&searchQuery=charging' }
        ]
      }
    ]
  },
  {
    type: 'link',
    label: 'Store',
    href: '/store'
  },
  {
    type: 'link',
    label: 'New In',
    href: '/shop?sortBy=newest&showOnlyNew=true'
  },
  {
    type: 'link',
    label: 'Sale',
    href: '/shop?showOnlySale=true',
    badge: 'Up to 40%'
  }
];

export const navUtilityLinks = [
  { label: 'Stores', href: '/store/luxe-accessories' },
  { label: 'Wishlist', href: '/wishlist' },
  { label: 'My Account', href: '/account' }
];
