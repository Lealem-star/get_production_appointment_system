const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true },
    customerPhone: { type: String, trim: true },
    service: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    staffName: { type: String, required: true, trim: true, default: 'Unassigned' },
    clientType: { type: String, trim: true },
    location: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      required: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Appointment', appointmentSchema)
