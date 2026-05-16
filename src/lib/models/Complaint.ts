import mongoose, { Schema, Document, Model } from 'mongoose'

export type ComplaintType   = 'complaint' | 'feedback' | 'requirement'
export type ComplaintStatus = 'pending' | 'underReview' | 'inProgress' | 'resolved'
export type Priority        = 'low' | 'medium' | 'high' | 'urgent'
export type Category        =
  'water' | 'electricity' | 'road' | 'garbage' |
  'drainage' | 'health' | 'education' | 'agriculture' | 'other'

export interface IComplaint extends Document {
  trackingId:  string
  userId:      string
  name:        string
  ward:        string
  category:    Category
  type:        ComplaintType
  description: string
  priority:    Priority
  status:      ComplaintStatus
  remarks:     Array<{ text: string; addedBy: string; addedAt: Date }>
  createdAt:   Date
  updatedAt:   Date
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    trackingId:  { type: String, required: true, unique: true, index: true },
    userId:      { type: String, required: true, index: true },
    name:        { type: String, required: true, trim: true, maxlength: 100 },
    ward:        { type: String, required: true, trim: true },
    category:    {
      type: String, required: true,
      enum: ['water','electricity','road','garbage','drainage','health','education','agriculture','other'],
    },
    type:     { type: String, required: true, enum: ['complaint','feedback','requirement'] },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    priority:    { type: String, required: true, enum: ['low','medium','high','urgent'], default: 'medium' },
    status:      { type: String, enum: ['pending','underReview','inProgress','resolved'], default: 'pending', index: true },
    remarks:     [{
      text:     { type: String, required: true, maxlength: 1000 },
      addedBy:  { type: String, required: true },
      addedAt:  { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
)

const Complaint: Model<IComplaint> =
  mongoose.models.Complaint ?? mongoose.model<IComplaint>('Complaint', ComplaintSchema)

export default Complaint
