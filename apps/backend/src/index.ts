import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import routes from './routes/index'
import { connectDB } from './db'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

connectDB()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api', routes)

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})
