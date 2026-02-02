import { Request, Response, Router } from 'express'
import Org from '../models/Org'
import Like from '../models/Like'
import auth from '../middlewares/auth'
import optionalAuth from '../middlewares/optionalAuth'
import mongoose, { PipelineStage } from 'mongoose'
import Checkin from '../models/Checkin'

const router = Router()

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const MOD_CAPACITY_MAP: Record<number, { min: number; max: number }> = {
  1: { min: 0, max: 30 }, // Chill
  2: { min: 30, max: 60 }, // Normal
  3: { min: 60, max: 9999 }, // Enerjik
}

router.post('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    const { lat, lng } = req.query
    const { text, tags, mods } = req.body.search || {}

    const pageNumber = Math.max(Number(req.body.page ?? 1), 1)
    const pageSize = Math.max(Number(req.body.limit ?? 20), 1)

    const hasLocation = !!(lat && lng)

    const pipeline: any[] = []

    /* -----------------------------
       🔎 SEARCH FILTERS
    ------------------------------ */
    const andFilters: any[] = []

    // TEXT
    if (typeof text === 'string' && text.trim() !== '') {
      andFilters.push({
        text: {
          $regex: escapeRegex(text.trim()),
          $options: 'i',
        },
      })
    }

    // TAGS
    if (Array.isArray(tags) && tags.length > 0) {
      andFilters.push({
        tags: {
          $in: tags.map((tag) => new RegExp(`^${escapeRegex(tag)}$`, 'i')),
        },
      })
    }

    // MODS → capacity ranges (OR)
    if (Array.isArray(mods) && mods.length > 0) {
      const modRanges = mods
        .map((mod) => {
          const range = MOD_CAPACITY_MAP[Number(mod)]
          if (!range) return null

          return {
            percent: {
              $gte: range.min,
              $lt: range.max,
            },
          }
        })
        .filter(Boolean)

      if (modRanges.length > 0) {
        andFilters.push({
          $or: modRanges,
        })
      }
    }

    const matchStage = andFilters.length > 0 ? { $and: andFilters } : null

    /* -----------------------------
       🌍 GEO / NORMAL FLOW
    ------------------------------ */
    if (hasLocation) {
      pipeline.push({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)],
          },
          distanceField: 'distance',
          spherical: true,
        },
      })

      if (matchStage) {
        pipeline.push({ $match: matchStage })
      }

      pipeline.push({
        $addFields: {
          distanceText: {
            $cond: [
              { $lt: [{ $divide: ['$distance', 1000] }, 1] },
              {
                $concat: [{ $toString: { $round: ['$distance', 0] } }, ' m'],
              },
              {
                $concat: [
                  {
                    $toString: {
                      $round: [{ $divide: ['$distance', 1000] }, 1],
                    },
                  },
                  ' km',
                ],
              },
            ],
          },
        },
      })

      pipeline.push({ $sort: { distance: 1 } })
    } else {
      if (matchStage) {
        pipeline.push({ $match: matchStage })
      }

      pipeline.push({ $sort: { createdAt: -1 } })
    }

    /* -----------------------------
       🔐 LIKE INFO
    ------------------------------ */
    if (userId) {
      pipeline.push(
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
        { $unset: 'userLike' },
      )
    }

    /* -----------------------------
       📄 PAGINATION
    ------------------------------ */
    pipeline.push({ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize })

    /* -----------------------------
       🎯 PROJECTION
    ------------------------------ */
    pipeline.push({
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
    })

    const orgs = await Org.aggregate(pipeline)

    res.json({
      success: true,
      data: orgs,
      page: pageNumber,
      limit: pageSize,
    })
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
    const { orgId } = req.params
    const { count } = req.body

    if (typeof count !== 'number') {
      return res.status(400).json({ message: 'Missing or invalid count' })
    }

    // Örnek: MongoDB / Mongoose
    const org = await Org.findById(orgId)
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' })
    }

    // mevcut değere ekle
    org.currentOccupancy = (org.currentOccupancy || 0) + count

    // negatif olmasını engellemek istersen:
    if (org.currentOccupancy < 0) org.currentOccupancy = 0

    await org.save()

    res.json({
      success: true,
      currentOccupancy: org.currentOccupancy,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Failed org occupancy count' })
  }
})

export default router
