const mongoose = require('mongoose');

const healthFormSchema = new mongoose.Schema({
  patient:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age:        { type: Number, min: 0, max: 120 },
  gender:     { type: String, enum: ['Male', 'Female', 'Other'] },
  weight:     Number,  // kg
  height:     Number,  // cm
  bloodGroup: { type: String, enum: ['A+','A-','B+','B-','O+','O-','AB+','AB-',''] },

  // Respiratory-specific symptoms
  symptoms: [{
    type: String,
    enum: [
      'Cough (dry)',
      'Cough (productive/wet)',
      'Shortness of breath',
      'Wheezing',
      'Chest tightness',
      'Chest pain',
      'Fever',
      'Night sweats',
      'Weight loss',
      'Fatigue',
      'Loss of smell/taste',
      'Haemoptysis (coughing blood)',
      'Cyanosis (blue lips/fingers)',
      'Rapid breathing'
    ]
  }],

  // Duration of symptoms
  symptomDuration: {
    type: String,
    enum: ['Less than 1 week', '1-2 weeks', '2-4 weeks', 'More than 1 month', 'More than 3 months']
  },

  medicalHistory: [{
    type: String,
    enum: ['Pneumonia', 'Tuberculosis', 'COPD', 'Asthma', 'COVID-19', 'Smoking', 'Diabetes', 'HIV/AIDS', 'None']
  }],

  smokingStatus: {
    type: String,
    enum: ['Never', 'Former smoker', 'Current smoker (light)', 'Current smoker (heavy)']
  },

  // Smoking pack years (for COPD risk)
  packYears:    Number,

  // Exposure history (important for TB, COPD)
  exposureHistory: [{
    type: String,
    enum: ['TB contact', 'Dusty environment', 'Chemical fumes', 'Animal contact', 'Recent travel', 'None']
  }],

  currentMedications: String,
  allergies:          String,
  chiefComplaint:     String,
  oxygenSaturation:   Number,  // SpO2 %
  respiratoryRate:    Number,  // breaths per minute

}, { timestamps: true });

module.exports = mongoose.model('HealthForm', healthFormSchema);