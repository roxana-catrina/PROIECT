const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    address: String,
    phone: String,
    email: String,
    medicalHistory: String,
    doctorId: String,
    _class: { type: String, select: false }  // excludem _class din queries
});

module.exports = mongoose.model('Patient', patientSchema, 'Patient'); // specificăm explicit numele colecției