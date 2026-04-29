import axios from 'axios';
import FormData from 'form-data';
import Report from '../models/Report.js';

export default function xrayRoutes(router) {
  router.post('/xray/upload', async (req, res) => {
    try {
      const file = req.file; // multer handles upload
      const disease = req.body.disease;

      // Send image to Flask ML API
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const mlResponse = await axios.post(
        'http://localhost:5001/predict',
        formData,
        { headers: formData.getHeaders() }
      );

      const { prediction, confidence, probabilities } = mlResponse.data;

      // Determine risk score
      const riskScore = prediction === 'NORMAL' ? 
        Math.round(confidence * 0.3) : 
        Math.round(confidence);

      // Save report to MongoDB
      const report = await Report.create({
        user: req.user._id,
        disease: disease,
        prediction,
        confidence,
        probabilities,
        riskScore,
        findings: prediction === 'NORMAL'
          ? `No signs of ${disease} detected. Lungs appear clear.`
          : `Potential signs of ${disease} detected with ${confidence.toFixed(1)}% confidence. Further clinical evaluation recommended.`,
        recommendations: prediction === 'NORMAL'
          ? 'Continue regular health checkups. Maintain a healthy lifestyle.'
          : 'Please consult a pulmonologist immediately. Do not self-medicate.',
        imageUrl: `/uploads/${file.filename}`,
      });

      res.json({ reportId: report._id });

    } catch (err) {
      console.error('XRay upload error:', err.message);
      res.status(500).json({ error: 'Analysis failed' });
    }
  });
}