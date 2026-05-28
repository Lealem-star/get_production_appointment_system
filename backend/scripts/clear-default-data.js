const dotenv = require('dotenv')
const connectDB = require('../config/db')
const Appointment = require('../models/Appointment')
const Post = require('../models/Post')
const ContactMessage = require('../models/ContactMessage')
const User = require('../models/User')

dotenv.config()

async function run() {
  await connectDB()

  const [appointmentsResult, postsResult, contactResult, usersResult] = await Promise.all([
    Appointment.deleteMany({}),
    Post.deleteMany({}),
    ContactMessage.deleteMany({}),
    User.deleteMany({ role: { $ne: 'admin' } }),
  ])

  // eslint-disable-next-line no-console
  console.log('Cleared data:')
  // eslint-disable-next-line no-console
  console.log(`- appointments: ${appointmentsResult.deletedCount}`)
  // eslint-disable-next-line no-console
  console.log(`- posts: ${postsResult.deletedCount}`)
  // eslint-disable-next-line no-console
  console.log(`- contact messages: ${contactResult.deletedCount}`)
  // eslint-disable-next-line no-console
  console.log(`- non-admin users: ${usersResult.deletedCount}`)

  process.exit(0)
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to clear default data:', error.message || error)
  process.exit(1)
})
