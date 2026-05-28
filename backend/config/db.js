const mongoose = require('mongoose')

function getMongoUri() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Missing MONGODB_URI in backend environment')
  }
  return uri
}

async function connectDB() {
  const uri = getMongoUri()
  await mongoose.connect(uri)
  // eslint-disable-next-line no-console
  console.log('MongoDB connected')
}

module.exports = connectDB
