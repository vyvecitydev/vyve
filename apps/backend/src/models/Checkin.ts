import mongoose, { Schema, Document } from 'mongoose'

export interface ICheckin extends Document {
  userId: mongoose.Types.ObjectId
  orgId: mongoose.Types.ObjectId
  createdAt: Date
}

const CheckinSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Org', required: true },
  },
  { timestamps: true },
)

// Aynı mekanda duplicate check-in engeli
CheckinSchema.index({ userId: 1, orgId: 1 }, { unique: true })

export default mongoose.model<ICheckin>('Checkin', CheckinSchema)
