function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' })
  }

  const url = `/uploads/${req.file.filename}`
  return res.json({ ok: true, url })
}

module.exports = { uploadImage }
