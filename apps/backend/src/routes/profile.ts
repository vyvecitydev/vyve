import { Router, Request, Response } from 'express'
import Like from '../models/Like'
import auth from '../middlewares/auth'
import Checkin from '../models/Checkin'
import { upload } from '../middlewares/upload'
import User from '../models/User'
import bcrypt from 'bcrypt'

const router = Router()

// ⭐ FAVORİ MEKANLAR
// ⭐ FAVORİ MEKANLAR (PAGINATION)
router.get('/favorites', auth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const page = Math.max(parseInt(req.query.page as string) || 1, 1)
    const limit = 10
    const skip = (page - 1) * limit

    const [likes, total] = await Promise.all([
      Like.find({ userId })
        .sort({ createdAt: -1 }) // en son beğenilen üstte
        .skip(skip)
        .limit(limit)
        .populate({ path: 'orgId', options: { lean: true } }), // 👈 lean
      Like.countDocuments({ userId }),
    ])

    // Org datasını ayıkla ve likedAt ekle
    const favorites = likes
      .map((like) => {
        const org = like.orgId
        if (!org) return null

        return {
          ...org,
          likedAt: like.createdAt,
        }
      })
      .filter(Boolean)

    res.json({
      data: favorites,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch favorites' })
  }
})

// ⭐ CHECK-IN MEKANLARI (PAGINATION)
router.get('/checkins', auth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id

    // Pagination params
    const page = Math.max(parseInt(req.query.page as string) || 1, 1)
    const limit = 10
    const skip = (page - 1) * limit

    // 1️⃣ Kullanıcının check-in kayıtlarını al
    const [checkins, total] = await Promise.all([
      Checkin.find({ userId })
        .sort({ createdAt: -1 }) // en son check-in üstte
        .skip(skip)
        .limit(limit)
        .populate({ path: 'orgId', options: { lean: true } }), // org detayları
      Checkin.countDocuments({ userId }),
    ])

    // 2️⃣ Org datasını ayıkla ve checkedInAt ekle
    const checkedInOrgs = checkins
      .map((checkin) => {
        const org = checkin.orgId
        if (!org) return null

        return {
          ...org,
          checkedInAt: checkin.createdAt,
        }
      })
      .filter(Boolean)

    res.json({
      data: checkedInOrgs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch check-ins' })
  }
})

router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Dosya yüklenmedi' })
    }

    // Sunucuda erişilebilecek URL oluştur (frontend bunu kullanabilir)
    const fileUrl = `/uploads/${req.file.filename}`

    // Kullanıcıya kaydet
    await User.findByIdAndUpdate(req.user!.id, { picture: fileUrl }, { new: true })

    res.json({
      url: fileUrl,
    })
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/update', auth, async (req, res) => {
  try {
    const { name, email, privacy } = req.body

    // Kullanıcıyı bul
    const currentUser = await User.findById(req.user!.id)
    if (!currentUser) return res.status(404).json({ message: 'Kullanıcı bulunamadı' })

    // Email kontrolü
    if (email && email !== currentUser.email) {
      const exists = await User.findOne({ email })
      if (exists) return res.status(400).json({ message: 'email_already_exists' })
      currentUser.email = email
    }

    if (name) currentUser.name = name

    // Privacy güncelle
    if (typeof privacy === 'boolean') {
      currentUser.privacy = privacy
    }

    await currentUser.save()

    res.json({
      message: 'Profil bilgileri güncellendi',
      user: currentUser,
    })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

router.post('/change-password', auth, async (req, res) => {
  try {
    const { newPassword } = req.body

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'password_too_short' })
    }

    // Mevcut kullanıcıyı DB'den al
    const user = await User.findById(req.user!.id)
    if (!user) {
      return res.status(404).json({ message: 'user_not_found' })
    }

    // Sadece local provider kullanıcıları şifre değiştirebilir
    if (user.provider !== 'local') {
      return res.status(403).json({ message: 'cannot_change_password' })
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashedPassword

    await user.save()

    res.json({ message: 'password_changed_successfully' })
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

export default router
