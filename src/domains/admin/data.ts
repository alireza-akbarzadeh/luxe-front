import {
  IconActivity,
  IconAlertTriangle,
  IconArchive,
  IconBell,
  IconChartBar,
  IconCreditCard,
  IconDatabase,
  IconDeviceTv,
  IconFileText,
  IconFlag,
  IconGlobe,
  IconHeadphones,
  IconLayout,
  IconLayoutDashboard,
  IconLibrary,
  IconMusic,
  IconPlug,
  IconServer,
  IconSettings,
  IconShield,
  IconSparkles,
  IconUsers
} from '@tabler/icons-react';

export type Transaction = {
  id: string;
  user: string;
  email: string;
  phone: string;
  amount: number;
  status: 'Success' | 'Pending' | 'Failed';
  joinedDate: string;
  plan: 'Premium' | 'Standard' | 'Free';
  category: 'Movie' | 'Music' | 'Live';
  lastLogin: string;
  ipAddress: string;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  verified: boolean;
  location: string;
  subscriptionEnd: string;
  riskScore: number;
};

export const transactions: Transaction[] = [
  {
    id: '1',
    user: 'Alex Rivera',
    email: 'alex@verc.com',
    phone: '+1 555-0101',
    amount: 49.0,
    status: 'Success',
    joinedDate: '2023-12-01',
    plan: 'Premium',
    category: 'Movie',
    lastLogin: '2m ago',
    ipAddress: '192.168.1.1',
    device: 'Desktop',
    verified: true,
    location: 'New York, USA',
    subscriptionEnd: '2026-12-01',
    riskScore: 0.02
  },
  {
    id: '2',
    user: 'Jordan Smith',
    email: 'j@verc.com',
    phone: '+1 555-0102',
    amount: 12.5,
    status: 'Pending',
    joinedDate: '2024-01-10',
    plan: 'Standard',
    category: 'Music',
    lastLogin: '1h ago',
    ipAddress: '172.16.254.1',
    device: 'Mobile',
    verified: true,
    location: 'London, UK',
    subscriptionEnd: '2026-02-10',
    riskScore: 0.15
  },
  {
    id: '3',
    user: 'Casey Knight',
    email: 'c@verc.com',
    phone: '+1 555-0103',
    amount: 29.99,
    status: 'Success',
    joinedDate: '2024-01-15',
    plan: 'Premium',
    category: 'Live',
    lastLogin: 'Yesterday',
    ipAddress: '10.0.0.50',
    device: 'Tablet',
    verified: false,
    location: 'Berlin, DE',
    subscriptionEnd: '2026-07-15',
    riskScore: 0.05
  },
  {
    id: '4',
    user: 'Taylor Bell',
    email: 't@verc.com',
    phone: '+1 555-0104',
    amount: 99.0,
    status: 'Failed',
    joinedDate: '2023-11-20',
    plan: 'Free',
    category: 'Movie',
    lastLogin: '3d ago',
    ipAddress: '45.12.88.10',
    device: 'Desktop',
    verified: true,
    location: 'Tokyo, JP',
    subscriptionEnd: 'N/A',
    riskScore: 0.88
  },
  {
    id: '5',
    user: 'Morgan Lee',
    email: 'm@verc.com',
    phone: '+1 555-0105',
    amount: 150.0,
    status: 'Success',
    joinedDate: '2023-10-05',
    plan: 'Premium',
    category: 'Movie',
    lastLogin: 'Just now',
    ipAddress: '192.168.1.44',
    device: 'Mobile',
    verified: true,
    location: 'Paris, FR',
    subscriptionEnd: '2026-10-05',
    riskScore: 0.01
  },
  {
    id: '6',
    user: 'Jamie Fox',
    email: 'jamie@verc.com',
    phone: '+1 555-0106',
    amount: 75.5,
    status: 'Pending',
    joinedDate: '2024-02-20',
    plan: 'Standard',
    category: 'Music',
    lastLogin: '5m ago',
    ipAddress: '192.168.1.55',
    device: 'Desktop',
    verified: false,
    location: 'Madrid, ES',
    subscriptionEnd: '2026-08-20',
    riskScore: 0.12
  },
  {
    id: '7',
    user: 'Riley Chen',
    email: 'riley@verc.com',
    phone: '+1 555-0107',
    amount: 39.99,
    status: 'Success',
    joinedDate: '2023-09-12',
    plan: 'Premium',
    category: 'Live',
    lastLogin: '10m ago',
    ipAddress: '10.0.0.77',
    device: 'Tablet',
    verified: true,
    location: 'Sydney, AU',
    subscriptionEnd: '2026-09-12',
    riskScore: 0.03
  },
  {
    id: '8',
    user: 'Sam Patel',
    email: 'sam@verc.com',
    phone: '+1 555-0108',
    amount: 19.0,
    status: 'Failed',
    joinedDate: '2024-03-01',
    plan: 'Free',
    category: 'Movie',
    lastLogin: '1d ago',
    ipAddress: '172.16.254.8',
    device: 'Mobile',
    verified: false,
    location: 'Toronto, CA',
    subscriptionEnd: 'N/A',
    riskScore: 0.67
  },
  {
    id: '9',
    user: 'Dana Kim',
    email: 'dana@verc.com',
    phone: '+1 555-0109',
    amount: 120.0,
    status: 'Success',
    joinedDate: '2023-08-15',
    plan: 'Premium',
    category: 'Music',
    lastLogin: '3h ago',
    ipAddress: '192.168.1.99',
    device: 'Desktop',
    verified: true,
    location: 'Seoul, KR',
    subscriptionEnd: '2026-08-15',
    riskScore: 0.02
  },
  {
    id: '10',
    user: 'Chris Evans',
    email: 'chris@verc.com',
    phone: '+1 555-0110',
    amount: 55.0,
    status: 'Pending',
    joinedDate: '2024-01-25',
    plan: 'Standard',
    category: 'Live',
    lastLogin: '2d ago',
    ipAddress: '10.0.0.110',
    device: 'Tablet',
    verified: false,
    location: 'Los Angeles, USA',
    subscriptionEnd: '2026-03-25',
    riskScore: 0.21
  },
  {
    id: '11',
    user: 'Pat Morgan',
    email: 'pat@verc.com',
    phone: '+1 555-0111',
    amount: 200.0,
    status: 'Success',
    joinedDate: '2023-07-30',
    plan: 'Premium',
    category: 'Movie',
    lastLogin: '1w ago',
    ipAddress: '192.168.1.111',
    device: 'Desktop',
    verified: true,
    location: 'Rome, IT',
    subscriptionEnd: '2026-07-30',
    riskScore: 0.01
  },
  {
    id: '12',
    user: 'Taylor Brooks',
    email: 'taylor@verc.com',
    phone: '+1 555-0112',
    amount: 8.99,
    status: 'Failed',
    joinedDate: '2024-04-10',
    plan: 'Free',
    category: 'Music',
    lastLogin: '4d ago',
    ipAddress: '45.12.88.12',
    device: 'Mobile',
    verified: false,
    location: 'Amsterdam, NL',
    subscriptionEnd: 'N/A',
    riskScore: 0.73
  },
  {
    id: '13',
    user: 'Jordan Lee',
    email: 'jordanl@verc.com',
    phone: '+1 555-0113',
    amount: 60.0,
    status: 'Success',
    joinedDate: '2023-06-18',
    plan: 'Standard',
    category: 'Live',
    lastLogin: '6h ago',
    ipAddress: '172.16.254.13',
    device: 'Tablet',
    verified: true,
    location: 'Singapore, SG',
    subscriptionEnd: '2026-06-18',
    riskScore: 0.04
  },
  {
    id: '14',
    user: 'Morgan Cruz',
    email: 'morganc@verc.com',
    phone: '+1 555-0114',
    amount: 99.99,
    status: 'Pending',
    joinedDate: '2024-05-05',
    plan: 'Premium',
    category: 'Movie',
    lastLogin: '8h ago',
    ipAddress: '10.0.0.114',
    device: 'Desktop',
    verified: false,
    location: 'Rio, BR',
    subscriptionEnd: '2026-11-05',
    riskScore: 0.09
  },
  {
    id: '15',
    user: 'Alexis Green',
    email: 'alexis@verc.com',
    phone: '+1 555-0115',
    amount: 130.0,
    status: 'Success',
    joinedDate: '2023-05-22',
    plan: 'Premium',
    category: 'Music',
    lastLogin: '12h ago',
    ipAddress: '192.168.1.115',
    device: 'Mobile',
    verified: true,
    location: 'Cape Town, ZA',
    subscriptionEnd: '2026-05-22',
    riskScore: 0.01
  }
];

export type SidebarItem = {
  label: string;
  href?: string;
  icon?: string;
  children?: SidebarItem[];
  permission?: string;
};

export type SidebarGroup = {
  group: string;
  items: SidebarItem[];
};

export const dashboard_SIDEBAR: SidebarGroup[] = [
  {
    group: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: 'LayoutDashboard'
      }
    ]
  },
  {
    group: 'Users & Access',
    items: [
      {
        label: 'Users',
        icon: 'Users',
        children: [
          { label: 'Users', href: '/dashboard/users' },
          { label: 'Access Control', href: '/dashboard/access-control' },
          { label: 'Roles & Permissions', href: '/dashboard/roles' },
          { label: 'Audit Logs', href: '/dashboard/audit-logs' }
        ]
      }
    ]
  },
  {
    group: 'Content Library',
    items: [
      {
        label: 'Movies & Series',
        href: '/dashboard/movies',
        icon: 'Film'
      },
      {
        label: 'Music',
        icon: 'Music',
        children: [
          { label: 'Artists', href: '/dashboard/music/artists' },
          { label: 'Albums', href: '/dashboard/music/albums' },
          { label: 'Tracks', href: '/dashboard/music/tracks' }
        ]
      },
      {
        label: 'Media Assets',
        icon: 'FolderArchive',
        children: [
          { label: 'Media Library', href: '/dashboard/media' },
          { label: 'Uploads', href: '/dashboard/media/uploads' }
        ]
      }
    ]
  },
  {
    group: 'Operations',
    items: [
      {
        label: 'Streaming',
        icon: 'MonitorPlay',
        children: [
          { label: 'Active Streams', href: '/dashboard/streams' },
          { label: 'Playback Errors', href: '/dashboard/playback/errors' },
          { label: 'DRM & Licenses', href: '/dashboard/drm' }
        ]
      },
      {
        label: 'Moderation',
        icon: 'AlertTriangle',
        children: [
          { label: 'User Reports', href: '/dashboard/moderation/reports' },
          { label: 'DMCA & Copyright', href: '/dashboard/moderation/dmca' },
          {
            label: 'Region Restrictions',
            href: '/dashboard/moderation/region-blocks'
          }
        ]
      }
    ]
  },
  {
    group: 'Business',
    items: [
      {
        label: 'Monetization',
        icon: 'CreditCard',
        children: [
          {
            label: 'Subscription Plans',
            href: '/dashboard/subscriptions/plans'
          },
          {
            label: 'User Subscriptions',
            href: '/dashboard/subscriptions/users'
          },
          { label: 'Payments', href: '/dashboard/payments' }
        ]
      },
      {
        label: 'Analytics',
        icon: 'BarChart3',
        children: [
          { label: 'Overview', href: '/dashboard/analytics' },
          {
            label: 'Content Performance',
            href: '/dashboard/analytics/content'
          },
          { label: 'User Behavior', href: '/dashboard/analytics/users' },
          { label: 'Reports', href: '/dashboard/reports' }
        ]
      },
      {
        label: 'Discovery',
        icon: 'Sparkles',
        children: [
          { label: 'Recommendations', href: '/dashboard/recommendations' },
          { label: 'Featured Content', href: '/dashboard/featured' },
          { label: 'A/B Testing', href: '/dashboard/ab-tests' }
        ]
      }
    ]
  },
  {
    group: 'Support & Comms',
    items: [
      {
        label: 'Support',
        href: '/dashboard/support',
        icon: 'Headphones'
      },
      {
        label: 'Communication',
        icon: 'Bell',
        children: [
          { label: 'Notifications', href: '/dashboard/notifications' },
          { label: 'Campaigns', href: '/dashboard/campaigns' }
        ]
      }
    ]
  },
  {
    group: 'System',
    items: [
      {
        label: 'Infrastructure',
        icon: 'Server',
        children: [
          { label: 'System Logs', href: '/dashboard/logs' },
          { label: 'Monitoring', href: '/dashboard/monitoring' },
          { label: 'Backups', href: '/dashboard/backups' }
        ]
      },
      {
        label: 'Settings',
        icon: 'Settings',
        children: [
          { label: 'General', href: '/dashboard/settings/general' },
          { label: 'Localization', href: '/dashboard/settings/localization' },
          { label: 'Feature Flags', href: '/dashboard/settings/features' },
          { label: 'Integrations', href: '/dashboard/settings/integrations' }
        ]
      },
      {
        label: 'Legal',
        icon: 'FileText',
        children: [
          { label: 'Terms of Service', href: '/dashboard/legal/terms' },
          { label: 'Privacy Policy', href: '/dashboard/legal/privacy' },
          { label: 'Licenses', href: '/dashboard/legal/licenses' }
        ]
      }
    ]
  }
];

export const ICON_MAP = {
  IconActivity,
  IconAlertTriangle,
  IconChartBar,
  IconBell,
  IconCreditCard,
  IconDatabase,
  IconFileText,
  IconFlag,
  IconArchive,
  IconGlobe,
  IconHeadphones,
  IconLayout,
  IconLayoutDashboard,
  IconLibrary,
  IconDeviceTv,
  IconMusic,
  IconPlug,
  IconServer,
  IconSettings,
  IconShield,
  IconSparkles,
  IconUsers
} as const;
