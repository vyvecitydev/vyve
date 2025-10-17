import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes/index'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use('/api', routes)

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})
