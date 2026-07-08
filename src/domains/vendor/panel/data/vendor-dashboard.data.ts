export const VENDOR_STORES = [
  { id: 1, name: 'Maison Marchetti', slug: 'maison-marchetti' },
  { id: 2, name: 'Northline Supply', slug: 'northline-supply' },
  { id: 3, name: 'Cedar Studio', slug: 'cedar-studio' }
] as const;

export const VENDOR_DASHBOARD_STATS = {
  totalRevenue: 128490,
  totalRevenueChange: 18.2,
  netProfit: 42340,
  netProfitChange: 21.6,
  orders: 1248,
  ordersChange: 15.7,
  todayRevenue: 2840,
  todayRevenueChange: 12.4,
  monthlyRevenue: 48290,
  monthlyRevenueChange: 18.2,
  ordersToday: 34,
  ordersTodayChange: 8.1,
  pendingOrders: 12,
  products: 542,
  lowStock: 7,
  visitors: 28542,
  visitorsChange: 12.5,
  conversionRate: 3.87,
  conversionChange: 9.1,
  averageOrderValue: 76.4,
  aovChange: 2.1,
  refundRequests: 3,
  unreadMessages: 8,
  recentReviews: 24,
  newCustomers: 28,
  pendingPayout: 12840,
  storeRating: 4.8,
  storeHealth: 85,
  repeatCustomerRate: 42.6
} as const;

export const VENDOR_SALES_CHANNELS = [
  { channel: 'Direct', percent: 32, revenue: 31680, color: '#10b981' },
  { channel: 'Organic Search', percent: 28, revenue: 28420, color: '#3b82f6' },
  { channel: 'Social Media', percent: 19, revenue: 18932, color: '#a855f7' },
  { channel: 'Referral', percent: 13, revenue: 12640, color: '#f59e0b' },
  { channel: 'Email', percent: 8, revenue: 7430, color: '#ef4444' }
] as const;

export const VENDOR_INSIGHTS = [
  {
    id: '1',
    tone: 'emerald',
    title: 'Revenue is up 18.2%',
    description: 'Your store earned $16,430 yesterday — best day this month.'
  },
  {
    id: '2',
    tone: 'blue',
    title: 'Luxe Watch is trending',
    description: 'Top seller with 124 units this week. Consider restocking.'
  },
  {
    id: '3',
    tone: 'amber',
    title: 'Low stock alert',
    description: 'Silk Scarf has only 12 units left in inventory.'
  },
  {
    id: '4',
    tone: 'violet',
    title: 'High demand detected',
    description: 'Organic search traffic increased 12.5% this period.'
  }
] as const;

export const VENDOR_REVENUE_OVERVIEW = [
  { date: 'Jun 1', revenue: 8200 },
  { date: 'Jun 5', revenue: 9400 },
  { date: 'Jun 10', revenue: 11200 },
  { date: 'Jun 15', revenue: 13800 },
  { date: 'Jun 21', revenue: 16430 },
  { date: 'Jun 25', revenue: 14900 },
  { date: 'Jun 30', revenue: 17200 }
] as const;

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
  { name: 'Luxe Watch', revenue: 8420, units: 124 },
  { name: 'Premium Bag', revenue: 7180, units: 86 },
  { name: 'Silk Scarf', revenue: 6180, units: 206 },
  { name: 'Leather Tote', revenue: 5920, units: 74 },
  { name: 'Cashmere Wrap', revenue: 4810, units: 96 }
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
