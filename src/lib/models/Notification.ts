import mongoose, { Schema, Document, Model } from 'mongoose'

export interface INotification extends Document {
  title:     string
  titleHi:   string
  content:   string
  contentHi: string
  type:      'scheme' | 'notice' | 'announcement'
  link?:     string
  isActive:  boolean
  createdBy: string
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    title:     { type: String, required: true, trim: true, maxlength: 200 },
    titleHi:   { type: String, default: '', trim: true, maxlength: 200 },
    content:   { type: String, required: true, trim: true, maxlength: 3000 },
    contentHi: { type: String, default: '', trim: true, maxlength: 3000 },
    type:      { type: String, enum: ['scheme','notice','announcement'], required: true },
    link:      { type: String, trim: true },
    isActive:  { type: Boolean, default: true, index: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
)

const Notification: Model<INotification> =
  mongoose.models.Notification ?? mongoose.model<INotification>('Notification', NotificationSchema)

export default Notification
