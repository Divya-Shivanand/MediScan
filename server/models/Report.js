const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patient:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  healthForm: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthForm' },
  xrayPath:   String,

  // HuggingFace quick classification result
  hfClassification: {
    label:      String,   // PNEUMONIA or NORMAL
    confidence: Number    // 0-100
  },

  // Gemini full analysis
  xrayFindings: String,

  predictedDiseases: [{
    name: {
      type: String,
      enum: ['Pneumonia', 'Tuberculosis', 'COPD', 'Asthma', 'Normal']
    },
    confidence: Number,   // 0-100
    severity: {
      type: String,
      enum: ['low', 'moderate', 'high']
    },
    // Key X-ray hallmarks found
    hallmarks: [String],
    // Disease-specific details
    details: String
  }],

  // Symptom match score (how many symptoms match the disease)
  symptomMatchScore: Number,

  riskScore:       Number,   // 0-100
  recommendations: [String],
  reportText:      String,   // full AI narrative

  // Doctor review
  doctorNotes: String,
  reviewedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['pending', 'reviewed'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);