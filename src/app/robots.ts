// app/robots.ts
import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.olditems.ins';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/static/chunks/app/',
          '/dashboard/',
          '/my-products/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}