import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAlert extends Document {
  message:   string
  messageHi: string
  type:      'flood' | 'electricity' | 'water' | 'emergency' | 'general'
  isActive:  boolean
  expiresAt?: Date
  createdAt: Date
}

const AlertSchema = new Schema<IAlert>(
  {
    message:   { type: String, required: true, trim: true, maxlength: 500 },
    messageHi: { type: String, default: '', trim: true, maxlength: 500 },
    type:      { type: String, enum: ['flood','electricity','water','emergency','general'], required: true },
    isActive:  { type: Boolean, default: true, index: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
)

const Alert: Model<IAlert> =
  mongoose.models.Alert ?? mongoose.model<IAlert>('Alert', AlertSchema)

export default Alert
