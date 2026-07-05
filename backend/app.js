const express = require('express')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const publicRoutes = require('./routes/publicRoutes')
const { uploadsDir } = require('./middleware/upload')
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler')

const app = express()

app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(uploadsDir))

// Development CORS: frontend runs on :5173, backend on :5000.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(204).end()
  next()
})

app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/public', publicRoutes)

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'backend', time: new Date().toISOString() })
})

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
