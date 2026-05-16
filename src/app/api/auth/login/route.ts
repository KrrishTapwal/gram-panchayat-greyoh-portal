import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'
import { signToken, setAuthCookie, apiError } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return apiError('Email and password are required')
    }

    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')
    if (!user) {
      // Same error message regardless of whether email exists (prevents enumeration)
      await bcrypt.compare('dummy', '$2a$12$dummy.hash.to.prevent.timing.attacks.xxxx')
      return apiError('Invalid email or password', 401)
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return apiError('Invalid email or password', 401)
    }

    const token = await signToken({
      sub:   user._id.toString(),
      name:  user.name,
      email: user.email,
      role:  user.role,
      ward:  user.ward,
    })
    await setAuthCookie(token)

    return Response.json({
      message: 'Login successful',
      user: { name: user.name, email: user.email, role: user.role, ward: user.ward },
    })
  } catch (err) {
    console.error('[LOGIN]', err)
    return apiError('Login failed. Please try again.', 500)
  }
}
