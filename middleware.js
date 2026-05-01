import { NextResponse } from 'next/server';

export function middleware(request) {
    // Temporarily disabled server-side session check to prevent redirect loops 
    // while using client-side Firebase Auth.
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/user/:path*', '/delivery/:path*'],
};
