/**
 * Client-side API wrappers — all data goes through Next.js API routes (no direct DB access).
 */

// ─── Types (re-exported for page compatibility) ────────────────────────────

export type { UserProfile, UserRole } from '@/contexts/AuthContext'

export type ComplaintType   = 'complaint' | 'feedback' | 'requirement'
export type ComplaintStatus = 'pending' | 'underReview' | 'inProgress' | 'resolved'
export type Priority        = 'low' | 'medium' | 'high' | 'urgent'
export type Category        =
  | 'water' | 'electricity' | 'road' | 'garbage'
  | 'drainage' | 'health' | 'education' | 'agriculture' | 'other'

export interface Remark {
  text:    string
  addedBy: string
  addedAt: string
}

export interface Complaint {
  _id:         string
  trackingId:  string
  userId:      string
  name:        string
  ward:        string
  category:    Category
  type:        ComplaintType
  description: string
  priority:    Priority
  status:      ComplaintStatus
  remarks:     Remark[]
  createdAt:   string
  updatedAt:   string
}

export type NotificationType = 'scheme' | 'notice' | 'announcement'

export interface PanchayatNotification {
  _id:       string
  title:     string
  titleHi:   string
  content:   string
  contentHi: string
  type:      NotificationType
  link?:     string
  isActive:  boolean
  createdBy: string
  createdAt: string
}

export type MeetingStatus = 'upcoming' | 'completed' | 'cancelled'

export interface Meeting {
  _id:       string
  title:     string
  date:      string
  venue:     string
  agenda:    string
  notes?:    string
  decisions?: string
  status:    MeetingStatus
  createdAt: string
}

export type AlertType = 'flood' | 'electricity' | 'water' | 'emergency' | 'general'

export interface EmergencyAlert {
  _id:       string
  message:   string
  messageHi: string
  type:      AlertType
  isActive:  boolean
  expiresAt?: string
  createdAt: string
}

export interface AnalyticsData {
  total:          number
  resolved:       number
  pending:        number
  inProgress:     number
  underReview:    number
  byCategory:     Record<string, number>
  byWard:         Record<string, number>
  byMonth:        { month: string; count: number }[]
  resolutionRate: number
}

export interface PublicStats {
  registeredCitizens: number
  totalComplaints:    number
  resolvedComplaints: number
  activeSchemes:      number
  ongoingWorks:       number
  pendingRequests:    number
}

// ─── Helpers ───────────────────────────────────────────────────────────────

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: 'include', ...options })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data as T
}

// ─── Complaints ────────────────────────────────────────────────────────────

export async function submitComplaint(
  data: Omit<Complaint, '_id' | 'createdAt' | 'updatedAt' | 'remarks' | 'trackingId'> & { trackingId?: string }
): Promise<string> {
  const res = await apiFetch<{ complaint: Complaint }>('/api/complaints', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  })
  return res.complaint.trackingId
}

export async function getComplaintByTrackingId(trackingId: string): Promise<Complaint | null> {
  try {
    const res = await apiFetch<{ complaint: Complaint }>(`/api/complaints/track/${trackingId}`)
    return res.complaint
  } catch {
    return null
  }
}

export async function getUserComplaints(userId: string): Promise<Complaint[]> {
  try {
    const res = await apiFetch<{ complaints: Complaint[] }>(`/api/complaints?userId=${userId}`)
    return res.complaints
  } catch {
    return []
  }
}

export async function getAllComplaints(): Promise<Complaint[]> {
  try {
    const res = await apiFetch<{ complaints: Complaint[] }>('/api/complaints')
    return res.complaints
  } catch {
    return []
  }
}

export async function updateComplaintStatus(
  complaintId: string,
  status: ComplaintStatus,
  remark: string,
  adminName: string
): Promise<void> {
  await apiFetch(`/api/complaints/${complaintId}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ status, remark, adminName }),
  })
}

// ─── Notifications ─────────────────────────────────────────────────────────

export async function addNotification(
  data: Omit<PanchayatNotification, '_id' | 'createdAt'>
): Promise<void> {
  await apiFetch('/api/notifications', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  })
}

export async function getActiveNotifications(): Promise<PanchayatNotification[]> {
  try {
    const res = await apiFetch<{ notifications: PanchayatNotification[] }>('/api/notifications')
    return res.notifications
  } catch {
    return []
  }
}

export async function deleteNotification(id: string): Promise<void> {
  await apiFetch(`/api/notifications/${id}`, { method: 'DELETE' })
}

// ─── Meetings ──────────────────────────────────────────────────────────────

export async function addMeeting(
  data: Omit<Meeting, '_id' | 'createdAt' | 'status'>
): Promise<void> {
  await apiFetch('/api/meetings', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  })
}

export async function getAllMeetings(): Promise<Meeting[]> {
  try {
    const res = await apiFetch<{ meetings: Meeting[] }>('/api/meetings')
    return res.meetings
  } catch {
    return []
  }
}

export async function deleteMeeting(id: string): Promise<void> {
  await apiFetch(`/api/meetings/${id}`, { method: 'DELETE' })
}

// ─── Emergency Alerts ──────────────────────────────────────────────────────

export async function addAlert(
  data: Omit<EmergencyAlert, '_id' | 'createdAt'>
): Promise<void> {
  await apiFetch('/api/alerts', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  })
}

export async function getActiveAlerts(): Promise<EmergencyAlert[]> {
  try {
    const res = await apiFetch<{ alerts: EmergencyAlert[] }>('/api/alerts')
    return res.alerts
  } catch {
    return []
  }
}

export async function deactivateAlert(id: string): Promise<void> {
  await apiFetch(`/api/alerts/${id}`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ isActive: false }),
  })
}

// ─── Analytics ─────────────────────────────────────────────────────────────

export async function getAnalyticsData(): Promise<AnalyticsData> {
  return apiFetch<AnalyticsData>('/api/analytics')
}

// ─── Public Stats ──────────────────────────────────────────────────────────

export async function getPublicStats(): Promise<PublicStats> {
  return apiFetch<PublicStats>('/api/stats')
}
