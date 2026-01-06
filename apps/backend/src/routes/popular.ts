import { Request, Response, Router } from 'express'
import Org from '../models/Org'
import optionalAuth from '../middlewares/optionalAuth'
import Checkin from '../models/Checkin'
import Like from '../models/Like'
import mongoose from 'mongoose'

const router = Router()

router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id

    // 🔹 New Places: createdAt tersten, limit 10
    const newPlaces = await Org.find().sort({ createdAt: -1 }).limit(10).lean()

    // 🔹 Bu ayın başı ve sonu
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

    // 🔹 Favorite (en çok beğeni) bu ay
    const favoriteAggregation = await Like.aggregate([
      { $match: { createdAt: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: '$orgId', likeCount: { $sum: 1 } } },
      { $sort: { likeCount: -1 } },
      { $limit: 10 },
    ])

    const mostVisitedAggregation = await Checkin.aggregate([
      { $match: { createdAt: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: '$orgId', visitCount: { $sum: 1 } } },
      { $sort: { visitCount: -1 } },
      { $limit: 10 },
    ])

    // 🔹 Org detaylarını ve isLiked ekle
    const populateOrgWithLike = async (orgIds: mongoose.Types.ObjectId[]) => {
      return Org.aggregate([
        { $match: { _id: { $in: orgIds } } },
        // isLiked ekleme
        ...(userId
          ? [
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
                            { $eq: ['$userId', new mongoose.Types.ObjectId(userId)] },
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
            ]
          : []),
      ])
    }

    const favorite = await populateOrgWithLike(favoriteAggregation.map((f) => f._id))
    const mostVisited = await populateOrgWithLike(mostVisitedAggregation.map((f) => f._id))

    res.json({
      success: true,
      data: {
        newPlaces,
        favorite,
        mostVisited,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router
