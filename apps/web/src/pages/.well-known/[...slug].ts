import { NextRequest, NextResponse } from 'next/server';

export function handler(request: NextRequest) {
    const response = NextResponse.next();
    // Add your logic here to handle the request
    return response;
}

export const config = {
    matcher: '/.well-known/:path*',
};