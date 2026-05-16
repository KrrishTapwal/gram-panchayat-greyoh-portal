import { NextRequest } from 'next/server'
import { getCurrentUser, apiError } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function GET(req: NextRequest) {
  const payload = await getCurrentUser(req)
  if (!payload) return apiError('Not authenticated', 401)

  try {
    await connectDB()
    const user = await User.findById(payload.sub).select('-password')
    if (!user) return apiError('User not found', 404)

    return Response.json({ user })
  } catch {
    return apiError('Failed to fetch user', 500)
  }
}
