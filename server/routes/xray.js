const router   = require('express').Router();
const { protect } = require('../middleware/auth');
const upload   = require('../middleware/upload');
const { analyzeXray, analyzeWithHuggingFace } = require('../utils/gemini');
const { calculateSymptomScores } = require('../utils/diseaseData');
const HealthForm = require('../models/HealthForm');
const Report     = require('../models/Report');
const fs = require('fs');

router.post('/analyze', protect, upload.single('xray'), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'No X-ray file uploaded' });

    // Check health form exists
    const healthForm = await HealthForm.findOne({ patient: req.user._id });
    if (!healthForm)
      return res.status(400).json({ message: 'Please complete your health form first' });

    console.log('📸 X-ray received:', req.file.originalname);

    // Step 1 — HuggingFace quick pre-classification
    let hfResult = null;
    let hfClassification = null;
    try {
      hfResult = await analyzeWithHuggingFace(req.file.path);
      if (hfResult && hfResult[0]) {
        hfClassification = {
          label:      hfResult[0].label,
          confidence: Math.round(hfResult[0].score * 100)
        };
        console.log('✅ HF Classification:', hfClassification);
      }
    } catch (err) {
      console.log('⚠️ HuggingFace skipped:', err.message);
    }

    // Step 2 — Full Gemini analysis
    console.log('🤖 Running Gemini analysis...');
    const analysis = await analyzeXray(req.file.path, healthForm, hfResult);

    // Step 3 — Calculate symptom match score
    const symptomScores = calculateSymptomScores(healthForm.symptoms || []);

    // Step 4 — Save report to MongoDB
    const report = await Report.create({
      patient:           req.user._id,
      healthForm:        healthForm._id,
      xrayPath:          req.file.path,
      hfClassification,
      xrayFindings:      analysis.xrayFindings,
      predictedDiseases: analysis.predictedDiseases,
      symptomMatchScore: analysis.symptomMatchScore,
      riskScore:         analysis.riskScore,
      recommendations:   analysis.recommendations,
      reportText:        analysis.reportText,
    });

    console.log('✅ Report saved:', report._id);
    res.json(report);

  } catch (err) {
    console.error('❌ Analysis error:', err.message);
    if (req.file && fs.existsSync(req.file.path))
      fs.unlinkSync(req.file.path);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;