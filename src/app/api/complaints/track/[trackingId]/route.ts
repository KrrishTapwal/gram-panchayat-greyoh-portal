import { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Complaint     from '@/lib/models/Complaint'
import { apiError }  from '@/lib/auth'

export async function GET(
  _req: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    await connectDB()
    const complaint = await Complaint.findOne({
      trackingId: params.trackingId.toUpperCase(),
    }).lean()

    if (!complaint) return apiError('Complaint not found', 404)

    return Response.json({ complaint })
  } catch {
    return apiError('Failed to track complaint', 500)
  }
}
