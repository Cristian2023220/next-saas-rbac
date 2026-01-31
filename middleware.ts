import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Pega o token dos cookies
  const token = request.cookies.get('token')?.value


  const pathname = request.nextUrl.pathname
  

  const authRoutes = ['/auth/sign-in', '/auth/sign-up', '/sign-in', '/sign-up'] 
  const isAuthRoute = authRoutes.includes(pathname)


  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!token && !isAuthRoute && pathname !== '/') { 
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }
  return NextResponse.next()
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}