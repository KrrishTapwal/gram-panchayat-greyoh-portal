import { SignJWT, jwtVerify } from 'jose'
import { cookies }           from 'next/headers'
import { NextRequest }       from 'next/server'

export interface JWTPayload {
  sub:   string        // userId
  name:  string
  email: string
  role:  'citizen' | 'admin' | 'pradhan'
  ward?: string
  iat?:  number
  exp?:  number
}

const SECRET      = new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-dev-secret')
const COOKIE_NAME = 'gp-token'
const MAX_AGE     = 60 * 60 * 24 * 7 // 7 days in seconds

// ─── Sign & issue token ────────────────────────────────────────────────────
export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

// ─── Verify & decode token ─────────────────────────────────────────────────
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

// ─── Set secure cookie (server action / route handler) ────────────────────
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax',
    maxAge:   MAX_AGE,
    path:     '/',
  })
}

// ─── Clear cookie ──────────────────────────────────────────────────────────
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
}

// ─── Get current user from request (for API routes) ───────────────────────
export async function getCurrentUser(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

// ─── Get current user from cookie store (for server components) ────────────
export async function getServerUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

// ─── Generic error response (no stack traces!) ────────────────────────────
export function apiError(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}
