const router = require('express').Router();
const { protect } = require('../middleware/auth');
const HealthForm = require('../models/HealthForm');

// Save/update health form
router.post('/', protect, async (req, res) => {
  try {
    const existing = await HealthForm.findOne({ patient: req.user._id });
    const data = { ...req.body, patient: req.user._id };

    const form = existing
      ? await HealthForm.findOneAndUpdate({ patient: req.user._id }, data, { new: true })
      : await HealthForm.create(data);

    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get health form
router.get('/', protect, async (req, res) => {
  const form = await HealthForm.findOne({ patient: req.user._id });
  res.json(form);
});

// Doctor: get patient's form
router.get('/:patientId', protect, async (req, res) => {
  const form = await HealthForm.findOne({ patient: req.params.patientId });
  res.json(form);
});

module.exports = router;