import { NextRequest } from 'next/server'
import { connectDB }   from '@/lib/mongodb'
import Notification    from '@/lib/models/Notification'
import { getCurrentUser, apiError } from '@/lib/auth'

function s(str: string) { return str.replace(/[<>"']/g, '').trim().slice(0, 3000) }

export async function GET() {
  try {
    await connectDB()
    const notifications = await Notification.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean()
    return Response.json({ notifications })
  } catch {
    return apiError('Failed to fetch notifications', 500)
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user || (user.role !== 'admin' && user.role !== 'pradhan')) {
    return apiError('Admin access required', 403)
  }

  try {
    const { title, titleHi, content, contentHi, type, link } = await req.json()
    if (!title || !content || !type) return apiError('Title, content, and type are required')

    const validTypes = ['scheme','notice','announcement']
    if (!validTypes.includes(type)) return apiError('Invalid type')

    await connectDB()
    const notif = await Notification.create({
      title: s(title), titleHi: s(titleHi ?? ''),
      content: s(content), contentHi: s(contentHi ?? ''),
      type,
      link: link ? s(link).slice(0, 500) : undefined,
      isActive:  true,
      createdBy: user.name,
    })

    return Response.json({ notification: notif }, { status: 201 })
  } catch {
    return apiError('Failed to create notification', 500)
  }
}
