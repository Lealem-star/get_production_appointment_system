const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    imageUrl: { type: String, trim: true, default: '' },
    published: { type: Boolean, default: false, required: true },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Post', postSchema)
