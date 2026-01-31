import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  if (pathname.startsWith('/org')) {
    const [, , slug] = pathname.split('/')
    
    // Apenas define se o slug existir
    if (slug) {
      response.cookies.set('org', slug)
    }
  } 
    return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}