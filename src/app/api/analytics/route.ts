import { NextRequest } from 'next/server'
import { connectDB }   from '@/lib/mongodb'
import Complaint       from '@/lib/models/Complaint'
import { getCurrentUser, apiError } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user || (user.role !== 'admin' && user.role !== 'pradhan')) {
    return apiError('Admin access required', 403)
  }

  try {
    await connectDB()
    const complaints = await Complaint.find().lean() as Array<{
      status: string; category: string; ward: string; createdAt: Date
    }>

    const byCategory: Record<string, number> = {}
    const byWard: Record<string, number>     = {}
    const byMonth: Record<string, number>    = {}
    let resolved = 0, pending = 0, inProgress = 0, underReview = 0

    for (const c of complaints) {
      if (c.status === 'resolved')    resolved++
      if (c.status === 'pending')     pending++
      if (c.status === 'inProgress')  inProgress++
      if (c.status === 'underReview') underReview++

      byCategory[c.category] = (byCategory[c.category] ?? 0) + 1
      byWard[c.ward]         = (byWard[c.ward] ?? 0) + 1

      const d   = new Date(c.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      byMonth[key] = (byMonth[key] ?? 0) + 1
    }

    const monthArray = Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([month, count]) => ({ month, count }))

    const total = complaints.length
    return Response.json({
      total, resolved, pending, inProgress, underReview,
      byCategory, byWard,
      byMonth:       monthArray,
      resolutionRate: total ? Math.round((resolved / total) * 100) : 0,
    })
  } catch {
    return apiError('Failed to fetch analytics', 500)
  }
}
