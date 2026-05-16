import { NextRequest } from 'next/server'
import { connectDB }   from '@/lib/mongodb'
import Meeting         from '@/lib/models/Meeting'
import { getCurrentUser, apiError } from '@/lib/auth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser(req)
  if (!user || (user.role !== 'admin' && user.role !== 'pradhan')) {
    return apiError('Admin access required', 403)
  }

  try {
    await connectDB()
    await Meeting.findByIdAndDelete(params.id)
    return Response.json({ message: 'Deleted' })
  } catch {
    return apiError('Delete failed', 500)
  }
}
