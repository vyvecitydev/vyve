import { Types } from 'mongoose'

declare global {
  namespace Express {
    interface User {
      id: Types.ObjectId | string
      email?: string
    }

    interface Request {
      user?: User
    }
  }
}
