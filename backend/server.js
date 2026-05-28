const dotenv = require('dotenv')
const app = require('./app')
const connectDB = require('./config/db')
const { seedInitialData } = require('./services/seedService')

dotenv.config()

const PORT = Number(process.env.PORT || 5000)

async function startServer() {
  await connectDB()
  await seedInitialData()

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${PORT}`)
  })
}

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start backend server:', error)
  process.exit(1)
})