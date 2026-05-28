const Appointment = require('../models/Appointment')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

async function ensureHashedPasswords() {
  const users = await User.find({}, { _id: 1, password: 1 })
  const updates = []

  for (const user of users) {
    const isBcryptHash = typeof user.password === 'string' && /^\$2[aby]\$/.test(user.password)
    if (!isBcryptHash) {
      updates.push(
        User.updateOne(
          { _id: user._id },
          { $set: { password: await bcrypt.hash(String(user.password || ''), 10) } },
        ),
      )
    }
  }

  if (updates.length > 0) {
    await Promise.all(updates)
  }
}

async function seedInitialData() {
  // Intentionally no default data seeding.
  // We only keep password migration logic for legacy records.
  await ensureHashedPasswords()
}

module.exports = { seedInitialData }
