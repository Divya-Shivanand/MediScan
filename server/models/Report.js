const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patient:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  healthForm: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthForm' },
  xrayPath:   String,
  xrayFindings: String,
  predictedDiseases: [{
    name:       String,
    confidence: Number,
    category:   String,
    severity:   String,
  }],
  riskScore:     Number,
  recommendations: [String],
  reportText:  String,
  doctorNotes: String,
  status: { type: String, enum: ['pending', 'reviewed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);