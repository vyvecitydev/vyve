import { Request, Response, Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/user'

const router = Router()

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '15m' })
}

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' })
}

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'Email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ name, email, password: hashedPassword })

    // TOKENLER
    const accessToken = generateAccessToken(newUser._id.toString())
    const refreshToken = generateRefreshToken(newUser._id.toString())

    // RefreshToken DB'de sakla
    newUser.refreshToken = refreshToken
    await newUser.save()

    res.status(201).json({
      user: { id: newUser._id, name, email },
      accessToken,
      refreshToken,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' })

    const accessToken = generateAccessToken(user._id.toString())
    const refreshToken = generateRefreshToken(user._id.toString())

    // DB'ye refresh token güncelle
    user.refreshToken = refreshToken
    await user.save()

    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/refresh-token', async (req: Request, res: Response) => {
  const { refreshToken } = req.body

  if (!refreshToken) return res.status(401).json({ message: 'Missing refresh token' })

  try {
    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!)

    const user = await User.findById(decoded.userId)

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' })
    }

    const newAccessToken = generateAccessToken(user._id.toString())
    const newRefreshToken = generateRefreshToken(user._id.toString())

    // Refresh tokenı yenile
    user.refreshToken = newRefreshToken
    await user.save()

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  } catch (err) {
    return res.status(403).json({ message: 'Invalid refresh token' })
  }
})

router.post('/logout', async (req: Request, res: Response) => {
  const { userId } = req.body

  await User.findByIdAndUpdate(userId, { refreshToken: null })

  res.json({ message: 'Logged out' })
})

export default router
