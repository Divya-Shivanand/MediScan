const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeXray = async (imagePath, healthData) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const imageBytes = fs.readFileSync(imagePath);
  const base64Image = imageBytes.toString('base64');
  const ext = path.extname(imagePath).slice(1).toLowerCase();
  const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };

  const prompt = `You are a senior radiologist and medical AI assistant.

Patient Profile:
- Age: ${healthData.age}, Gender: ${healthData.gender}
- Symptoms: ${healthData.symptoms?.join(', ')}
- Medical History: ${healthData.medicalHistory?.join(', ')}
- Chief Complaint: ${healthData.chiefComplaint}

Analyze this medical image and provide a structured JSON response ONLY (no markdown):
{
  "xrayFindings": "detailed findings from the image",
  "predictedDiseases": [
    {
      "name": "disease name",
      "confidence": 85,
      "category": "respiratory|cardiac|neurological|metabolic|oncological|musculoskeletal",
      "severity": "low|moderate|high"
    }
  ],
  "riskScore": 65,
  "recommendations": ["recommendation 1", "recommendation 2"],
  "reportText": "Full narrative medical report suitable for a doctor"
}`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType: mimeMap[ext] || 'image/jpeg', data: base64Image } }
  ]);

  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
};

exports.chatWithAssistant = async (messages, reportContext) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const systemContext = reportContext
    ? `You are MediScan AI, a compassionate medical assistant. 
       Patient's report context: ${JSON.stringify(reportContext)}
       Answer questions about their health report clearly and empathetically.
       Always recommend seeing a specialist for serious concerns.`
    : `You are MediScan AI, a compassionate medical assistant.
       Provide general health information. Always recommend professional consultation.`;

  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const chat = model.startChat({
    history,
    systemInstruction: systemContext
  });

  const lastMsg = messages[messages.length - 1].content;
  const result = await chat.sendMessage(lastMsg);
  return result.response.text();
};

exports.getDiseaseInfo = async (diseaseName) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Provide structured JSON info about "${diseaseName}" (no markdown):
{
  "overview": "2-3 sentence overview",
  "causes": ["cause1", "cause2"],
  "symptoms": ["symptom1", "symptom2"],
  "prevention": ["tip1", "tip2"],
  "treatments": ["treatment1", "treatment2"],
  "category": "respiratory|cardiac|neurological|metabolic|oncological"
}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/```json|```/g, '').trim();
  return JSON.parse(text);
};