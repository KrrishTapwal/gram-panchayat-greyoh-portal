import { NextRequest } from 'next/server'
import { connectDB }   from '@/lib/mongodb'
import Meeting         from '@/lib/models/Meeting'
import { getCurrentUser, apiError } from '@/lib/auth'

function s(str: string) { return str.replace(/[<>"']/g, '').trim().slice(0, 3000) }

export async function GET() {
  try {
    await connectDB()
    const meetings = await Meeting.find().sort({ date: -1 }).lean()
    return Response.json({ meetings })
  } catch {
    return apiError('Failed to fetch meetings', 500)
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user || (user.role !== 'admin' && user.role !== 'pradhan')) {
    return apiError('Admin access required', 403)
  }

  try {
    const { title, date, venue, agenda, notes, decisions } = await req.json()
    if (!title || !date) return apiError('Title and date are required')

    const dateObj  = new Date(date)
    const isPast   = dateObj < new Date()

    await connectDB()
    const meeting = await Meeting.create({
      title:     s(title),
      date:      dateObj,
      venue:     venue     ? s(venue)     : undefined,
      agenda:    agenda    ? s(agenda)    : undefined,
      notes:     notes     ? s(notes)     : undefined,
      decisions: decisions ? s(decisions) : undefined,
      status:    isPast ? 'completed' : 'upcoming',
    })

    return Response.json({ meeting }, { status: 201 })
  } catch {
    return apiError('Failed to create meeting', 500)
  }
}
