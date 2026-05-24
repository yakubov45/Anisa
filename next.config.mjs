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
          "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://images.unsplash.com https://api.dicebear.com https://avatars.mds.yandex.net https://i.rtings.com",
          "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://api.telegram.org wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
          "frame-ancestors 'none'",
      ].join('; ')
  },
  {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload'
  }
];

const nextConfig = {
    poweredByHeader: false,
    outputFileTracingRoot: process.cwd(),
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: securityHeaders,
            },
        ];
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'api.dicebear.com' },
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
            { protocol: 'https', hostname: 'www.google.com' },
            { protocol: 'https', hostname: 'i.rtings.com' },
            { protocol: 'https', hostname: 'avatars.mds.yandex.net' },
        ],
    },
};

export default withSentryConfig(nextConfig, {
    org: "onepc",
    project: "onepc",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
});
