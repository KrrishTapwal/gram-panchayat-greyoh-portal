import { NextRequest } from 'next/server'
import { connectDB }   from '@/lib/mongodb'
import Alert           from '@/lib/models/Alert'
import { getCurrentUser, apiError } from '@/lib/auth'

function s(str: string) { return str.replace(/[<>"']/g, '').trim().slice(0, 500) }

export async function GET() {
  try {
    await connectDB()
    const now    = new Date()
    const alerts = await Alert.find({
      isActive: true,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: { $gt: now } }],
    }).sort({ createdAt: -1 }).lean()
    return Response.json({ alerts })
  } catch {
    return apiError('Failed to fetch alerts', 500)
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user || (user.role !== 'admin' && user.role !== 'pradhan')) {
    return apiError('Admin access required', 403)
  }

  try {
    const { message, messageHi, type, expiresAt } = await req.json()
    if (!message || !type) return apiError('Message and type are required')

    const validTypes = ['flood','electricity','water','emergency','general']
    if (!validTypes.includes(type)) return apiError('Invalid alert type')

    await connectDB()
    const alert = await Alert.create({
      message:   s(message),
      messageHi: messageHi ? s(messageHi) : '',
      type,
      isActive:  true,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    })

    return Response.json({ alert }, { status: 201 })
  } catch {
    return apiError('Failed to create alert', 500)
  }
}
