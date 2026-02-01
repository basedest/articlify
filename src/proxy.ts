import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lightweight proxy - just for redirects or simple checks
// Auth protection is handled in app/(protected)/layout.tsx server-side
export function proxy(request: NextRequest) {
    // You can add simple redirects here if needed
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
