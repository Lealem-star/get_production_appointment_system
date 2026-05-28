const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const connectDB = require('../config/db')
const User = require('../models/User')

dotenv.config()

function parseArgs(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const value = argv[i + 1]
    if (!value || value.startsWith('--')) {
      args[key] = 'true'
    } else {
      args[key] = value
      i += 1
    }
  }
  return args
}

function getInput() {
  const args = parseArgs(process.argv)
  const positionals = process.argv.slice(2).filter((token) => !token.startsWith('--'))

  // Fallback for shells/npm variants that pass plain positional args:
  // node scripts/create-admin.js "Name" "email@example.com" "password"
  const positionalName = positionals[0] || ''
  const positionalEmail = positionals[1] || ''
  const positionalPassword = positionals[2] || ''

  return {
    name: (args.name || positionalName || process.env.ADMIN_NAME || '').trim(),
    email: (args.email || positionalEmail || process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
    password: args.password || positionalPassword || process.env.ADMIN_PASSWORD || '',
  }
}

function usageAndExit() {
  // eslint-disable-next-line no-console
  console.error(
    'Usage: npm run create:admin -- --name "Your Name" --email "admin@studio.local" --password "StrongPass123!"',
  )
  process.exit(1)
}

async function run() {
  const { name, email, password } = getInput()
  if (!name || !email || !password) usageAndExit()

  await connectDB()

  const existing = await User.findOne({ email }).lean()
  if (existing) {
    // eslint-disable-next-line no-console
    console.log(`Admin already exists for email: ${email}`)
    process.exit(0)
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const id = `USR-${Date.now()}`

  await User.create({
    id,
    name,
    email,
    password: passwordHash,
    role: 'admin',
    status: 'active',
  })

  // eslint-disable-next-line no-console
  console.log(`Admin created successfully (${email})`)
  process.exit(0)
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to create admin:', error.message || error)
  process.exit(1)
})
