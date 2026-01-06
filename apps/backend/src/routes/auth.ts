import { Request, Response, Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User'
import auth from '../middlewares/auth'

const GOOGLE_CLIENT_ID = '495645000798-0adpgdgpgmbn9b49bmbs2n3raoj2vltr.apps.googleusercontent.com'
const client = new OAuth2Client(GOOGLE_CLIENT_ID)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'

const router = Router()

export const generateAccessToken = (userId: string) =>
  jwt.sign({ userId, type: 'access' }, process.env.JWT_SECRET!, { expiresIn: '30m' })

export const generateRefreshToken = (userId: string) =>
  jwt.sign({ userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' })

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })

  const exists = await User.findOne({ email })
  if (exists) return res.status(400).json({ message: 'email_already_exists' })

  const hashed = await bcrypt.hash(password, 10)

  const user = await User.create({
    provider: 'local',
    email,
    name,
    password: hashed,
    privacy: true,
  })

  const accessToken = generateAccessToken(user._id.toString())
  const refreshToken = generateRefreshToken(user._id.toString())

  user.refreshToken = refreshToken
  await user.save()

  res.status(201).json({
    user,
    accessToken,
    refreshToken,
  })
})

router.post('/refresh-token', async (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return res.status(401).json({ message: 'Missing refresh token' })
  }

  const user = await User.findOne({ refreshToken })
  if (!user) {
    return res.status(403).json({ message: 'Invalid refresh token' })
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as {
      userId: string
      type: string
    }

    if (decoded.type !== 'refresh') {
      return res.status(403).json({ message: 'Invalid token type' })
    }

    const newAccessToken = generateAccessToken(user._id.toString())
    const newRefreshToken = generateRefreshToken(user._id.toString())

    user.refreshToken = newRefreshToken
    await user.save()

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  } catch {
    return res.status(403).json({ message: 'Invalid refresh token' })
  }
})

router.post('/logout', auth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id

    await User.findByIdAndUpdate(userId, {
      refreshToken: null,
    })

    res.json({ message: 'Logged out' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Google token doğrulama fonksiyonu
async function verifyGoogleToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID, // Web Client ID burada olmalı
  })

  const payload = ticket.getPayload()
  return payload // Kullanıcı bilgileri burada
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email, provider: 'local' })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  const ok = await bcrypt.compare(password, user.password!)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

  const accessToken = generateAccessToken(user._id.toString())
  const refreshToken = generateRefreshToken(user._id.toString())

  user.refreshToken = refreshToken
  await user.save()

  res.json({
    user: user,
    accessToken,
    refreshToken,
  })
})

router.post('/google', async (req, res) => {
  const { idToken } = req.body
  if (!idToken) return res.status(400).json({ message: 'idToken required' })

  const payload = await verifyGoogleToken(idToken)

  const googleId = payload?.sub
  const email = payload?.email
  const name = payload?.name
  const picture = payload?.picture

  let user = await User.findOne({ googleId })

  if (!user) {
    user = await User.create({
      provider: 'google',
      googleId,
      email,
      name,
      picture,
      privacy: true,
    })
  }

  const accessToken = generateAccessToken(user._id.toString())
  const refreshToken = generateRefreshToken(user._id.toString())

  user.refreshToken = refreshToken
  await user.save()

  res.json({
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      provider: user.provider,
      privacy: user.privacy,
    },
    accessToken,
    refreshToken,
  })
})

export default router
