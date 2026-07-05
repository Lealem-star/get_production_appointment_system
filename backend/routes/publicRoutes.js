const express = require('express')
const { createContact, createAppointment, getPublishedPosts } = require('../controllers/publicController')

const router = express.Router()

router.get('/posts', getPublishedPosts)
router.post('/contact', createContact)
router.post('/appointments', createAppointment)

module.exports = router
