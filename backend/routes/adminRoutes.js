const express = require('express')
const {
  getBootstrap,
  updateAppointment,
  updateUser,
  createUser,
  createPost,
  updatePost,
} = require('../controllers/adminController')
const { uploadImage } = require('../controllers/uploadController')
const { requireAuth } = require('../middleware/auth')
const { requireAdmin } = require('../middleware/requireAdmin')
const { upload } = require('../middleware/upload')

const router = express.Router()

router.get('/bootstrap', requireAuth, getBootstrap)
router.patch('/appointments/:id', requireAuth, updateAppointment)
router.post('/upload', requireAuth, requireAdmin, upload.single('image'), uploadImage)
router.patch('/users/:id', requireAuth, requireAdmin, updateUser)
router.post('/users', requireAuth, requireAdmin, createUser)
router.post('/posts', requireAuth, requireAdmin, createPost)
router.patch('/posts/:id', requireAuth, requireAdmin, updatePost)

module.exports = router
