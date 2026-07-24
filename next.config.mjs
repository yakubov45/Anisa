import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  {
      key: 'Content-Security-Policy',
      value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://storage.googleapis.com https://images.unsplash.com https://api.dicebear.com https://avatars.mds.yandex.net https://i.rtings.com https://ik.imagekit.io https://pub-c2a26e8f520c4d429c0ad4534a6dc0d5.r2.dev https://*.r2.dev",
          "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://api.telegram.org wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebasestorage.googleapis.com https://storage.googleapis.com https://upload.imagekit.io https://ik.imagekit.io https://*.r2.dev https://*.r2.cloudflarestorage.com",
          "frame-ancestors 'none'",
      ].join('; ')
  },
  {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload'
  }
];

const nextConfig = {
    output: 'standalone',
    poweredByHeader: false,
    compress: true,
    outputFileTracingRoot: process.cwd(),
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
            // Static assets aggressive caching
            {
                source: '/(.*)\\.(ico|png|jpg|jpeg|svg|webp|avif|woff|woff2|ttf)',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
                ],
            },
        ];
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 86400, // 24 soat
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'api.dicebear.com' },
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
            { protocol: 'https', hostname: 'www.google.com' },
            { protocol: 'https', hostname: 'i.rtings.com' },
            { protocol: 'https', hostname: 'avatars.mds.yandex.net' },
            { protocol: 'https', hostname: 'ik.imagekit.io' },
            { protocol: 'https', hostname: 'pub-c2a26e8f520c4d429c0ad4534a6dc0d5.r2.dev' },
            { protocol: 'https', hostname: '*.r2.dev' },
        ],
    },
};

export default withSentryConfig(nextConfig, {
    org: "onepc",
    project: "onepc",
    silent: true,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    disableServerWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
    disableClientWebpackPlugin: !process.env.SENTRY_AUTH_TOKEN,
});
