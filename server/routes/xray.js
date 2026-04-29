const router   = require('express').Router();
const path     = require('path');
const { protect } = require('../middleware/auth');
const upload   = require('../middleware/upload');
const { analyzeXray, analyzeWithHuggingFace } = require('../utils/gemini');
const { calculateSymptomScores } = require('../utils/diseaseData');
const { SAMPLE_CASES } = require('../utils/sampleData');
const HealthForm = require('../models/HealthForm');
const Report     = require('../models/Report');
const fs = require('fs');

// ─── Main X-ray Analysis ──────────────────────────────────────────────────
router.post('/analyze', protect, upload.single('xray'), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'No X-ray file uploaded' });

    const healthForm = await HealthForm.findOne({ patient: req.user._id });
    if (!healthForm)
      return res.status(400).json({ message: 'Please complete your health form first' });

    console.log('📸 Analyzing:', req.file.originalname);

    // Step 1 — HuggingFace pre-classification
    let hfResult = null;
    let hfClassification = null;
    try {
      hfResult = await analyzeWithHuggingFace(req.file.path);
      if (hfResult && hfResult[0]) {
        hfClassification = {
          label:      hfResult[0].label,
          confidence: Math.round(hfResult[0].score * 100)
        };
        console.log('🤗 HF result:', hfClassification);
      }
    } catch (err) {
      console.log('⚠️ HuggingFace skipped:', err.message);
    }

    // Step 2 — Gemini full analysis
    const analysis = await analyzeXray(req.file.path, healthForm, hfResult);

    // Step 3 — Save report
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
    console.error('❌ Error:', err.message);
    if (req.file && fs.existsSync(req.file.path))
      fs.unlinkSync(req.file.path);
    res.status(500).json({ message: err.message });
  }
});

// ─── Get Sample X-rays for Demo ──────────────────────────────────────────
router.get('/samples', protect, (req, res) => {
  const categories = ['pneumonia', 'normal', 'tuberculosis', 'copd', 'asthma'];
  const samples = {};

  categories.forEach(cat => {
    const catDir = path.join(__dirname, `../uploads/samples/${cat}`);
    try {
      if (fs.existsSync(catDir)) {
        const files = fs.readdirSync(catDir)
          .filter(f => ['.jpg', '.jpeg', '.png']
            .includes(path.extname(f).toLowerCase()))
          .slice(0, 3)
          .map(f => ({
            filename: f,
            url:      `/uploads/samples/${cat}/${f}`,
            category: cat,
            label:    cat.charAt(0).toUpperCase() + cat.slice(1)
          }));
        samples[cat] = files;
      } else {
        samples[cat] = [];
      }
    } catch {
      samples[cat] = [];
    }
  });

  res.json(samples);
});

// ─── Get Sample Cases with Patient Profiles ───────────────────────────────
router.get('/sample-cases', protect, (req, res) => {
  const { disease } = req.query;
  const cases = disease
    ? SAMPLE_CASES.filter(c => c.disease.toLowerCase() === disease.toLowerCase())
    : SAMPLE_CASES;

  // Check which sample files actually exist
  const available = cases.map(c => ({
    ...c,
    fileExists: fs.existsSync(path.join(__dirname, '..', c.imagePath))
  }));

  res.json(available);
});

// ─── Analyze a Sample Case (for demo) ────────────────────────────────────
router.post('/analyze-sample/:caseId', protect, async (req, res) => {
  try {
    const sampleCase = SAMPLE_CASES.find(c => c.id === req.params.caseId);
    if (!sampleCase)
      return res.status(404).json({ message: 'Sample case not found' });

    const imagePath = path.join(__dirname, '..', sampleCase.imagePath);
    if (!fs.existsSync(imagePath))
      return res.status(404).json({ message: 'Sample image not found on server' });

    // Use sample case patient profile
    const healthData = sampleCase.patientProfile;

    // HuggingFace analysis
    let hfResult = null;
    let hfClassification = null;
    try {
      hfResult = await analyzeWithHuggingFace(imagePath);
      if (hfResult?.[0]) {
        hfClassification = {
          label:      hfResult[0].label,
          confidence: Math.round(hfResult[0].score * 100)
        };
      }
    } catch (err) {
      console.log('HF skipped:', err.message);
    }

    // Gemini analysis
    const analysis = await analyzeXray(imagePath, healthData, hfResult);

    // Save as a report
    const report = await Report.create({
      patient:           req.user._id,
      xrayPath:          sampleCase.imagePath,
      hfClassification,
      xrayFindings:      analysis.xrayFindings,
      predictedDiseases: analysis.predictedDiseases,
      symptomMatchScore: analysis.symptomMatchScore,
      riskScore:         analysis.riskScore,
      recommendations:   analysis.recommendations,
      reportText:        analysis.reportText,
    });

    res.json({ report, sampleCase });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;