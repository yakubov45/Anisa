import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' }
];

const nextConfig = {
    poweredByHeader: false,
    experimental: {
        turbopack: {
            root: '.',
        },
    },
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
