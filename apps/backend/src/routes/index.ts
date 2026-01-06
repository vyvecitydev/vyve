import { Router } from 'express'
import authRoutes from './auth'
import orgRoutes from './org'
import profileRoutes from './profile'
import popularRoutes from './popular'

const router = Router()

router.use('/auth', authRoutes)
router.use('/org', orgRoutes)
router.use('/profile', profileRoutes)
router.use('/popular', popularRoutes)

export default router
