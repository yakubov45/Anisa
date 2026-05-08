/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self' https://*.firebaseio.com https://*.googleapis.com;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src * blob: data:;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src *;
  frame-src 'self' https://*.firebaseapp.com;
`;

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim() }
];

const nextConfig = {
    poweredByHeader: false, // X-Powered-By: Next.js ni yashirish
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

export default nextConfig;
