import type { Order } from '@/domains/orders/orders-types';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord_001',
    order_number: 'ORD-2024-10041',
    customer_name: 'Sophia Bennett',
    customer_email: 'sophia.bennett@example.com',
    customer_avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    status: 'Delivered',
    payment_status: 'Paid',
    payment_method: 'Visa •••• 4242',
    subtotal: 389.0,
    discount: 30.0,
    shipping_cost: 0,
    tax: 35.92,
    total: 394.92,
    currency: 'USD',
    channel: 'Web',
    priority: 'Normal',
    tracking_number: 'UPS1Z999AA10123456784',
    carrier: 'UPS',
    estimated_delivery: '2024-11-28',
    ordered_at: '2024-11-20T10:23:00Z',
    notes: 'Customer requested gift wrapping.',
    tags: ['VIP', 'Gift'],
    items: [
      {
        product_id: 'p1',
        name: 'Wireless ANC Headphones',
        sku: 'HDPH-ANC-BLK',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
        quantity: 1,
        unit_price: 249.0,
        total_price: 249.0,
        category: 'Electronics'
      },
      {
        product_id: 'p2',
        name: 'Leather Phone Case',
        sku: 'CASE-LTH-GRY',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=80&h=80&fit=crop',
        quantity: 2,
        unit_price: 49.0,
        total_price: 98.0,
        category: 'Accessories'
      },
      {
        product_id: 'p3',
        name: 'USB-C Hub 7-in-1',
        sku: 'HUB-USBC-7',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80&h=80&fit=crop',
        quantity: 1,
        unit_price: 42.0,
        total_price: 42.0,
        category: 'Electronics'
      }
    ],
    shipping_address: {
      line1: '142 Maple Street',
      line2: 'Apt 3B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    billing_address: {
      line1: '142 Maple Street',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States'
    },
    timeline: [
      {
        event: 'Order Placed',
        description: 'Order received via web checkout',
        timestamp: '2024-11-20T10:23:00Z',
        actor: 'Customer'
      },
      {
        event: 'Payment Confirmed',
        description: 'Visa payment of $394.92 authorized',
        timestamp: '2024-11-20T10:24:12Z',
        actor: 'System'
      },
      {
        event: 'Processing',
        description: 'Order assigned to warehouse team',
        timestamp: '2024-11-20T11:00:00Z',
        actor: 'Warehouse'
      },
      {
        event: 'Shipped',
        description: 'Handed to UPS — tracking UPS1Z999AA10123456784',
        timestamp: '2024-11-21T14:30:00Z',
        actor: 'Warehouse'
      },
      {
        event: 'Out for Delivery',
        description: 'Package is out for delivery',
        timestamp: '2024-11-28T08:15:00Z',
        actor: 'UPS'
      },
      {
        event: 'Delivered',
        description: 'Package delivered and signed by recipient',
        timestamp: '2024-11-28T14:02:00Z',
        actor: 'UPS'
      }
    ]
  },
  {
    id: 'ord_002',
    order_number: 'ORD-2024-10042',
    customer_name: 'Marcus Delray',
    customer_email: 'marcus.delray@example.com',
    customer_avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    status: 'Processing',
    payment_status: 'Paid',
    payment_method: 'PayPal',
    subtotal: 1250.0,
    discount: 0,
    shipping_cost: 15.0,
    tax: 103.25,
    total: 1368.25,
    currency: 'USD',
    channel: 'Mobile App',
    priority: 'High',
    tracking_number: '',
    carrier: 'FedEx',
    estimated_delivery: '2024-12-05',
    ordered_at: '2024-11-29T08:10:00Z',
    notes: '',
    tags: ['B2B', 'Bulk'],
    items: [
      {
        product_id: 'p4',
        name: 'Mechanical Keyboard TKL',
        sku: 'KB-MECH-TKL-BLU',
        image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=80&h=80&fit=crop',
        quantity: 5,
        unit_price: 180.0,
        total_price: 900.0,
        category: 'Peripherals'
      },
      {
        product_id: 'p5',
        name: 'Ergonomic Mouse',
        sku: 'MOU-ERG-WLS',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=80&h=80&fit=crop',
        quantity: 5,
        unit_price: 70.0,
        total_price: 350.0,
        category: 'Peripherals'
      }
    ],
    shipping_address: {
      line1: '890 Business Blvd',
      line2: 'Suite 400',
      city: 'Austin',
      state: 'TX',
      zip: '73301',
      country: 'United States'
    },
    billing_address: {
      line1: '890 Business Blvd',
      city: 'Austin',
      state: 'TX',
      zip: '73301',
      country: 'United States'
    },
    timeline: [
      {
        event: 'Order Placed',
        description: 'Bulk order received via mobile app',
        timestamp: '2024-11-29T08:10:00Z',
        actor: 'Customer'
      },
      {
        event: 'Payment Confirmed',
        description: 'PayPal payment of $1368.25 confirmed',
        timestamp: '2024-11-29T08:11:30Z',
        actor: 'System'
      },
      {
        event: 'Processing',
        description: 'Bulk order flagged for warehouse priority',
        timestamp: '2024-11-29T09:00:00Z',
        actor: 'System'
      }
    ]
  },
  {
    id: 'ord_003',
    order_number: 'ORD-2024-10043',
    customer_name: 'Aisha Patel',
    customer_email: 'aisha.patel@example.com',
    customer_avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    status: 'Cancelled',
    payment_status: 'Refunded',
    payment_method: 'Mastercard •••• 5555',
    subtotal: 79.0,
    discount: 0,
    shipping_cost: 9.99,
    tax: 7.17,
    total: 96.16,
    currency: 'USD',
    channel: 'Web',
    priority: 'Low',
    tracking_number: '',
    carrier: '',
    estimated_delivery: '',
    ordered_at: '2024-11-25T16:45:00Z',
    notes: 'Customer cancelled due to change of mind.',
    tags: [],
    items: [
      {
        product_id: 'p6',
        name: 'Desk Organizer Bamboo',
        sku: 'ORG-BAMB-NAT',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=80&h=80&fit=crop',
        quantity: 1,
        unit_price: 79.0,
        total_price: 79.0,
        category: 'Office'
      }
    ],
    shipping_address: {
      line1: '56 Birchwood Lane',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'United States'
    },
    billing_address: {
      line1: '56 Birchwood Lane',
      city: 'Chicago',
      state: 'IL',
      zip: '60601',
      country: 'United States'
    },
    timeline: [
      {
        event: 'Order Placed',
        description: 'Order received via web checkout',
        timestamp: '2024-11-25T16:45:00Z',
        actor: 'Customer'
      },
      {
        event: 'Payment Confirmed',
        description: 'Mastercard payment of $96.16 authorized',
        timestamp: '2024-11-25T16:46:00Z',
        actor: 'System'
      },
      {
        event: 'Cancelled',
        description: 'Customer requested cancellation',
        timestamp: '2024-11-26T09:20:00Z',
        actor: 'Customer'
      },
      {
        event: 'Refunded',
        description: 'Full refund of $96.16 issued to Mastercard',
        timestamp: '2024-11-26T09:30:00Z',
        actor: 'System'
      }
    ]
  },
  {
    id: 'ord_004',
    order_number: 'ORD-2024-10044',
    customer_name: 'Jordan Whitfield',
    customer_email: 'jordan.whitfield@example.com',
    customer_avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    status: 'Pending',
    payment_status: 'Unpaid',
    payment_method: 'Bank Transfer',
    subtotal: 2100.0,
    discount: 210.0,
    shipping_cost: 0,
    tax: 157.8,
    total: 2047.8,
    currency: 'USD',
    channel: 'Phone',
    priority: 'Urgent',
    tracking_number: '',
    carrier: 'DHL',
    estimated_delivery: '2024-12-10',
    ordered_at: '2024-11-30T12:00:00Z',
    notes: 'Awaiting bank transfer confirmation. Hold for 48h.',
    tags: ['VIP', 'B2B'],
    items: [
      {
        product_id: 'p7',
        name: '4K Monitor 32"',
        sku: 'MON-4K-32-BLK',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=80&h=80&fit=crop',
        quantity: 2,
        unit_price: 750.0,
        total_price: 1500.0,
        category: 'Electronics'
      },
      {
        product_id: 'p8',
        name: 'Monitor Stand Dual',
        sku: 'STD-DUA-BLK',
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=80&h=80&fit=crop',
        quantity: 2,
        unit_price: 120.0,
        total_price: 240.0,
        category: 'Accessories'
      },
      {
        product_id: 'p9',
        name: 'HDMI 2.1 Cable 3m',
        sku: 'CBL-HDMI21-3M',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop',
        quantity: 4,
        unit_price: 30.0,
        total_price: 120.0,
        category: 'Accessories'
      },
      {
        product_id: 'p5',
        name: 'Ergonomic Mouse',
        sku: 'MOU-ERG-WLS',
        image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=80&h=80&fit=crop',
        quantity: 2,
        unit_price: 70.0,
        total_price: 140.0,
        category: 'Peripherals'
      },
      {
        product_id: 'p10',
        name: 'Cable Management Kit',
        sku: 'MGT-KIT-PRO',
        image: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=80&h=80&fit=crop',
        quantity: 1,
        unit_price: 100.0,
        total_price: 100.0,
        category: 'Accessories'
      }
    ],
    shipping_address: {
      line1: '300 Corporate Way',
      line2: 'Floor 12',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'United States'
    },
    billing_address: {
      line1: '300 Corporate Way',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'United States'
    },
    timeline: [
      {
        event: 'Order Placed',
        description: 'Phone order created by sales rep',
        timestamp: '2024-11-30T12:00:00Z',
        actor: 'Sales Rep'
      },
      {
        event: 'Awaiting Payment',
        description: 'Bank transfer instructions sent to customer',
        timestamp: '2024-11-30T12:05:00Z',
        actor: 'System'
      }
    ]
  },
  {
    id: 'ord_005',
    order_number: 'ORD-2024-10045',
    customer_name: 'Elena Vasquez',
    customer_email: 'elena.vasquez@example.com',
    customer_avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
    status: 'Shipped',
    payment_status: 'Paid',
    payment_method: 'Apple Pay',
    subtotal: 540.0,
    discount: 54.0,
    shipping_cost: 12.0,
    tax: 43.56,
    total: 541.56,
    currency: 'USD',
    channel: 'Mobile App',
    priority: 'Normal',
    tracking_number: 'FEDEX7489302847563',
    carrier: 'FedEx',
    estimated_delivery: '2024-12-03',
    ordered_at: '2024-11-27T09:30:00Z',
    notes: '',
    tags: ['Returning Customer'],
    items: [
      {
        product_id: 'p11',
        name: 'Smart Watch Series 9',
        sku: 'SWT-S9-SLV',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop',
        quantity: 1,
        unit_price: 399.0,
        total_price: 399.0,
        category: 'Wearables'
      },
      {
        product_id: 'p12',
        name: 'Watch Band Milanese',
        sku: 'WBD-MIL-SLV',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop',
        quantity: 3,
        unit_price: 47.0,
        total_price: 141.0,
        category: 'Accessories'
      }
    ],
    shipping_address: {
      line1: '78 Sunset Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90028',
      country: 'United States'
    },
    billing_address: {
      line1: '78 Sunset Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90028',
      country: 'United States'
    },
    timeline: [
      {
        event: 'Order Placed',
        description: 'Order received via mobile app',
        timestamp: '2024-11-27T09:30:00Z',
        actor: 'Customer'
      },
      {
        event: 'Payment Confirmed',
        description: 'Apple Pay payment of $541.56 confirmed',
        timestamp: '2024-11-27T09:30:45Z',
        actor: 'System'
      },
      {
        event: 'Processing',
        description: 'Order picked and packed',
        timestamp: '2024-11-27T14:00:00Z',
        actor: 'Warehouse'
      },
      {
        event: 'Shipped',
        description: 'Dispatched via FedEx — FEDEX7489302847563',
        timestamp: '2024-11-28T10:00:00Z',
        actor: 'Warehouse'
      }
    ]
  },
  {
    id: 'ord_006',
    order_number: 'ORD-2024-10046',
    customer_name: 'Ryan Cho',
    customer_email: 'ryan.cho@example.com',
    customer_avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face',
    status: 'Fulfilled',
    payment_status: 'Paid',
    payment_method: 'Visa •••• 8891',
    subtotal: 199.0,
    discount: 0,
    shipping_cost: 0,
    tax: 15.92,
    total: 214.92,
    currency: 'USD',
    channel: 'Web',
    priority: 'Normal',
    tracking_number: 'DHL1234567890',
    carrier: 'DHL',
    estimated_delivery: '2024-12-01',
    ordered_at: '2024-11-22T14:00:00Z',
    notes: '',
    tags: [],
    items: [
      {
        product_id: 'p13',
        name: 'Noise Cancelling Earbuds',
        sku: 'EAR-NC-WHT',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=80&h=80&fit=crop',
        quantity: 1,
        unit_price: 199.0,
        total_price: 199.0,
        category: 'Electronics'
      }
    ],
    shipping_address: {
      line1: '22 Pine Ave',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'United States'
    },
    billing_address: {
      line1: '22 Pine Ave',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'United States'
    },
    timeline: [
      {
        event: 'Order Placed',
        description: 'Order received via web checkout',
        timestamp: '2024-11-22T14:00:00Z',
        actor: 'Customer'
      },
      {
        event: 'Payment Confirmed',
        description: 'Visa payment of $214.92 authorized',
        timestamp: '2024-11-22T14:01:00Z',
        actor: 'System'
      },
      {
        event: 'Processing',
        description: 'Order picked',
        timestamp: '2024-11-23T09:00:00Z',
        actor: 'Warehouse'
      },
      {
        event: 'Fulfilled',
        description: 'All items verified and packed',
        timestamp: '2024-11-23T11:30:00Z',
        actor: 'Warehouse'
      },
      {
        event: 'Shipped',
        description: 'Dispatched via DHL',
        timestamp: '2024-11-24T08:00:00Z',
        actor: 'Warehouse'
      }
    ]
  },
  {
    id: 'ord_007',
    order_number: 'ORD-2024-10047',
    customer_name: 'Priya Nair',
    customer_email: 'priya.nair@example.com',
    customer_avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face',
    status: 'Refunded',
    payment_status: 'Refunded',
    payment_method: 'Stripe',
    subtotal: 459.0,
    discount: 0,
    shipping_cost: 19.99,
    tax: 38.32,
    total: 517.31,
    currency: 'USD',
    channel: 'Web',
    priority: 'High',
    tracking_number: '',
    carrier: '',
    estimated_delivery: '',
    ordered_at: '2024-11-18T11:00:00Z',
    notes: 'Item arrived damaged. Full refund issued.',
    tags: ['Damaged', 'Priority Support'],
    items: [
      {
        product_id: 'p14',
        name: 'Standing Desk Electric 160cm',
        sku: 'DSK-ELC-160-WHT',
        image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=80&h=80&fit=crop',
        quantity: 1,
        unit_price: 459.0,
        total_price: 459.0,
        category: 'Furniture'
      }
    ],
    shipping_address: {
      line1: '91 Oak Drive',
      city: 'Boston',
      state: 'MA',
      zip: '02101',
      country: 'United States'
    },
    billing_address: {
      line1: '91 Oak Drive',
      city: 'Boston',
      state: 'MA',
      zip: '02101',
      country: 'United States'
    },
    timeline: [
      {
        event: 'Order Placed',
        description: 'Order received',
        timestamp: '2024-11-18T11:00:00Z',
        actor: 'Customer'
      },
      {
        event: 'Payment Confirmed',
        description: 'Stripe payment confirmed',
        timestamp: '2024-11-18T11:01:00Z',
        actor: 'System'
      },
      {
        event: 'Shipped',
        description: 'Large item shipped via freight carrier',
        timestamp: '2024-11-20T10:00:00Z',
        actor: 'Warehouse'
      },
      {
        event: 'Delivered',
        description: 'Delivered but reported damaged',
        timestamp: '2024-11-25T15:00:00Z',
        actor: 'Carrier'
      },
      {
        event: 'Return Initiated',
        description: 'Customer reported damage, return approved',
        timestamp: '2024-11-26T10:00:00Z',
        actor: 'Support'
      },
      {
        event: 'Refunded',
        description: 'Full refund of $517.31 processed',
        timestamp: '2024-11-27T09:00:00Z',
        actor: 'System'
      }
    ]
  },
  {
    id: 'ord_008',
    order_number: 'ORD-2024-10048',
    customer_name: 'Connor Walsh',
    customer_email: 'connor.walsh@example.com',
    customer_avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    status: 'Processing',
    payment_status: 'Partial',
    payment_method: 'Split: Card + Store Credit',
    subtotal: 899.0,
    discount: 89.9,
    shipping_cost: 0,
    tax: 65.53,
    total: 874.63,
    currency: 'USD',
    channel: 'Web',
    priority: 'Normal',
    tracking_number: '',
    carrier: 'USPS',
    estimated_delivery: '2024-12-07',
    ordered_at: '2024-11-30T17:22:00Z',
    notes: 'Split payment: $600 card + $274.63 store credit.',
    tags: ['Store Credit'],
    items: [
      {
        product_id: 'p15',
        name: 'Gaming Chair Pro',
        sku: 'CHR-GAM-PRO-BLK',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80&fit=crop',
        quantity: 1,
        unit_price: 699.0,
        total_price: 699.0,
        category: 'Furniture'
      },
      {
        product_id: 'p16',
        name: 'Lumbar Support Pillow',
        sku: 'PIL-LMB-GRY',
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=80&h=80&fit=crop',
        quantity: 2,
        unit_price: 100.0,
        total_price: 200.0,
        category: 'Accessories'
      }
    ],
    shipping_address: {
      line1: '33 Harbor View',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'United States'
    },
    billing_address: {
      line1: '33 Harbor View',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
      country: 'United States'
    },
    timeline: [
      {
        event: 'Order Placed',
        description: 'Order placed with split payment',
        timestamp: '2024-11-30T17:22:00Z',
        actor: 'Customer'
      },
      {
        event: 'Payment Partial',
        description: '$600 card charge + $274.63 store credit applied',
        timestamp: '2024-11-30T17:23:00Z',
        actor: 'System'
      },
      {
        event: 'Processing',
        description: 'Order in warehouse queue',
        timestamp: '2024-11-30T18:00:00Z',
        actor: 'Warehouse'
      }
    ]
  }
];

export const ORDER_MONTHLY_DATA = [
  { month: 'Jun', orders: 142, revenue: 18420, returns: 8 },
  { month: 'Jul', orders: 189, revenue: 24810, returns: 12 },
  { month: 'Aug', orders: 201, revenue: 28930, returns: 9 },
  { month: 'Sep', orders: 178, revenue: 23100, returns: 15 },
  { month: 'Oct', orders: 224, revenue: 31450, returns: 11 },
  { month: 'Nov', orders: 267, revenue: 38920, returns: 7 }
];

export const ORDER_STATUS_DIST = [
  { name: 'Delivered', value: 38, fill: '#22c55e' },
  { name: 'Shipped', value: 22, fill: '#3b82f6' },
  { name: 'Processing', value: 18, fill: '#f59e0b' },
  { name: 'Pending', value: 12, fill: '#8b5cf6' },
  { name: 'Cancelled', value: 6, fill: '#ef4444' },
  { name: 'Refunded', value: 4, fill: '#6b7280' }
];

export const TOP_PRODUCTS = [
  { name: 'Wireless ANC Headphones', revenue: 12450, units: 50, trend: +12 },
  { name: 'Mechanical Keyboard TKL', revenue: 9800, units: 55, trend: +8 },
  { name: 'Smart Watch Series 9', revenue: 8750, units: 22, trend: +22 },
  { name: '4K Monitor 32"', revenue: 7500, units: 10, trend: -3 },
  { name: 'Ergonomic Mouse', revenue: 5600, units: 80, trend: +5 }
];

// Constants
export const STATUS_OPTIONS = [
  'Pending',
  'Processing',
  'Fulfilled',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded'
] as const;

export const PAYMENT_OPTIONS = ['Paid', 'Unpaid', 'Refunded', 'Partial'] as const;
export const CHANNEL_OPTIONS = ['Web', 'Mobile App', 'Phone'] as const;
export const PRIORITY_OPTIONS = ['Low', 'Normal', 'High', 'Urgent'] as const;
