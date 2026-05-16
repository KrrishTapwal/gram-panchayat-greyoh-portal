import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Complaint from '@/lib/models/Complaint'
import { getCurrentUser, apiError } from '@/lib/auth'

function sanitize(str: string) { return str.replace(/[<>"']/g, '').trim().slice(0, 2000) }

function generateTrackingId(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `GRY-${year}-${rand}`
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    const filter: Record<string, string> = {}
    if (userId) filter.userId = userId

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean()

    return Response.json({ complaints })
  } catch {
    return apiError('Failed to fetch complaints', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, ward, category, type, description, priority } = body

    if (!name || !ward || !category || !type || !description) {
      return apiError('All required fields must be filled')
    }

    // Validate enums
    const validCategories = ['water','electricity','road','garbage','drainage','health','education','agriculture','other']
    const validTypes      = ['complaint','feedback','requirement']
    const validPriorities = ['low','medium','high','urgent']

    if (!validCategories.includes(category)) return apiError('Invalid category')
    if (!validTypes.includes(type))          return apiError('Invalid type')
    if (!validPriorities.includes(priority)) return apiError('Invalid priority')

    // Get user from JWT (optional — anonymous complaints allowed)
    const currentUser = await getCurrentUser(req)

    await connectDB()

    // Ensure tracking ID is unique
    let trackingId = generateTrackingId()
    let exists     = await Complaint.findOne({ trackingId })
    while (exists) {
      trackingId = generateTrackingId()
      exists     = await Complaint.findOne({ trackingId })
    }

    const complaint = await Complaint.create({
      trackingId,
      userId:      currentUser?.sub ?? 'anonymous',
      name:        sanitize(name),
      ward:        sanitize(ward),
      category,
      type,
      description: sanitize(description),
      priority:    priority ?? 'medium',
      status:      'pending',
      remarks:     [],
    })

    return Response.json({ trackingId: complaint.trackingId }, { status: 201 })
  } catch (err) {
    console.error('[SUBMIT_COMPLAINT]', err)
    return apiError('Failed to submit complaint', 500)
  }
}
