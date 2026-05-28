const jwt = require('jsonwebtoken')

function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev-jwt-secret-change-me'
}

function getBearerToken(req) {
  const header = req.headers.authorization || ''
  const match = /^Bearer\s+(.+)$/i.exec(header)
  return match ? match[1] : null
}

function requireAuth(req, res, next) {
  const token = getBearerToken(req)
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  try {
    const payload = jwt.verify(token, getJwtSecret())
    req.userRole = payload.role
    req.userId = payload.sub
    return next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }

}

module.exports = { requireAuth }
