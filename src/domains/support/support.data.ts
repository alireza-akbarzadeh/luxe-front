import {
  IconCash,
  IconClock,
  IconGlobe,
  IconPackage,
  IconPackageExport,
  IconRotateClockwise2,
  IconShieldCheck,
  IconTruck
} from '@tabler/icons-react';

const OrderTrackingStatuses = [
  {
    icon: IconPackage,
    title: 'Order Confirmed',
    description: 'We received your order and shared it with the vendor. Usually within minutes.'
  },
  {
    icon: IconClock,
    title: 'Preparing',
    description: 'The vendor is quality-checking and packaging your items. Typically 1–2 days.'
  },
  {
    icon: IconTruck,
    title: 'In Transit',
    description: 'Your package is on the way. You will receive a tracking number by email.'
  },
  {
    icon: IconShieldCheck,
    title: 'Delivered',
    description: 'Signed and delivered. Your 30-day return window starts now.'
  }
] as const;

const ShippingOptions = [
  {
    icon: IconTruck,
    title: 'Standard',
    description: '3–5 business days. Free on orders over $150. Tracked end-to-end.'
  },
  {
    icon: IconClock,
    title: 'Express',
    description: '1–2 business days. Available in 60+ countries. From $19.'
  },
  {
    icon: IconShieldCheck,
    title: 'Signature on Delivery',
    description: 'Automatic for orders above $500. Adult signature required.'
  },
  {
    icon: IconGlobe,
    title: 'International',
    description: 'DDP shipping to 90+ countries — duties and taxes included at checkout.'
  }
] as const;

const Perks = [
  {
    icon: IconRotateClockwise2,
    title: '30-Day Window',
    description: 'Return any item within 30 days of delivery, no questions asked.'
  },
  {
    icon: IconPackageExport,
    title: 'Free Pickup',
    description: 'We arrange free carrier pickup at your address or workplace.'
  },
  {
    icon: IconCash,
    title: 'Fast Refunds',
    description: 'Refunds land within 5 business days of items reaching the vendor.'
  },
  {
    icon: IconShieldCheck,
    title: 'Easy Exchanges',
    description: 'Swap size, color or item — we price-match and ship the new one.'
  }
] as const;

export { OrderTrackingStatuses, Perks, ShippingOptions };
