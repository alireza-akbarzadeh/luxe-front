import type { Metadata } from 'next';

import { getSiteUrl } from '@/lib/seo/site-url';
import { type SiteMetaInput, toNextMetadata } from '@/lib/utils';

const SITE_URL = getSiteUrl();

export const siteMetaInput: SiteMetaInput = {
  title: 'Luxe | Premium Fashion & Lifestyle',
  description:
    'Shop curated luxury fashion, accessories, and lifestyle products at Luxe. Premium brands, fast shipping, easy returns, and exceptional service.',
  keywords:
    'luxe, luxury fashion, premium ecommerce, designer clothing, luxury accessories, lifestyle products, online shopping, luxury retail',
  author: 'Luxe',
  robots: 'index, follow',
  images: [
    {
      url: `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
      alt: 'Luxe — Premium Fashion & Lifestyle Ecommerce',
      format: 'png'
    }
  ],
  openGraph: {
    url: SITE_URL,
    siteName: 'Luxe',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@luxefashion',
    creator: '@luxefashion'
  }
};

export const siteMetadata: Metadata = {
  ...toNextMetadata(siteMetaInput, { metadataBase: new URL(SITE_URL), category: 'Ecommerce' }),
  title: {
    default: siteMetaInput.title!,
    template: '%s | Luxe'
  },
  creator: 'Luxe',
  publisher: 'Luxe',
  alternates: {
    canonical: SITE_URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

const config = {
  site: {
    name: 'Luxe',
    url: SITE_URL
  },
  metadata: {
    title: siteMetaInput.title!,
    description: siteMetaInput.description!,
    keywords: siteMetaInput.keywords!
  },
  server: {
    host: 'localhost',
    port: 3000
  }
};

export default config;
