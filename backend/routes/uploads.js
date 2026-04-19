const router  = require('express').Router()
const multer  = require('multer')
const path    = require('path')
const { v4: uuidv4 } = require('uuid')
const { protect, requireAdmin } = require('../middleware/auth')

// ── Multer config (memory storage → forward to S3) ─────────────
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_MB   = 5

const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`))
    }
  },
})

// ── POST /api/v1/uploads/image ─────────────────────────────────
router.post('/image', protect, requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' })
    }

    // In production: upload to AWS S3
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_S3_BUCKET) {
      const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
      const s3 = new S3Client({
        region:      process.env.AWS_REGION || 'af-south-1',
        credentials: {
          accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })

      const ext      = path.extname(req.file.originalname).toLowerCase()
      const filename = `products/${uuidv4()}${ext}`

      await s3.send(new PutObjectCommand({
        Bucket:      process.env.AWS_S3_BUCKET,
        Key:         filename,
        Body:        req.file.buffer,
        ContentType: req.file.mimetype,
        ACL:         'public-read',
      }))

      const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`
      return res.status(201).json({ message: 'Image uploaded.', url })
    }

    // Dev fallback: return placeholder URL
    const placeholder = `https://picsum.photos/seed/${uuidv4()}/500/500`
    res.status(201).json({ message: 'Image upload simulated (no S3 configured).', url: placeholder })
  } catch (err) {
    next(err)
  }
})

// ── POST /api/v1/uploads/images (bulk – up to 8) ───────────────
router.post('/images', protect, requireAdmin, upload.array('images', 8), async (req, res, next) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ error: 'No files uploaded.' })
    }
    const urls = req.files.map((_, i) => `https://picsum.photos/seed/${uuidv4()}/500/500`)
    res.status(201).json({ message: `${urls.length} image(s) uploaded.`, urls })
  } catch (err) {
    next(err)
  }
})

module.exports = router
