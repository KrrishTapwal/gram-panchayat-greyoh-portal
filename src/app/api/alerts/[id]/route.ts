import { NextRequest } from 'next/server'
import { connectDB }   from '@/lib/mongodb'
import Alert           from '@/lib/models/Alert'
import { getCurrentUser, apiError } from '@/lib/auth'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser(req)
  if (!user || (user.role !== 'admin' && user.role !== 'pradhan')) {
    return apiError('Admin access required', 403)
  }

  try {
    const { isActive } = await req.json()
    await connectDB()
    await Alert.findByIdAndUpdate(params.id, { isActive })
    return Response.json({ message: 'Alert updated' })
  } catch {
    return apiError('Update failed', 500)
  }
}
