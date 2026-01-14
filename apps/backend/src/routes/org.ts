import { Request, Response, Router } from 'express'
import Org from '../models/Org'
import Like from '../models/Like'
import auth from '../middlewares/auth'
import optionalAuth from '../middlewares/optionalAuth'
import mongoose, { PipelineStage } from 'mongoose'
import Checkin from '../models/Checkin'

const router = Router()

// 🏢 Tüm organizationları getir (opsiyonel geoNear + mesafeye göre sıralı)
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { lat, lng } = req.query

    const hasLocation = !!(lat && lng)

    const geoStages: PipelineStage[] = hasLocation
      ? [
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [Number(lng), Number(lat)], // ⚠️ Mongo: lng first
              },
              distanceField: 'distance', // metre
              spherical: true,
            },
          } as PipelineStage.GeoNear,

          // km ham değeri
          {
            $addFields: {
              distanceKmRaw: { $divide: ['$distance', 1000] },
            },
          },

          // 🧠 İnsan okunur mesafe
          {
            $addFields: {
              distanceText: {
                $cond: [
                  { $lt: ['$distanceKmRaw', 1] },
                  {
                    $concat: [{ $toString: { $round: ['$distance', 0] } }, ' m'],
                  },
                  {
                    $concat: [
                      {
                        $toString: {
                          $round: ['$distanceKmRaw', 1],
                        },
                      },
                      ' km',
                    ],
                  },
                ],
              },
            },
          },

          {
            $unset: 'distanceKmRaw',
          },

          {
            $sort: { distance: 1 }, // ✅ en yakından uzağa
          },
        ]
      : [
          {
            $sort: { createdAt: -1 },
          },
        ]

    // 🔓 Login değilse
    if (!userId) {
      const orgs = await Org.aggregate([
        ...geoStages,
        {
          $project: {
            _id: 1,
            text: 1,
            imageUrl: 1,
            likeCount: 1,
            photos: 1,
            percent: 1,
            tags: 1,
            address: 1,
            description: 1,
            phone: 1,
            capacity: 1,
            currentOccupancy: 1,
            location: 1,
            distance: 1,
            distanceText: 1,
            createdAt: 1,
          },
        },
      ])

      return res.json({ success: true, data: orgs })
    }

    // 🔐 Login varsa
    const orgs = await Org.aggregate([
      ...geoStages,
      {
        $lookup: {
          from: 'likes',
          let: { orgId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$orgId', '$$orgId'] },
                    {
                      $eq: ['$userId', new mongoose.Types.ObjectId(userId)],
                    },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: 'userLike',
        },
      },
      {
        $addFields: {
          isLiked: { $gt: [{ $size: '$userLike' }, 0] },
        },
      },
      {
        $unset: 'userLike',
      },
      {
        $project: {
          _id: 1,
          text: 1,
          imageUrl: 1,
          likeCount: 1,
          isLiked: 1,
          photos: 1,
          percent: 1,
          tags: 1,
          address: 1,
          description: 1,
          phone: 1,
          capacity: 1,
          currentOccupancy: 1,
          location: 1,
          distance: 1,
          distanceText: 1,
          createdAt: 1,
        },
      },
    ])

    res.json({ success: true, data: orgs })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// 👍 LIKE
router.post('/:orgId/like', auth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const { orgId } = req.params

    const like = await Like.findOneAndUpdate(
      { userId, orgId },
      { $setOnInsert: { userId, orgId } },
      { upsert: true, new: false },
    )

    if (!like) {
      await Org.findByIdAndUpdate(orgId, {
        $inc: { likeCount: 1 },
      })
    }

    res.json({ liked: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Like failed' })
  }
})

// 👎 UNLIKE
router.delete('/:orgId/like', auth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const { orgId } = req.params

    // 1️⃣ Like'ı sil
    const result = await Like.deleteOne({ userId, orgId })

    // 2️⃣ Gerçekten silindiyse counter azalt
    if (result.deletedCount === 1) {
      await Org.findByIdAndUpdate(orgId, {
        $inc: { likeCount: -1 },
      })
    }

    res.json({ liked: false })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Unlike failed' })
  }
})

// POST /api/org/:orgId/checkin
router.post('/:orgId/checkin', auth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const { orgId } = req.params
    const { lat, lng } = req.body // kullanıcı konumu

    const org = await Org.findById(orgId)
    if (!org) return res.status(404).json({ message: 'Organization not found' })

    // 🔹 Mesafe kontrolü (ör: 100 metre)
    const toRad = (value: number) => (value * Math.PI) / 180
    const earthRadiusKm = 6371

    const [userLng, userLat] = [Number(lng), Number(lat)]
    const [orgLng, orgLat] = org.location.coordinates

    const dLat = toRad(orgLat - userLat)
    const dLng = toRad(orgLng - userLng)
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(userLat)) * Math.cos(toRad(orgLat)) * Math.sin(dLng / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distanceKm = earthRadiusKm * c

    // if (distanceKm > 0.1) {
    //   return res.status(400).json({ message: 'You are too far from this place to check-in' })
    // }

    // 🔹 Bugünün tarihini oluştur
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

    // Check-in oluştur veya zaten varsa hata fırlat
    try {
      const checkin = await Checkin.create({ userId, orgId, date: today })
      return res.json({ success: true, checkin })
    } catch (err: any) {
      // Duplicate key hatası -> zaten bugün check-in yapılmış
      if (err.code === 11000) {
        return res.status(400).json({ success: false, message: 'Bugün zaten check-in yaptınız.' })
      }
      throw err
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Check-in failed' })
  }
})

router.post('/:orgId/occupancy', async (req: Request, res: Response) => {
  try {
    const { count } = req.body

    if (!count) {
      return res.status(401).json({ message: 'Missing count' })
    }

    res.json({
      success: true,
      value: count,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Failed org occupancy count' })
  }
})

export default router
