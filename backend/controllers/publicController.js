const ContactMessage = require('../models/ContactMessage')
const Appointment = require('../models/Appointment')

async function createContact(req, res, next) {
  try {
    const { name, email, details } = req.body || {}

    await ContactMessage.create({
      name: String(name || '').trim(),
      email: String(email || '').trim().toLowerCase(),
      details: String(details || '').trim(),
    })

    return res.json({ ok: true })
  } catch (error) {
    return next(error)
  }
}

async function createAppointment(req, res, next) {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      service,
      clientType,
      location,
      date,
      time,
      notes,
    } = req.body || {}

    if (!customerName || !customerEmail || !customerPhone || !service || !date || !time) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' })
    }

    const count = await Appointment.countDocuments()
    const id = `APT-${1001 + count}`

    await Appointment.create({
      id,
      customerName: String(customerName || '').trim(),
      customerEmail: String(customerEmail || '').trim().toLowerCase(),
      customerPhone: String(customerPhone || '').trim(),
      service: String(service || '').trim(),
      date: String(date || '').trim(),
      time: String(time || '').trim(),
      staffName: 'Unassigned',
      clientType: String(clientType || '').trim(),
      location: String(location || '').trim(),
      notes: String(notes || '').trim(),
      status: 'pending',
    })

    return res.json({ ok: true, id })
  } catch (error) {
    return next(error)
  }
}

module.exports = { createContact, createAppointment }
