// src/mongo.ts
import mongoose from 'mongoose'

export const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...', process.env.DATABASE_URL)
    const conn = await mongoose.connect(process.env.DATABASE_URL!)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`❌ Error: ${err}`)
    process.exit(1)
  }
}
