import { NextResponse } from 'next/server';

// Tizimga kiritilishi taqiqlangan yomon niyatli (malicious) so'zlar ro'yxati
const sqlInjectionPatterns = [
  /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\b.*\b(FROM|INTO|TABLE|DATABASE)\b)/i,
  /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i, // masalan: OR 1=1
  /(--|\/\*|\*\/|;)/i,              // SQL commentlari yoki statement tugatuvchilari
  /(\$ne|\$gt|\$lt|\$regex|\$where)/i // NoSQL injection patternlari (MongoDB uchun)
];

// IP manzilni aniqlash
const getIP = (request) => {
  let ip = request.ip ?? request.headers.get('x-real-ip');
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (!ip && forwardedFor) {
    ip = forwardedFor.split(',')[0] ?? 'Unknown';
  }
  return ip || 'Unknown';
};

export function proxy(request) {
    const url = request.nextUrl.clone();

    // Faqat POST/PUT/DELETE yoki param-based GET yo'nalishlarida injection tekshirish
    if (request.method !== 'GET') {
        const searchParams = url.searchParams.toString();
        
        for (let pattern of sqlInjectionPatterns) {
            if (pattern.test(searchParams) || pattern.test(decodeURIComponent(url.pathname))) {
                const ip = getIP(request);
                console.warn(`[SECURITY] Bloklangan IP: ${ip}. Sabab: Shubhali so'rov (SQL/NoSQL Injection harakati). URL: ${url.href}`);
                
                return new NextResponse(
                    JSON.stringify({ 
                        success: false, 
                        message: "Xavfsizlik tizimi: Shubhali so'rov aniqlandi." 
                    }),
                    { status: 403, headers: { 'content-type': 'application/json' } }
                );
            }
        }
    }

    const response = NextResponse.next();

    // Faqat sahifalar (HTML) uchun CSP va boshqa xavfsizlik sarlavhalarini qo'shamiz (API yoki statik resurslar uchun shart emas)
    if (!url.pathname.startsWith('/api') && !url.pathname.startsWith('/_next')) {
        // Xavfsiz va Next.js bilan mos keladigan CSP
        const csp = [
            "default-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.firebaseapp.com",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com https://*.firebaseapp.com https://www.google.com https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src * blob: data:",
            "font-src 'self' data: https://fonts.gstatic.com",
            "connect-src *",
            "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://www.google.com",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ].join('; ');

        response.headers.set('Content-Security-Policy', csp);
        response.headers.set('X-Frame-Options', 'SAMEORIGIN');
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    return response;
}

export const config = {
    matcher: [
        {
            source: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
