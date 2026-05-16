import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// ─── In-memory rate limiter ────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function rateLimit(ip: string, max = 60, windowMs = 60_000): boolean {
  const now    = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (record.count >= max) return false
  record.count++
  return true
}

// Routes that require authentication
const PROTECTED_ROUTES  = ['/admin', '/profile']
// Routes that require admin role
const ADMIN_ROUTES      = ['/admin']
// API routes that require admin role
const ADMIN_API_ROUTES  = ['/api/notifications', '/api/meetings', '/api/alerts', '/api/analytics']

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-secret')

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.ip ?? '127.0.0.1'

  // ── Rate limiting on all API routes ─────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const authRouteLimit = pathname.startsWith('/api/auth/login') ? 10 : 60
    if (!rateLimit(ip, authRouteLimit)) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }
  }

  // ── JWT verification for protected pages ─────────────────────────────────
  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r))
  const isAdminApi  = ADMIN_API_ROUTES.some(r => pathname.startsWith(r)) &&
                      req.method !== 'GET'

  if (isProtected || isAdminApi) {
    const token = req.cookies.get('gp-token')?.value
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r))
      if (isAdminRoute && payload.role !== 'admin' && payload.role !== 'pradhan') {
        if (pathname.startsWith('/api/')) {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }
        return NextResponse.redirect(new URL('/', req.url))
      }
    } catch {
      // Invalid or expired token
      const response = pathname.startsWith('/api/')
        ? NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
        : NextResponse.redirect(new URL('/login', req.url))
      response.cookies.delete('gp-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/api/:path*'],
}
