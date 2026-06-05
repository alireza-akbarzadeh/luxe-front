import {
  IconAdjustmentsDollar,
  IconCreditCard,
  IconShoppingCart,
  IconUsers
} from '@tabler/icons-react';

import type { ChartConfig } from '@/components/ui/chart';

const revenueData = [
  { month: 'Jan', revenue: 18420, orders: 612, refunds: 420 },
  { month: 'Feb', revenue: 22130, orders: 701, refunds: 380 },
  { month: 'Mar', revenue: 25890, orders: 812, refunds: 510 },
  { month: 'Apr', revenue: 28430, orders: 904, refunds: 612 },
  { month: 'May', revenue: 32140, orders: 1021, refunds: 540 },
  { month: 'Jun', revenue: 36980, orders: 1184, refunds: 612 },
  { month: 'Jul', revenue: 41230, orders: 1290, refunds: 702 },
  { month: 'Aug', revenue: 44120, orders: 1372, refunds: 681 },
  { month: 'Sep', revenue: 39870, orders: 1241, refunds: 720 },
  { month: 'Oct', revenue: 46210, orders: 1483, refunds: 612 },
  { month: 'Nov', revenue: 52840, orders: 1702, refunds: 812 },
  { month: 'Dec', revenue: 61240, orders: 1924, refunds: 904 }
];

const trafficData = [
  { day: 'Mon', visitors: 2120, sessions: 3140 },
  { day: 'Tue', visitors: 2480, sessions: 3520 },
  { day: 'Wed', visitors: 2890, sessions: 3980 },
  { day: 'Thu', visitors: 3120, sessions: 4210 },
  { day: 'Fri', visitors: 3640, sessions: 4820 },
  { day: 'Sat', visitors: 4210, sessions: 5410 },
  { day: 'Sun', visitors: 3820, sessions: 4980 }
];

const categoryData = [
  { name: 'Apparel', value: 38, fill: 'var(--color-apparel)' },
  { name: 'Footwear', value: 24, fill: 'var(--color-footwear)' },
  { name: 'Accessories', value: 18, fill: 'var(--color-accessories)' },
  { name: 'Home', value: 12, fill: 'var(--color-home)' },
  { name: 'Beauty', value: 8, fill: 'var(--color-beauty)' }
];

const channelData = [
  { channel: 'Direct', value: 82, fill: 'var(--color-direct)' },
  { channel: 'Organic', value: 64, fill: 'var(--color-organic)' },
  { channel: 'Social', value: 48, fill: 'var(--color-social)' },
  { channel: 'Email', value: 36, fill: 'var(--color-email)' }
];

const topProducts = [
  {
    name: 'Linen Oversized Shirt',
    sku: 'MA-1042',
    sold: 412,
    revenue: 28840,
    stock: 64,
    trend: 12.4
  },
  { name: 'Suede Chelsea Boot', sku: 'FW-2210', sold: 318, revenue: 47700, stock: 22, trend: 8.1 },
  { name: 'Cashmere Crew Knit', sku: 'MA-1188', sold: 286, revenue: 34320, stock: 48, trend: -2.3 },
  {
    name: 'Leather Card Holder',
    sku: 'AC-3041',
    sold: 254,
    revenue: 10160,
    stock: 112,
    trend: 4.7
  },
  {
    name: 'Wide-Leg Wool Trouser',
    sku: 'MA-1320',
    sold: 211,
    revenue: 25320,
    stock: 31,
    trend: 6.2
  }
];

const recentOrders = [
  {
    id: '#10428',
    customer: 'Amélie Laurent',
    email: 'amelie@maison.co',
    total: 312.4,
    status: 'Paid'
  },
  {
    id: '#10427',
    customer: 'Owen Nakamura',
    email: 'owen.n@studio.io',
    total: 184.0,
    status: 'Fulfilled'
  },
  {
    id: '#10426',
    customer: 'Priya Shah',
    email: 'priya@northwind.dev',
    total: 76.5,
    status: 'Pending'
  },
  {
    id: '#10425',
    customer: 'Diego Romero',
    email: 'd.romero@field.co',
    total: 540.2,
    status: 'Paid'
  },
  {
    id: '#10424',
    customer: 'Hana Kobayashi',
    email: 'hana.k@atlas.io',
    total: 128.9,
    status: 'Refunded'
  }
];

const goals = [
  { label: 'Monthly revenue', value: 78, target: '$61.2k / $80k' },
  { label: 'New customers', value: 64, target: '1,284 / 2,000' },
  { label: 'Repeat purchase rate', value: 42, target: '42% / 60%' },
  { label: 'Avg. fulfilment time', value: 88, target: '1.2d / 1.0d' }
];

const revenueConfig = {
  revenue: { label: 'Revenue', color: 'hsl(221 83% 53%)' },
  orders: { label: 'Orders', color: 'hsl(142 71% 45%)' },
  refunds: { label: 'Refunds', color: 'hsl(0 84% 60%)' }
} satisfies ChartConfig;

const trafficConfig = {
  visitors: { label: 'Visitors', color: 'hsl(262 83% 58%)' },
  sessions: { label: 'Sessions', color: 'hsl(199 89% 48%)' }
} satisfies ChartConfig;

const categoryConfig = {
  apparel: { label: 'Apparel', color: 'hsl(221 83% 53%)' },
  footwear: { label: 'Footwear', color: 'hsl(262 83% 58%)' },
  accessories: { label: 'Accessories', color: 'hsl(199 89% 48%)' },
  home: { label: 'Home', color: 'hsl(142 71% 45%)' },
  beauty: { label: 'Beauty', color: 'hsl(31 90% 55%)' }
} satisfies ChartConfig;

const channelConfig = {
  direct: { label: 'Direct', color: 'hsl(221 83% 53%)' },
  organic: { label: 'Organic', color: 'hsl(142 71% 45%)' },
  social: { label: 'Social', color: 'hsl(262 83% 58%)' },
  email: { label: 'Email', color: 'hsl(31 90% 55%)' }
} satisfies ChartConfig;

const stats = [
  {
    label: 'Gross revenue',
    value: '$486,210',
    delta: 12.4,
    up: true,
    icon: IconAdjustmentsDollar,
    hint: 'vs. last 30 days'
  },
  {
    label: 'Orders',
    value: '14,628',
    delta: 8.2,
    up: true,
    icon: IconShoppingCart,
    hint: '1,924 this month'
  },
  {
    label: 'New customers',
    value: '3,184',
    delta: 4.6,
    up: true,
    icon: IconUsers,
    hint: '62% returning'
  },
  {
    label: 'Avg. order value',
    value: '$132.40',
    delta: -1.8,
    up: false,
    icon: IconCreditCard,
    hint: 'Target $140'
  }
];

export {
  categoryConfig,
  categoryData,
  channelConfig,
  channelData,
  goals,
  recentOrders,
  revenueConfig,
  revenueData,
  stats,
  topProducts,
  trafficConfig,
  trafficData
};
