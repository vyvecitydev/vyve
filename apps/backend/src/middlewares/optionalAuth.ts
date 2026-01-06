import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export default function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization
  if (!header) return next()

  const token = header.split(' ')[1]
  if (!token) return next()

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
    }

    req.user = { id: decoded.userId }
  } catch {
    // token geçersiz ama listeyi bozma
  }

  next()
}
