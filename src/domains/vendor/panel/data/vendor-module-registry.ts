export interface VendorModuleSection {
  title: string;
  description: string;
  features: string[];
}

export interface VendorModuleConfig {
  id: string;
  title: string;
  description: string;
  sections: VendorModuleSection[];
  quickActions?: { label: string; href?: string }[];
}

export const VENDOR_MODULE_REGISTRY: Record<string, VendorModuleConfig> = {
  categories: {
    id: 'categories',
    title: 'Categories',
    description: 'Organize your catalog with a flexible category tree, attributes, and SEO.',
    sections: [
      {
        title: 'Category tree',
        description: 'Hierarchical categories with drag-and-drop ordering.',
        features: ['Nested categories', 'Drag & drop reorder', 'Category icons', 'Featured images']
      },
      {
        title: 'Attributes & filters',
        description: 'Define filterable attributes per category.',
        features: ['Custom attributes', 'Filter presets', 'Variant mapping', 'SEO metadata']
      }
    ],
    quickActions: [{ label: 'Add category' }, { label: 'Import taxonomy' }]
  },
  inventory: {
    id: 'inventory',
    title: 'Inventory',
    description: 'Multi-location stock management with alerts and audit history.',
    sections: [
      {
        title: 'Warehouses',
        description: 'Track stock across multiple fulfillment locations.',
        features: [
          'Multiple locations',
          'Stock transfers',
          'Reserved inventory',
          'Incoming stock'
        ]
      },
      {
        title: 'Stock control',
        description: 'Adjustments, barcodes, and low-stock alerts.',
        features: ['Stock history', 'Barcode scanner', 'Low stock alerts', 'Damaged inventory']
      }
    ],
    quickActions: [{ label: 'Adjust stock' }, { label: 'Transfer inventory' }]
  },
  customers: {
    id: 'customers',
    title: 'Customers',
    description: 'Understand buyer behavior, lifetime value, and support history.',
    sections: [
      {
        title: 'Customer profiles',
        description: 'Unified view of purchases, addresses, and notes.',
        features: ['Purchase history', 'Lifetime value', 'Addresses', 'Wishlist']
      },
      {
        title: 'Segments',
        description: 'Group customers for targeted campaigns.',
        features: ['Custom segments', 'Loyalty status', 'Support history', 'Internal notes']
      }
    ],
    quickActions: [{ label: 'Export customers' }, { label: 'Create segment' }]
  },
  messages: {
    id: 'messages',
    title: 'Messages',
    description: 'Centralized inbox for buyer conversations and quick replies.',
    sections: [
      {
        title: 'Inbox',
        description: 'Threaded conversations tied to orders.',
        features: ['Unread queue', 'Quick replies', 'Templates', 'Attachments']
      },
      {
        title: 'Collaboration',
        description: 'Internal notes and team handoffs.',
        features: ['Internal notes', 'Assignment', 'Notifications', 'Conversation history']
      }
    ],
    quickActions: [{ label: 'New template' }]
  },
  reviews: {
    id: 'reviews',
    title: 'Reviews',
    description: 'Monitor, respond to, and analyze product and store reviews.',
    sections: [
      {
        title: 'Moderation',
        description: 'Pending and published review queues.',
        features: ['Pending reviews', 'Reply to review', 'Report abuse', 'Media reviews']
      },
      {
        title: 'Analytics',
        description: 'Ratings breakdown and sentiment trends.',
        features: ['Ratings breakdown', 'Review velocity', 'Product scores', 'Export reports']
      }
    ],
    quickActions: [{ label: 'Request reviews' }]
  },
  discounts: {
    id: 'discounts',
    title: 'Discounts & Promotions',
    description: 'Coupons, flash sales, bundles, and scheduled promotions.',
    sections: [
      {
        title: 'Promotions',
        description: 'Flexible discount types with usage limits.',
        features: ['Coupons', 'Flash sales', 'BOGO', 'Volume discounts', 'Free shipping']
      },
      {
        title: 'Scheduling',
        description: 'Plan campaigns with start and end dates.',
        features: ['Scheduled promos', 'Usage limits', 'Customer segments', 'Promotion analytics']
      }
    ],
    quickActions: [{ label: 'Create coupon' }, { label: 'Create flash sale' }]
  },
  marketing: {
    id: 'marketing',
    title: 'Marketing',
    description: 'Email, SMS, push campaigns, and abandoned cart recovery.',
    sections: [
      {
        title: 'Campaigns',
        description: 'Multi-channel outreach with performance tracking.',
        features: ['Email campaigns', 'SMS', 'Push notifications', 'Abandoned cart recovery']
      },
      {
        title: 'Programs',
        description: 'Affiliate, referral, and influencer tools.',
        features: ['Affiliate program', 'Referral links', 'Influencer campaigns', 'Campaign analytics']
      }
    ],
    quickActions: [{ label: 'New campaign' }, { label: 'Abandoned cart flow' }]
  },
  analytics: {
    id: 'analytics',
    title: 'Analytics',
    description: 'Deep insights into revenue, traffic, and customer behavior.',
    sections: [
      {
        title: 'Performance',
        description: 'Core commerce metrics with date filters.',
        features: ['Revenue & profit', 'Conversion rate', 'Traffic sources', 'Refund rate']
      },
      {
        title: 'Intelligence',
        description: 'Best performers and forecasting.',
        features: [
          'Best products',
          'Best customers',
          'Top locations',
          'Forecasting',
          'Custom reports'
        ]
      }
    ],
    quickActions: [{ label: 'Export report' }, { label: 'Save view' }]
  },
  finance: {
    id: 'finance',
    title: 'Finance',
    description: 'Revenue, expenses, fees, taxes, and transaction history.',
    sections: [
      {
        title: 'Overview',
        description: 'Financial summary and wallet balance.',
        features: ['Revenue', 'Expenses', 'Fees & taxes', 'Wallet balance']
      },
      {
        title: 'Documents',
        description: 'Invoices and statements for accounting.',
        features: ['Invoices', 'Statements', 'Transaction history', 'Financial summary']
      }
    ],
    quickActions: [{ label: 'Download statement' }]
  },
  payouts: {
    id: 'payouts',
    title: 'Payouts',
    description: 'Upcoming and completed payouts with bank account management.',
    sections: [
      {
        title: 'Payouts',
        description: 'Track withdrawal schedule and history.',
        features: ['Upcoming payout', 'Completed payouts', 'Withdrawal requests', 'Tax documents']
      },
      {
        title: 'Payment methods',
        description: 'Connected bank accounts and payment rails.',
        features: ['Bank accounts', 'Payment methods', 'Payout invoices', 'Settlement calendar']
      }
    ],
    quickActions: [{ label: 'Add bank account' }, { label: 'Request withdrawal' }]
  },
  shipping: {
    id: 'shipping',
    title: 'Shipping',
    description: 'Shipping zones, carriers, rates, and label generation.',
    sections: [
      {
        title: 'Configuration',
        description: 'Methods, zones, and packaging defaults.',
        features: ['Shipping methods', 'Shipping zones', 'Delivery partners', 'Packaging settings']
      },
      {
        title: 'Fulfillment',
        description: 'Labels, tracking, and pickup requests.',
        features: ['Label generation', 'Tracking sync', 'Pickup requests', 'Shipping rules']
      }
    ],
    quickActions: [{ label: 'Print labels' }, { label: 'Add shipping zone' }]
  },
  returns: {
    id: 'returns',
    title: 'Returns & Refunds',
    description: 'Return requests, approval workflows, and refund history.',
    sections: [
      {
        title: 'Requests',
        description: 'Manage RMAs and refund approvals.',
        features: ['Return requests', 'Refund requests', 'Approval workflow', 'Return reasons']
      },
      {
        title: 'Resolution',
        description: 'Inspection, replacements, and history.',
        features: ['Inspection status', 'Replacement orders', 'Refund history', 'Restocking']
      }
    ],
    quickActions: [{ label: 'Review returns' }]
  },
  support: {
    id: 'support',
    title: 'Support Center',
    description: 'Tickets, live chat, and seller knowledge base.',
    sections: [
      {
        title: 'Tickets',
        description: 'Track issues with marketplace support.',
        features: ['Support tickets', 'Live chat', 'Feature requests', 'Bug reports']
      },
      {
        title: 'Resources',
        description: 'Announcements and self-service help.',
        features: ['Knowledge base', 'Announcements', 'Policy updates', 'Seller community']
      }
    ],
    quickActions: [{ label: 'Open ticket' }, { label: 'Browse help' }]
  },
  reports: {
    id: 'reports',
    title: 'Reports',
    description: 'Scheduled and on-demand exports across every business dimension.',
    sections: [
      {
        title: 'Standard reports',
        description: 'Pre-built reports for common needs.',
        features: [
          'Sales report',
          'Product report',
          'Customer report',
          'Inventory report',
          'Tax report'
        ]
      },
      {
        title: 'Export & schedule',
        description: 'PDF, Excel, and automated delivery.',
        features: ['Export PDF', 'Export Excel', 'Custom reports', 'Scheduled reports']
      }
    ],
    quickActions: [{ label: 'Generate report' }, { label: 'Schedule export' }]
  },
  team: {
    id: 'team',
    title: 'Team Members',
    description: 'Invite staff, assign roles, and audit activity.',
    sections: [
      {
        title: 'Access control',
        description: 'Granular permissions for your team.',
        features: ['Invite members', 'Roles', 'Permissions', '2FA enforcement']
      },
      {
        title: 'Security',
        description: 'API keys and audit trails.',
        features: ['Activity log', 'API keys', 'Audit logs', 'Session management']
      }
    ],
    quickActions: [{ label: 'Invite member' }, { label: 'Manage roles' }]
  },
  notifications: {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure alerts for orders, payments, inventory, and security.',
    sections: [
      {
        title: 'Channels',
        description: 'Email, push, and in-app notification preferences.',
        features: ['Orders', 'Payments', 'Reviews', 'Messages', 'Security alerts']
      },
      {
        title: 'Operations',
        description: 'Inventory and system notifications.',
        features: ['Low inventory', 'Marketing updates', 'System notifications', 'Digest schedule']
      }
    ],
    quickActions: [{ label: 'Test notification' }]
  },
  integrations: {
    id: 'integrations',
    title: 'Apps & Integrations',
    description: 'Connect payments, shipping, analytics, and automation tools.',
    sections: [
      {
        title: 'Popular apps',
        description: 'One-click integrations with leading platforms.',
        features: ['Stripe', 'PayPal', 'Google Analytics', 'Meta', 'Mailchimp', 'Zapier']
      },
      {
        title: 'Developer',
        description: 'Webhooks and API access for custom workflows.',
        features: ['Webhook management', 'API keys', 'Slack', 'Discord', 'Custom apps']
      }
    ],
    quickActions: [{ label: 'Browse app store' }, { label: 'Manage webhooks' }]
  },
  help: {
    id: 'help',
    title: 'Help Center',
    description: 'Seller guides, tutorials, and marketplace policies.',
    sections: [
      {
        title: 'Learn',
        description: 'Documentation and video tutorials.',
        features: ['Getting started', 'Product guides', 'Shipping help', 'Payout FAQ']
      },
      {
        title: 'Support',
        description: 'Contact seller success and browse policies.',
        features: ['Contact support', 'Policy library', 'Video tutorials', 'Community forum']
      }
    ],
    quickActions: [{ label: 'Contact support', href: '/contact' }, { label: 'View policies' }]
  }
};

export function getVendorModuleConfig(moduleId: string): VendorModuleConfig | undefined {
  return VENDOR_MODULE_REGISTRY[moduleId];
}
