import type { SaleEvent, SaleEventType } from './sales-store';

const FIRST_NAMES = [
  'Alice',
  'Bob',
  'Carlos',
  'Diana',
  'Ethan',
  'Fiona',
  'George',
  'Hannah',
  'Ivan',
  'Julia',
  'Kevin',
  'Luna',
  'Marcus',
  'Nina',
  'Oscar',
  'Petra',
  'Quinn',
  'Rachel',
  'Sam',
  'Tina'
];
const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Wilson',
  'Moore'
];

const EVENT_TEMPLATES = {
  new_order: (name: string, order: string, amount: number) => ({
    title: `New order from ${name}`,
    subtitle: `${order} · $${amount.toFixed(2)}`
  }),
  status_change: (name: string, order: string) => ({
    title: `Order ${order} updated`,
    subtitle: `${name}'s order moved to processing`
  }),
  payment: (name: string, order: string, amount: number) => ({
    title: `Payment received`,
    subtitle: `${name} paid $${amount.toFixed(2)} for ${order}`
  }),
  cancellation: (name: string, order: string) => ({
    title: `Order cancelled`,
    subtitle: `${name} cancelled ${order}`
  }),
  refund: (name: string, order: string, amount: number) => ({
    title: `Refund issued`,
    subtitle: `$${amount.toFixed(2)} refunded to ${name} · ${order}`
  }),
  shipment: (name: string, order: string) => ({
    title: `Order shipped`,
    subtitle: `${order} for ${name} is on its way`
  })
};

let idCounter = 1000;

/** Local-only simulator used when NEXT_PUBLIC_SALES_FEED_MOCK=true. */
export function generateEvent(): SaleEvent {
  const types: SaleEventType[] = [
    'new_order',
    'new_order',
    'new_order',
    'payment',
    'status_change',
    'shipment',
    'cancellation',
    'refund'
  ];
  const type = types[Math.floor(Math.random() * types.length)] ?? 'new_order';
  const name = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
  const order = `ORD-${String(Math.floor(Math.random() * 90000) + 10000)}`;
  const amount = parseFloat((Math.random() * 800 + 20).toFixed(2));
  const tpl = EVENT_TEMPLATES[type](name, order, amount);
  return {
    id: String(idCounter++),
    type,
    title: tpl.title,
    subtitle: tpl.subtitle,
    amount,
    timestamp: Date.now()
  };
}

export function generateRevenueSnapshot() {
  const now = new Date();
  return {
    time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
    revenue: parseFloat((Math.random() * 3000 + 500).toFixed(2)),
    orders: Math.floor(Math.random() * 30 + 5)
  };
}
