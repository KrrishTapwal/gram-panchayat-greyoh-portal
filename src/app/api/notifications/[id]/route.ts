import { NextRequest } from 'next/server'
import { connectDB }   from '@/lib/mongodb'
import Notification    from '@/lib/models/Notification'
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
    await Notification.findByIdAndDelete(params.id)
    return Response.json({ message: 'Deleted successfully' })
  } catch {
    return apiError('Delete failed', 500)
  }
}
