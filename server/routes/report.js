const router = require('express').Router();
const { protect, restrictTo } = require('../middleware/auth');
const Report = require('../models/Report');

// Get patient's reports
router.get('/my', protect, async (req, res) => {
  const reports = await Report.find({ patient: req.user._id }).sort('-createdAt');
  res.json(reports);
});

// Doctor: get all pending reports
router.get('/doctor/pending', protect, restrictTo('doctor'), async (req, res) => {
  const reports = await Report.find({ status: 'pending' })
    .populate('patient', 'name email')
    .sort('-createdAt');
  res.json(reports);
});

// Get single report
router.get('/:id', protect, async (req, res) => {
  const report = await Report.findById(req.params.id).populate('patient', 'name email');
  if (!report) return res.status(404).json({ message: 'Report not found' });
  res.json(report);
});

// Doctor adds notes
router.patch('/:id/notes', protect, restrictTo('doctor'), async (req, res) => {
  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { doctorNotes: req.body.notes, status: 'reviewed' },
    { new: true }
  );
  res.json(report);
});

module.exports = router;