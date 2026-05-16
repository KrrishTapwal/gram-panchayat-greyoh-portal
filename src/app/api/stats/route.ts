import { connectDB }   from '@/lib/mongodb'
import Complaint       from '@/lib/models/Complaint'
import Notification    from '@/lib/models/Notification'
import User            from '@/lib/models/User'
import { apiError }    from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()

    const [totalUsers, complaints, notifications] = await Promise.all([
      User.countDocuments(),
      Complaint.find().lean(),
      Notification.find({ isActive: true }).lean(),
    ])

    return Response.json({
      registeredCitizens: totalUsers,
      totalComplaints:    complaints.length,
      resolvedComplaints: complaints.filter((c: { status: string }) => c.status === 'resolved').length,
      activeSchemes:      notifications.filter((n: { type: string }) => n.type === 'scheme').length,
      ongoingWorks:       complaints.filter((c: { status: string }) => c.status === 'inProgress').length,
      pendingRequests:    complaints.filter((c: { status: string }) => c.status === 'pending').length,
    })
  } catch {
    return apiError('Failed to fetch stats', 500)
  }
}
