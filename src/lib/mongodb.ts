import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined')
}

// Next.js hot-reload safe singleton pattern
interface MongooseCache {
  conn:    typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalCache = global as typeof globalThis & { _mongoose?: MongooseCache }

const cached: MongooseCache = globalCache._mongoose ?? { conn: null, promise: null }
if (!globalCache._mongoose) globalCache._mongoose = cached

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands:  false,
      maxPoolSize:     10,
      socketTimeoutMS: 30_000,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
