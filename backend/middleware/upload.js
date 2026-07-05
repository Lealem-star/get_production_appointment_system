const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const multer = require('multer')

const uploadsDir = path.join(__dirname, '..', 'uploads')

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
}

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    ensureUploadsDir()
    cb(null, uploadsDir)
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg'
    cb(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (allowedMimeTypes.has(file.mimetype)) {
      cb(null, true)
      return
    }
    cb(new Error('Only JPG, PNG, WEBP, and GIF images are allowed'))
  },
})

module.exports = { upload, uploadsDir }
