import mongoose, { Schema, Document } from 'mongoose'

export type AuthProvider = 'local' | 'google' | 'facebook' | 'apple'

export interface IUser extends Document {
  provider: AuthProvider
  email: string
  name: string
  password?: string

  googleId?: string
  facebookId?: string
  appleId?: string
  privacy?: boolean
  picture?: string
  refreshToken?: string
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  provider: {
    type: String,
    enum: ['local', 'google', 'facebook', 'apple'],
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  name: { type: String, required: true },

  password: { type: String },

  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  appleId: { type: String, unique: true, sparse: true },

  picture: String,

  refreshToken: String,
  privacy: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IUser>('User', UserSchema)
