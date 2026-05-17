export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onepc.uz';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products',
          '/category/',
          '/brands/',
          '/builds/',
          '/pc-builder',
          '/about',
          '/faq',
          '/support',
          '/compare',
        ],
        disallow: [
          '/admin',
          '/dashboard',
          '/user',
          '/delivery',
          '/checkout',
          '/cart',
          '/wishlist',
          '/search',
          '/api/',
          '/_next/',
          '/static/',
          '/*.json',
        ],
      },
      {
        userAgent: ['GPTBot', 'CCBot', 'ChatGPT-User'],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
