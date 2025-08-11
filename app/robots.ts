import { MetadataRoute } from 'next'
import { SEO_CONFIG } from '../lib/seo-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Rules for all search engines
      {
        userAgent: '*',
        allow: [
          '/',
          '/category/',
          '/search',
          '/about',
          '/contact',
          '/privacy',
          '/terms',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/_next/',
          '/temp/',
          '/draft/',
          '/preview/',
          '*.json$',
          '/search?*',
          '/login',
          '/register',
          '/dashboard/',
          '/wp-admin/',
          '/wp-content/',
          '/cgi-bin/',
          '/tmp/',
          '/cache/',
        ],
        crawlDelay: 1,
      },
      // Specific rules for Googlebot
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/category/',
          '/search',
          '/sitemap.xml',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/draft/',
          '/preview/',
        ],
        crawlDelay: 0,
      },
      // Rules for Bingbot
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/category/',
          '/search',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ],
        crawlDelay: 1,
      },
      // Rules for social media crawlers
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ],
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
        ],
      },
      // Block bad bots
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
        ],
        disallow: '/',
      },
    ],
    sitemap: `${SEO_CONFIG.siteUrl}/sitemap.xml`,
    host: SEO_CONFIG.siteUrl,
  }
}
