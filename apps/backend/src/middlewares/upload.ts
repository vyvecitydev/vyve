import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import mime from 'mime-types'

// Storage ayarı
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Dosyalar uploads klasörüne kaydedilecek
  },
  filename: function (req, file, cb) {
    const ext = mime.extension(file.mimetype) // dosya uzantısını mime ile al
    cb(null, uuidv4() + '.' + ext) // örn: 6f1a7b2a-1234-5678.png
  },
})

// Dosya filtresi (yalnızca resim kabul et)
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

export const upload = multer({ storage, fileFilter })
