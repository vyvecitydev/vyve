import mongoose, { Schema, Document, Types } from 'mongoose'
import { IUser } from './User'

export interface IOrg extends Document {
  text: string
  imageUrl: string
  percent: number

  capacity: number
  currentOccupancy: number

  photos: string[]
  tags: string[]
  description: string
  address: string
  phone: string

  location: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }

  owner: Types.ObjectId | IUser
  members: Types.ObjectId[] | IUser[]
  likeCount: number

  createdAt: Date
  updatedAt: Date
}

const OrgSchema: Schema = new Schema(
  {
    text: { type: String, required: true }, // org adı
    imageUrl: { type: String, required: true },

    percent: { type: Number, required: true },

    capacity: {
      type: Number,
      required: true, // kuver / max kapasite
    },

    currentOccupancy: {
      type: Number,
      default: 0, // anlık doluluk
    },

    photos: [{ type: String }],
    tags: [{ type: String }],

    description: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    likeCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true },
)

// 🔥 Geo query’ler için şart
OrgSchema.index({ location: '2dsphere' })

export default mongoose.model<IOrg>('Org', OrgSchema)
