import mongoose, { Schema, Document, Types } from 'mongoose'
import { IUser } from './user' // User modelini import ediyoruz

export interface IOrg extends Document {
  text: string
  imageUrl: string
  percent: number
  photos: string[]
  tags: string[]
  description: string
  address: string
  phone: string
  owner: Types.ObjectId | IUser
  members: Types.ObjectId[] | IUser[]
  createdAt: Date
  updatedAt: Date
}

const OrgSchema: Schema = new Schema(
  {
    text: { type: String, required: true }, // org adı
    imageUrl: { type: String, required: true },
    percent: { type: Number, required: true },
    photos: [{ type: String }], // array of URLs
    tags: [{ type: String }], // array of tags
    description: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }, // createdAt ve updatedAt otomatik ekler
)

export default mongoose.model<IOrg>('Org', OrgSchema)
