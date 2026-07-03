const Appointment = require('../models/Appointment')
const User = require('../models/User')
const Post = require('../models/Post')

async function getBootstrap(req, res, next) {
  try {
    const [appointments, users, posts] = await Promise.all([
      Appointment.find({}).sort({ createdAt: -1 }).lean(),
      User.find({}, { _id: 0, __v: 0, password: 0, createdAt: 0, updatedAt: 0 }).lean(),
      Post.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean(),
    ])

    return res.json({
      role: req.userRole,
      appointments: appointments.map((item) => ({
        id: item.id,
        customerName: item.customerName,
        customerPhone: item.customerPhone || '',
        customerAddress: item.customerAddress || '',
        service: item.service,
        date: item.date,
        time: item.time,
        staffName: item.staffName,
        clientType: item.clientType || '',
        location: item.location || '',
        notes: item.notes || '',
        status: item.status,
      })),
      users,
      posts,
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { getBootstrap }
