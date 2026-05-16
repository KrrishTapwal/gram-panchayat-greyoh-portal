import { NextRequest } from 'next/server'
import { connectDB }      from '@/lib/mongodb'
import Complaint          from '@/lib/models/Complaint'
import { getCurrentUser, apiError } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Only admins can update complaint status
  const user = await getCurrentUser(req)
  if (!user || (user.role !== 'admin' && user.role !== 'pradhan')) {
    return apiError('Admin access required', 403)
  }

  try {
    const { status, remark } = await req.json()

    const validStatuses = ['pending','underReview','inProgress','resolved']
    if (!validStatuses.includes(status)) return apiError('Invalid status')
    if (!remark?.trim())                 return apiError('Remark is required')

    await connectDB()

    const complaint = await Complaint.findByIdAndUpdate(
      params.id,
      {
        $set:  { status },
        $push: { remarks: { text: remark.trim().slice(0, 1000), addedBy: user.name, addedAt: new Date() } },
      },
      { new: true }
    )

    if (!complaint) return apiError('Complaint not found', 404)

    return Response.json({ complaint })
  } catch {
    return apiError('Update failed', 500)
  }
}
