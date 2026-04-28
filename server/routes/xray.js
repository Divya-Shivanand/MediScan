const router = require('express').Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { analyzeXray } = require('../utils/gemini');
const HealthForm = require('../models/HealthForm');
const Report = require('../models/Report');
const fs = require('fs');

router.post('/analyze', protect, upload.single('xray'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const healthForm = await HealthForm.findOne({ patient: req.user._id });
    if (!healthForm) return res.status(400).json({ message: 'Please complete health form first' });

    // Run AI analysis
    const analysis = await analyzeXray(req.file.path, healthForm);

    // Save report
    const report = await Report.create({
      patient:    req.user._id,
      healthForm: healthForm._id,
      xrayPath:   req.file.path,
      xrayFindings:      analysis.xrayFindings,
      predictedDiseases: analysis.predictedDiseases,
      riskScore:         analysis.riskScore,
      recommendations:   analysis.recommendations,
      reportText:        analysis.reportText,
    });

    res.json(report);
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;