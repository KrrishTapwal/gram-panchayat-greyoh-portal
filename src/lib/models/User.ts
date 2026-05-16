import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  name:      string
  email:     string
  password:  string
  phone?:    string
  ward?:     string
  role:      'citizen' | 'admin' | 'pradhan'
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true, maxlength: 100 },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone:    { type: String, trim: true, maxlength: 15 },
    ward:     { type: String, trim: true },
    role:     { type: String, enum: ['citizen', 'admin', 'pradhan'], default: 'citizen' },
  },
  { timestamps: true }
)

// Never return password in queries
UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (ret as any).password
    return ret
  },
})

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema)

export default User
