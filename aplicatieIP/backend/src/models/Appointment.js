const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency'],
    required: true
  },
  notes: {
    type: String
  },
  symptoms: [{
    type: String
  }],
  diagnosis: {
    type: String
  },
  prescription: [{
    medication: String,
    dosage: String,
    frequency: String,
    duration: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema); 