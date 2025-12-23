import { Router } from 'express'
import authRoutes from './auth'
import orgRoutes from './org'

const router = Router()

router.use('/auth', authRoutes)
router.use('/org', orgRoutes)

export default router
