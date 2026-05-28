const express = require('express')
const { getBootstrap } = require('../controllers/adminController')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

router.get('/bootstrap', requireAuth, getBootstrap)

module.exports = router
