const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { chatWithAssistant } = require('../utils/gemini');
const Report = require('../models/Report');

router.post('/chat', protect, async (req, res) => {
  try {
    const { messages, reportId } = req.body;

    let reportContext = null;
    if (reportId) {
      const report = await Report.findById(reportId).lean();
      if (report && report.patient.toString() === req.user._id.toString()) {
        reportContext = {
          findings: report.xrayFindings,
          diseases: report.predictedDiseases,
          riskScore: report.riskScore,
          recommendations: report.recommendations
        };
      }
    }

    const reply = await chatWithAssistant(messages, reportContext);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;