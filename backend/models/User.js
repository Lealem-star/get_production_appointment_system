const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff', 'customer'], required: true },
    status: { type: String, enum: ['active', 'blocked'], default: 'active', required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('User', userSchema)
