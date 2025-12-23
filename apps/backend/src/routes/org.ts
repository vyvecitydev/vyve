import { Request, Response, Router } from 'express'
import Org from '../models/Org' // Org modelinin yolu
import User from '../models/user' // User modelinin yolu

const router = Router()

// Tüm organizationları getir
router.get('/', async (req: Request, res: Response) => {
  try {
    // Org verilerini çekiyoruz ve owner ile members alanlarını populate ediyoruz
    const orgs = await Org.find()
      // .populate('owner', 'name email') // sadece name ve email alanlarını al
      // .populate('members', 'name email') // üyeler
      .lean() // plain JS objesi olarak dön
      .exec()

    res.status(200).json({ success: true, data: orgs })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router
