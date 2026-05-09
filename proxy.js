import { NextResponse } from 'next/server';

export function middleware(request) {
    const nonce = crypto.randomUUID();
    const isDev = process.env.NODE_ENV === 'development';
    
    const cspHeader = `
        default-src 'self' https://*.firebaseio.com https://*.googleapis.com;
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""} https://www.gstatic.com https://apis.google.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src * blob: data:;
        font-src 'self' data: https://fonts.gstatic.com;
        connect-src *;
        frame-src 'self' https://*.firebaseapp.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();
 
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', cspHeader);
 
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set('Content-Security-Policy', cspHeader);
 
    return response;
}

export const config = {
    matcher: [
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
};
