import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { signToken, setAuthCookie, apiError } from '@/lib/auth'

// Sanitize string input — prevent XSS / injection
function sanitize(str: string): string {
  return str.replace(/[<>"'&]/g, '').trim().slice(0, 500)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, phone, ward } = body

    // Validate required fields
    if (!name || !email || !password) {
      return apiError('Name, email, and password are required')
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return apiError('Invalid email address')
    }

    // Validate password strength
    if (password.length < 8) {
      return apiError('Password must be at least 8 characters')
    }

    await connectDB()

    // Check for duplicate email
    const existing = await User.findOne({ email: sanitize(email).toLowerCase() })
    if (existing) {
      return apiError('Email is already registered', 409)
    }

    // Hash password with 12 rounds (very secure)
    const hashed = await bcrypt.hash(password, 12)

    const user = await User.create({
      name:     sanitize(name),
      email:    sanitize(email).toLowerCase(),
      password: hashed,
      phone:    phone ? sanitize(phone) : undefined,
      ward:     ward  ? sanitize(ward)  : undefined,
      role:     'citizen',
    })

    // Auto-login after register
    const token = await signToken({
      sub:   user._id.toString(),
      name:  user.name,
      email: user.email,
      role:  user.role,
      ward:  user.ward,
    })
    await setAuthCookie(token)

    return Response.json({ message: 'Registration successful', user: { name: user.name, email: user.email, role: user.role } }, { status: 201 })
  } catch (err) {
    console.error('[REGISTER]', err)
    return apiError('Registration failed. Please try again.', 500)
  }
}
