const mongoose = require('mongoose');

const healthFormSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age:     Number,
  gender:  String,
  weight:  Number,
  height:  Number,
  bloodGroup: String,
  symptoms: [String],
  medicalHistory: [String],
  currentMedications: [String],
  allergies: [String],
  smokingStatus:  String,
  alcoholUsage:   String,
  exerciseFrequency: String,
  familyHistory:  [String],
  chiefComplaint: String,
}, { timestamps: true });

module.exports = mongoose.model('HealthForm', healthFormSchema);