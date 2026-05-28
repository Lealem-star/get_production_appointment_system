const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function getJwtSecret() {
  return process.env.JWT_SECRET || 'dev-jwt-secret-change-me'
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {}
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const normalizedPassword = String(password || '')

    const user = await User.findOne({
      email: normalizedEmail,
      role: { $in: ['admin', 'staff'] },
      status: 'active',
    })

    if (!user) return res.json({ role: null })

    const passwordOk = await bcrypt.compare(normalizedPassword, user.password)
    if (!passwordOk) return res.json({ role: null })

    const token = jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      getJwtSecret(),
      { expiresIn: '12h' },
    )

    return res.json({ role: user.role, token })
  } catch (error) {
    return next(error)
  }
}

module.exports = { login }
