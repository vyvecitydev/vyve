import { Request, Response, Router } from 'express'
import Org from '../models/Org'
import Like from '../models/Like'
import auth from '../middlewares/auth'
import User from '../models/User'
import Follow from '../models/Follow'
import Checkin from '../models/Checkin'

const router = Router()

// 👍 FOLLOW
router.post('/:userId/follow', auth, async (req: Request, res: Response) => {
  try {
    const followerId = req.user!.id
    const { userId: followingId } = req.params

    if (followerId === followingId) {
      return res.status(400).json({ message: 'You cannot follow yourself' })
    }

    const follow = await Follow.findOneAndUpdate(
      { followerId, followingId },
      { $setOnInsert: { followerId, followingId } },
      { upsert: true, new: false },
    )

    if (!follow) {
      await User.findByIdAndUpdate(followingId, {
        $inc: { followersCount: 1 },
      })

      await User.findByIdAndUpdate(followerId, {
        $inc: { followingCount: 1 },
      })
    }

    res.json({ following: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Follow failed' })
  }
})

// 👎 UNFOLLOW
router.delete('/:userId/follow', auth, async (req: Request, res: Response) => {
  try {
    const followerId = req.user!.id
    const { userId: followingId } = req.params

    const deleted = await Follow.findOneAndDelete({
      followerId,
      followingId,
    })

    if (deleted) {
      await User.findByIdAndUpdate(followingId, {
        $inc: { followersCount: -1 },
      })

      await User.findByIdAndUpdate(followerId, {
        $inc: { followingCount: -1 },
      })
    }

    res.json({ following: false })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Unfollow failed' })
  }
})

router.post('/handle', async (req: Request, res: Response) => {
  await User.updateMany({ followersCount: { $exists: false } }, { $set: { followersCount: 0 } })

  await User.updateMany({ followingCount: { $exists: false } }, { $set: { followingCount: 0 } })
})

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await User.find(
      {},
      {
        name: 1,
        picture: 1,
        followersCount: 1,
        followingCount: 1,
      },
    )
      .sort({ createdAt: -1 })
      .limit(50)

    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Users fetch failed' })
  }
})

router.get('/notifications', auth, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const skip = (page - 1) * limit

    // takip ettiklerinin IDs
    const following = await Follow.find({ followerId: userId }).select('followingId').lean()
    const followingIds = following.map((f) => f.followingId)

    // Aggregation ile tüm collection’ları birleştir
    const notifications = await Follow.aggregate([
      { $match: { followingId: userId } },
      { $project: { type: 'follow', actorId: '$followerId', orgId: null, createdAt: 1 } },

      {
        $unionWith: {
          coll: 'likes',
          pipeline: [
            { $match: { userId: { $in: followingIds } } },
            { $project: { type: 'like', actorId: '$userId', orgId: '$orgId', createdAt: 1 } },
          ],
        },
      },

      {
        $unionWith: {
          coll: 'checkins',
          pipeline: [
            { $match: { userId: { $in: followingIds } } },
            { $project: { type: 'checkin', actorId: '$userId', orgId: '$orgId', createdAt: 1 } },
          ],
        },
      },

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ])

    // populate actor ve org
    await User.populate(notifications, { path: 'actorId', select: 'name picture' })
    await Org.populate(notifications, { path: 'orgId', select: 'name imageUrl' })

    // frontend’e uygun format
    const formatted = notifications.map((n) => ({
      id: n._id,
      type: n.type,
      actor: n.actorId,
      org: n.orgId || undefined,
      createdAt: n.createdAt,
    }))

    res.json({
      page,
      limit,
      data: formatted,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Notification fetch failed' })
  }
})

export default router
