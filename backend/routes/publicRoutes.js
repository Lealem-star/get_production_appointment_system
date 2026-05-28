const express = require('express')
const { createContact, createAppointment } = require('../controllers/publicController')

const router = express.Router()

router.post('/contact', createContact)
router.post('/appointments', createAppointment)

module.exports = router
