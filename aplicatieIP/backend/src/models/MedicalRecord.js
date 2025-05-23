const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['consultation', 'test', 'procedure', 'vaccination'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String
  },
  treatment: {
    type: String
  },
  prescriptions: [{
    medication: String,
    dosage: String,
    frequency: String,
    duration: String,
    notes: String
  }],
  testResults: [{
    testName: String,
    result: String,
    date: Date,
    normalRange: String,
    unit: String
  }],
  attachments: [{
    name: String,
    type: String,
    url: String
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema); 