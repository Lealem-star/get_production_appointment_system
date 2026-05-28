const crypto = require('crypto')

const tokens = new Map()

function issueToken(role) {
  const token = crypto.randomBytes(24).toString('hex')
  tokens.set(token, role)
  return token
}

function getRoleByToken(token) {
  return tokens.get(token) || null
}

module.exports = { issueToken, getRoleByToken }
