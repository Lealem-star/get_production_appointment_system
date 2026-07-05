const bcrypt = require('bcryptjs')
const Appointment = require('../models/Appointment')
const ContactMessage = require('../models/ContactMessage')
const User = require('../models/User')
const Post = require('../models/Post')

const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled']
const USER_ROLES = ['admin', 'staff', 'customer']
const USER_STATUSES = ['active', 'blocked']

function mapAppointment(item) {
  return {
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
  }
}

async function getStaffMembers() {
  const staff = await User.find(
    { role: { $in: ['admin', 'staff'] }, status: 'active' },
    { _id: 0, id: 1, name: 1 },
  ).lean()
  return staff.map((item) => ({ id: item.id, name: item.name }))
}

async function getBootstrap(req, res, next) {
  try {
    const isAdmin = req.userRole === 'admin'

    const appointmentsPromise = Appointment.find({}).sort({ createdAt: -1 }).lean()
    const staffMembersPromise = getStaffMembers()

    if (!isAdmin) {
      const [appointments, staffMembers] = await Promise.all([appointmentsPromise, staffMembersPromise])
      return res.json({
        role: req.userRole,
        appointments: appointments.map(mapAppointment),
        users: [],
        posts: [],
        contactMessages: [],
        staffMembers,
      })
    }

    const [appointments, users, posts, contactMessages, staffMembers] = await Promise.all([
      appointmentsPromise,
      User.find({}, { _id: 0, __v: 0, password: 0, createdAt: 0, updatedAt: 0 }).lean(),
      Post.find({}, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 }).lean(),
      ContactMessage.find({}).sort({ createdAt: -1 }).lean(),
      staffMembersPromise,
    ])

    return res.json({
      role: req.userRole,
      appointments: appointments.map(mapAppointment),
      users,
      posts,
      contactMessages: contactMessages.map((item) => ({
        id: String(item._id),
        name: item.name,
        phone: item.phone,
        details: item.details,
        createdAt: item.createdAt,
      })),
      staffMembers,
    })
  } catch (error) {
    return next(error)
  }
}

async function updateAppointment(req, res, next) {
  try {
    const { id } = req.params
    const { status, staffName } = req.body || {}
    const update = {}

    if (status !== undefined) {
      if (!APPOINTMENT_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' })
      }
      update.status = status
    }

    if (staffName !== undefined) {
      update.staffName = String(staffName).trim() || 'Unassigned'
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    const appointment = await Appointment.findOneAndUpdate({ id }, { $set: update }, { new: true }).lean()
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' })

    return res.json({ ok: true, appointment: mapAppointment(appointment) })
  } catch (error) {
    return next(error)
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params
    const { role, status } = req.body || {}
    const update = {}

    if (role !== undefined) {
      if (!USER_ROLES.includes(role)) return res.status(400).json({ error: 'Invalid role' })
      update.role = role
    }

    if (status !== undefined) {
      if (!USER_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' })
      update.status = status
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    const user = await User.findOneAndUpdate({ id }, { $set: update }, { new: true })
      .select({ _id: 0, __v: 0, password: 0, createdAt: 0, updatedAt: 0 })
      .lean()

    if (!user) return res.status(404).json({ error: 'User not found' })

    return res.json({ ok: true, user })
  } catch (error) {
    return next(error)
  }
}

async function createUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body || {}
    const normalizedName = String(name || '').trim()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const normalizedPassword = String(password || '')
    const normalizedRole = String(role || 'staff').trim()

    if (!normalizedName || !normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }

    if (!['staff', 'customer'].includes(normalizedRole)) {
      return res.status(400).json({ error: 'Role must be staff or customer' })
    }

    const existing = await User.findOne({ email: normalizedEmail }).lean()
    if (existing) return res.status(409).json({ error: 'Email already in use' })

    const passwordHash = await bcrypt.hash(normalizedPassword, 10)
    const id = `USR-${Date.now()}`

    const user = await User.create({
      id,
      name: normalizedName,
      email: normalizedEmail,
      password: passwordHash,
      role: normalizedRole,
      status: 'active',
    })

    return res.status(201).json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    return next(error)
  }
}

async function createPost(req, res, next) {
  try {
    const { title, category, imageUrl, published } = req.body || {}
    const normalizedTitle = String(title || '').trim()
    const normalizedCategory = String(category || '').trim()
    const normalizedImageUrl = String(imageUrl || '').trim()

    if (!normalizedTitle || !normalizedCategory || !normalizedImageUrl) {
      return res.status(400).json({ error: 'Title, category, and image URL are required' })
    }

    const count = await Post.countDocuments()
    const id = `PST-${1001 + count}`

    const post = await Post.create({
      id,
      title: normalizedTitle,
      category: normalizedCategory,
      imageUrl: normalizedImageUrl,
      published: Boolean(published),
    })

    return res.status(201).json({
      ok: true,
      post: {
        id: post.id,
        title: post.title,
        category: post.category,
        imageUrl: post.imageUrl,
        published: post.published,
      },
    })
  } catch (error) {
    return next(error)
  }
}

async function updatePost(req, res, next) {
  try {
    const { id } = req.params
    const { title, category, imageUrl, published } = req.body || {}
    const update = {}

    if (title !== undefined) update.title = String(title).trim()
    if (category !== undefined) update.category = String(category).trim()
    if (imageUrl !== undefined) update.imageUrl = String(imageUrl).trim()
    if (published !== undefined) update.published = Boolean(published)

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    const post = await Post.findOneAndUpdate({ id }, { $set: update }, { new: true })
      .select({ _id: 0, __v: 0, createdAt: 0, updatedAt: 0 })
      .lean()

    if (!post) return res.status(404).json({ error: 'Post not found' })

    return res.json({ ok: true, post })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getBootstrap,
  updateAppointment,
  updateUser,
  createUser,
  createPost,
  updatePost,
}
