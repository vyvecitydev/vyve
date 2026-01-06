import mongoose, { Schema, Document } from 'mongoose'

export interface ILike extends Document {
  userId: mongoose.Types.ObjectId
  orgId: mongoose.Types.ObjectId
  createdAt: Date
}

const LikeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: true,
    },
  },
  { timestamps: true },
)

// 🚨 ÇOK ÖNEMLİ (duplicate like engeli)
LikeSchema.index({ userId: 1, orgId: 1 }, { unique: true })

export default mongoose.model<ILike>('Like', LikeSchema)
