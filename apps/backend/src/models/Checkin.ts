import mongoose, { Schema, Document } from 'mongoose'

export interface ICheckin extends Document {
  userId: mongoose.Types.ObjectId
  orgId: mongoose.Types.ObjectId
  createdAt: Date
  date: string // YYYY-MM-DD
}

const CheckinSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orgId: { type: Schema.Types.ObjectId, ref: 'Org', required: true },
    date: { type: String, required: true }, // gün bazında unique için
  },
  { timestamps: true },
)

// Aynı kullanıcı, aynı org, aynı gün sadece 1 check-in
CheckinSchema.index({ userId: 1, orgId: 1, date: 1 }, { unique: true })

// Async pre-save hook ile date alanını gün bazında ayarlıyoruz
CheckinSchema.pre<ICheckin>('save', async function () {
  this.date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
})

export default mongoose.model<ICheckin>('Checkin', CheckinSchema)
