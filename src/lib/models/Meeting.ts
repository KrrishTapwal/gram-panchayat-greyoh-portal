import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IMeeting extends Document {
  title:     string
  date:      Date
  venue?:    string
  agenda?:   string
  notes?:    string
  decisions?: string
  status:    'upcoming' | 'completed' | 'cancelled'
  createdAt: Date
}

const MeetingSchema = new Schema<IMeeting>(
  {
    title:     { type: String, required: true, trim: true, maxlength: 200 },
    date:      { type: Date, required: true, index: true },
    venue:     { type: String, trim: true, maxlength: 200 },
    agenda:    { type: String, trim: true, maxlength: 3000 },
    notes:     { type: String, trim: true, maxlength: 3000 },
    decisions: { type: String, trim: true, maxlength: 3000 },
    status:    { type: String, enum: ['upcoming','completed','cancelled'], default: 'upcoming' },
  },
  { timestamps: true }
)

const Meeting: Model<IMeeting> =
  mongoose.models.Meeting ?? mongoose.model<IMeeting>('Meeting', MeetingSchema)

export default Meeting
