import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export default function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = { id: decoded.userId }
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}
