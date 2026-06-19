export const VENDOR_STORES = [
  { id: 1, name: 'Maison Marchetti', slug: 'maison-marchetti' },
  { id: 2, name: 'Northline Supply', slug: 'northline-supply' },
  { id: 3, name: 'Cedar Studio', slug: 'cedar-studio' }
] as const;

export const VENDOR_DASHBOARD_STATS = {
  todayRevenue: 2840,
  todayRevenueChange: 12.4,
  monthlyRevenue: 48290,
  monthlyRevenueChange: 18.2,
  ordersToday: 34,
  ordersTodayChange: 8.1,
  pendingOrders: 12,
  products: 342,
  lowStock: 7,
  visitors: 4821,
  visitorsChange: 5.6,
  conversionRate: 3.8,
  conversionChange: 0.4,
  averageOrderValue: 76.4,
  aovChange: 2.1,
  refundRequests: 3,
  unreadMessages: 3,
  recentReviews: 5,
  newCustomers: 28,
  pendingPayout: 12840,
  storeRating: 4.9,
  storeHealth: 92
} as const;

export const VENDOR_REVENUE_SERIES = [
  { date: 'Mon', revenue: 4200, orders: 48 },
  { date: 'Tue', revenue: 5100, orders: 52 },
  { date: 'Wed', revenue: 4800, orders: 45 },
  { date: 'Thu', revenue: 6200, orders: 61 },
  { date: 'Fri', revenue: 7100, orders: 68 },
  { date: 'Sat', revenue: 8400, orders: 82 },
  { date: 'Sun', revenue: 6900, orders: 71 }
] as const;

export const VENDOR_CATEGORY_SALES = [
  { category: 'Apparel', sales: 18400 },
  { category: 'Accessories', sales: 12200 },
  { category: 'Home', sales: 9800 },
  { category: 'Beauty', sales: 5400 },
  { category: 'Gifts', sales: 2490 }
] as const;

export const VENDOR_TRAFFIC_SOURCES = [
  { source: 'Organic', value: 42 },
  { source: 'Marketplace', value: 28 },
  { source: 'Email', value: 14 },
  { source: 'Social', value: 10 },
  { source: 'Direct', value: 6 }
] as const;

export const VENDOR_TOP_PRODUCTS = [
  { name: 'Linen Blazer', revenue: 8420, units: 124 },
  { name: 'Silk Scarf', revenue: 6180, units: 206 },
  { name: 'Leather Tote', revenue: 5920, units: 74 },
  { name: 'Cashmere Wrap', revenue: 4810, units: 96 },
  { name: 'Ceramic Vase Set', revenue: 3240, units: 108 }
] as const;

export const VENDOR_RECENT_ORDERS = [
  {
    id: 'LX-9281',
    customer: 'Sarah Mitchell',
    total: 284,
    status: 'processing',
    date: '2 min ago'
  },
  {
    id: 'LX-9280',
    customer: 'David Kim',
    total: 92.5,
    status: 'shipped',
    date: '18 min ago'
  },
  {
    id: 'LX-9279',
    customer: 'Amira Lopez',
    total: 310,
    status: 'delivered',
    date: '1 hr ago'
  },
  {
    id: 'LX-9278',
    customer: 'Tom Richards',
    total: 156,
    status: 'pending',
    date: '2 hr ago'
  },
  {
    id: 'LX-9277',
    customer: 'Elena Park',
    total: 428,
    status: 'processing',
    date: '3 hr ago'
  }
] as const;

export const VENDOR_ACTIVITY = [
  { id: '1', type: 'order', message: 'New order #LX-9281 received', time: '2m ago' },
  { id: '2', type: 'review', message: '5-star review on Linen Blazer', time: '14m ago' },
  { id: '3', type: 'stock', message: 'Low stock alert: Silk Scarf (12 left)', time: '1h ago' },
  { id: '4', type: 'payout', message: 'Payout of $9,210.00 initiated', time: '3h ago' },
  { id: '5', type: 'message', message: 'New message from David Kim', time: '4h ago' }
] as const;

export const VENDOR_MOCK_ORDERS = [
  {
    id: 'LX-9281',
    customer: 'Sarah Mitchell',
    email: 'sarah@example.com',
    items: 3,
    total: 284,
    status: 'processing',
    payment: 'paid',
    date: '2026-06-17',
    channel: 'Marketplace'
  },
  {
    id: 'LX-9280',
    customer: 'David Kim',
    email: 'david@example.com',
    items: 1,
    total: 92.5,
    status: 'shipped',
    payment: 'paid',
    date: '2026-06-17',
    channel: 'Marketplace'
  },
  {
    id: 'LX-9279',
    customer: 'Amira Lopez',
    email: 'amira@example.com',
    items: 2,
    total: 310,
    status: 'delivered',
    payment: 'paid',
    date: '2026-06-16',
    channel: 'Storefront'
  },
  {
    id: 'LX-9278',
    customer: 'Tom Richards',
    email: 'tom@example.com',
    items: 1,
    total: 156,
    status: 'pending',
    payment: 'pending',
    date: '2026-06-16',
    channel: 'Marketplace'
  },
  {
    id: 'LX-9277',
    customer: 'Elena Park',
    email: 'elena@example.com',
    items: 4,
    total: 428,
    status: 'processing',
    payment: 'paid',
    date: '2026-06-15',
    channel: 'Marketplace'
  },
  {
    id: 'LX-9276',
    customer: 'James Okonkwo',
    email: 'james@example.com',
    items: 2,
    total: 198,
    status: 'refund_requested',
    payment: 'paid',
    date: '2026-06-15',
    channel: 'Storefront'
  }
] as const;

export const VENDOR_MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Linen Blazer',
    sku: 'LN-BLZ-001',
    price: 189,
    stock: 42,
    status: 'active',
    category: 'Apparel',
    image: null
  },
  {
    id: 'p2',
    name: 'Silk Scarf',
    sku: 'SK-SCF-014',
    price: 68,
    stock: 12,
    status: 'active',
    category: 'Accessories',
    image: null
  },
  {
    id: 'p3',
    name: 'Leather Tote',
    sku: 'LT-TOT-008',
    price: 245,
    stock: 28,
    status: 'active',
    category: 'Accessories',
    image: null
  },
  {
    id: 'p4',
    name: 'Cashmere Wrap',
    sku: 'CW-WRP-003',
    price: 128,
    stock: 0,
    status: 'draft',
    category: 'Apparel',
    image: null
  },
  {
    id: 'p5',
    name: 'Ceramic Vase Set',
    sku: 'CV-SET-021',
    price: 84,
    stock: 67,
    status: 'active',
    category: 'Home',
    image: null
  },
  {
    id: 'p6',
    name: 'Rose Body Oil',
    sku: 'RB-OIL-007',
    price: 42,
    stock: 156,
    status: 'archived',
    category: 'Beauty',
    image: null
  }
] as const;

export const VENDOR_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'New order #LX-9281',
    body: 'Sarah Mitchell placed an order for $284.00',
    time: '2m ago',
    read: false
  },
  {
    id: 'n2',
    title: 'Low stock warning',
    body: 'Silk Scarf is down to 12 units',
    time: '1h ago',
    read: false
  },
  {
    id: 'n3',
    title: 'Payout scheduled',
    body: '$12,840.00 will deposit on Friday',
    time: '3h ago',
    read: true
  }
] as const;
