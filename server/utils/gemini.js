const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ========== CORE 4 RESPIRATORY DISEASES ONLY ==========
const RESPIRATORY_DISEASES = {
  pneumonia: {
    name: 'Pneumonia',
    severity: 'high',
    symptoms: {
      primary: ['fever', 'cough_productive', 'shortness_of_breath', 'chest_pain', 'chills'],
      secondary: ['fatigue', 'sweating', 'nausea']
    },
    xray_findings: ['consolidation', 'air_bronchograms', 'lobar_opacity', 'infiltrates', 'pleural_effusion'],
    keywords: ['consolidation', 'opacity', 'infiltrate', 'pneumonic', 'alveolar'],
    confidence_threshold: 75,
    investigations: ['sputum_culture', 'blood_culture', 'CBC', 'CRP']
  },
  tuberculosis: {
    name: 'Tuberculosis',
    severity: 'high',
    symptoms: {
      primary: ['persistent_cough_3_weeks', 'hemoptysis', 'fever_evening', 'night_sweats', 'weight_loss'],
      secondary: ['fatigue', 'loss_appetite', 'chest_pain']
    },
    xray_findings: ['upper_lobe_infiltrates', 'cavitary_lesions', 'nodular_opacities', 'hilar_lymphadenopathy'],
    keywords: ['cavitation', 'upper_lobe', 'infiltrate', 'nodular', 'tuberculous'],
    confidence_threshold: 80,
    investigations: ['sputum_smear_AFB', 'GeneXpert_MTB_RIF', 'Mantoux_test']
  },
  asthma: {
    name: 'Asthma',
    severity: 'variable',
    symptoms: {
      primary: ['wheezing', 'shortness_of_breath', 'cough_episodic', 'chest_tightness'],
      secondary: ['breathing_difficulty_night', 'triggered_by_allergens']
    },
    xray_findings: ['normal', 'hyperinflation_during_attack', 'flattened_diaphragm'],
    keywords: ['normal_xray', 'hyperinflation', 'wheezing', 'obstructive'],
    confidence_threshold: 65,
    investigations: ['spirometry', 'peak_flow', 'bronchodilator_response']
  },
  copd: {
    name: 'COPD (Emphysema/Chronic Bronchitis)',
    severity: 'high',
    symptoms: {
      primary: ['chronic_cough', 'sputum_production', 'progressive_dyspnea', 'wheezing'],
      secondary: ['barrel_chest', 'fatigue', 'weight_loss_advanced']
    },
    xray_findings: ['hyperinflation', 'flattened_diaphragm', 'decreased_vascularity', 'bullae', 'emphysematous_changes'],
    keywords: ['hyperinflation', 'emphysema', 'chronic_bronchitis', 'barrel_chest', 'decreased_markings'],
    confidence_threshold: 75,
    investigations: ['spirometry_FEV1_FVC', 'DLCO', 'ABG']
  }
};

// ========== SAFE JSON PARSING WITH FALLBACK ==========
function safeJsonParse(text) {
  try {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```json\n?|```\n?/g, '').trim();
    
    // Try to find JSON object in text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    return { success: true, data: parsed };
  } catch (error) {
    console.error('JSON Parse Error:', error.message);
    return { success: false, error: error.message };
  }
}

// ========== FILE EXISTENCE CHECK ==========
function validateXrayFile(filePath) {
  if (!filePath) {
    throw new Error('X-ray file path not provided');
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`X-ray file not found at path: ${filePath}`);
  }
  const stats = fs.statSync(filePath);
  if (stats.size === 0) {
    throw new Error('X-ray file is empty');
  }
  return true;
}

// ========== EMERGENCY DETECTION ==========
function detectEmergency(analysis) {
  if (!analysis) return null;
  
  const emergencyFlags = {
    severeHypoxia: analysis.riskScore > 85,
    acuteRespiratoryDistress: analysis.findings?.includes('bilateral_infiltrates'),
    criticalPneumonia: analysis.predictedDiseases?.some(d => 
      d.name === 'Pneumonia' && d.severity === 'critical'
    ),
    massivePleuralEffusion: analysis.findings?.includes('massive_effusion'),
    pneumothorax: analysis.findings?.includes('pneumothorax')
  };
  
  const hasEmergency = Object.values(emergencyFlags).some(flag => flag);
  
  return hasEmergency ? {
    isEmergency: true,
    action: 'SEEK IMMEDIATE EMERGENCY CARE - CALL AMBULANCE NOW',
    reasons: Object.keys(emergencyFlags).filter(k => emergencyFlags[k])
  } : null;
}

// ========== RISK COLOR & URGENCY LEVEL ==========
function getRiskLevel(riskScore) {
  if (riskScore >= 75) {
    return { level: 'RED', urgency: 'EMERGENCY', action: 'Seek immediate medical attention' };
  }
  if (riskScore >= 50) {
    return { level: 'YELLOW', urgency: 'URGENT', action: 'Schedule doctor visit within 24 hours' };
  }
  return { level: 'GREEN', urgency: 'ROUTINE', action: 'Schedule routine checkup' };
}

// ========== XRAY ANALYSIS WITH CRASH PROTECTION ==========
exports.analyzeXray = async (imagePath, healthData) => {
  console.log(`[XRAY] Starting analysis for user ${healthData.patient}`);
  
  try {
    // MANDATORY: Validate file exists
    validateXrayFile(imagePath);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Read and encode image
    const imageBytes = fs.readFileSync(imagePath);
    const base64Image = imageBytes.toString('base64');
    const ext = path.extname(imagePath).slice(1).toLowerCase();
    const mimeMap = { 
      jpg: 'image/jpeg', 
      jpeg: 'image/jpeg', 
      png: 'image/png',
      dcm: 'application/dicom'
    };

    const mimeType = mimeMap[ext] || 'image/jpeg';
    const symptoms = healthData.symptoms?.join(', ') || 'Not specified';

    // ========== RESTRICTED TO 4 CORE DISEASES ==========
    const diseasesContext = Object.entries(RESPIRATORY_DISEASES)
      .map(([key, disease]) => `- ${disease.name}: ${disease.xray_findings.join(', ')}`)
      .join('\n');

    const prompt = `You are a chest radiologist specializing in respiratory diseases.

IMPORTANT: You MUST respond ONLY with valid JSON, no other text.

PATIENT CONTEXT:
- Age: ${healthData.age}, Gender: ${healthData.gender}
- Symptoms: ${symptoms}
- Chief Complaint: ${healthData.chiefComplaint || 'Routine checkup'}

X-RAY ANALYSIS TASK:
Analyze this chest X-ray focusing on these 4 CORE diseases ONLY:
${diseasesContext}

RESPOND WITH THIS EXACT JSON FORMAT (no markdown, no extra text):
{
  "xrayFindings": "Describe what you see in the X-ray: consolidation, hyperinflation, nodules, effusions, etc.",
  "findings": ["finding1", "finding2"],
  "predictedDiseases": [
    {
      "name": "disease name from: Pneumonia, Tuberculosis, Asthma, COPD",
      "confidence": 75,
      "severity": "low|moderate|high|critical",
      "reasoning": "Why this disease based on findings and symptoms"
    }
  ],
  "riskScore": 65,
  "recommendations": ["recommendation 1", "recommendation 2"],
  "reportText": "Professional medical summary suitable for physician review"
}`;

    console.log('[XRAY] Sending to Gemini...');
    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType, data: base64Image } }
    ]);

    const responseText = result.response.text();
    console.log('[XRAY] Gemini response received');

    // SAFE JSON PARSING
    const parseResult = safeJsonParse(responseText);
    if (!parseResult.success) {
      console.error('[XRAY] JSON parse failed, using fallback');
      return {
        xrayFindings: 'Unable to analyze X-ray. Please consult radiologist.',
        predictedDiseases: [],
        riskScore: 50,
        recommendations: ['Consult a pulmonologist for professional analysis'],
        reportText: 'AI analysis encountered technical issues. Manual review recommended.',
        fallback: true,
        disclaimer: 'This is an AI-assisted analysis and NOT a medical diagnosis'
      };
    }

    const analysis = parseResult.data;

    // Validate and sanitize response
    const sanitized = {
      xrayFindings: analysis.xrayFindings || 'Findings unclear',
      findings: Array.isArray(analysis.findings) ? analysis.findings : [],
      predictedDiseases: (analysis.predictedDiseases || []).map(d => ({
        name: d.name || 'Unknown',
        confidence: Math.min(Math.max(d.confidence || 0, 0), 100),
        severity: ['low', 'moderate', 'high', 'critical'].includes(d.severity) ? d.severity : 'moderate',
        reasoning: d.reasoning || ''
      })),
      riskScore: Math.min(Math.max(analysis.riskScore || 50, 0), 100),
      recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
      reportText: analysis.reportText || 'Report unavailable'
    };

    // Add risk level and emergency detection
    const riskLevel = getRiskLevel(sanitized.riskScore);
    const emergency = detectEmergency({ ...sanitized, findings: sanitized.findings });

    return {
      ...sanitized,
      riskLevel,
      emergency,
      disclaimer: 'DISCLAIMER: This is an AI-assisted analysis tool. It is NOT a substitute for professional medical diagnosis. Please consult a qualified physician for proper evaluation and treatment.',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('[XRAY] Error:', error.message);
    return {
      error: error.message,
      xrayFindings: 'Analysis failed',
      predictedDiseases: [],
      riskScore: 50,
      recommendations: ['Consult healthcare provider immediately'],
      reportText: `Error during analysis: ${error.message}`,
      fallback: true,
      disclaimer: 'DISCLAIMER: This is an AI-assisted analysis tool. It is NOT a substitute for professional medical diagnosis.',
      timestamp: new Date().toISOString()
    };
  }
};

// ========== HEALTH FORM ANALYSIS (SINGLE CALL ONLY) ==========
exports.analyzeHealthForm = async (healthData) => {
  console.log(`[HEALTH] Analyzing symptoms for user ${healthData.patient}`);
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const symptoms = healthData.symptoms?.join(', ') || 'None specified';
    const medicalHistory = healthData.medicalHistory?.join(', ') || 'None';

    const prompt = `Analyze respiratory symptoms and suggest likely diseases.

RESPOND WITH ONLY THIS JSON:
{
  "likelyDiseases": [
    {
      "name": "disease from: Pneumonia, Tuberculosis, Asthma, COPD",
      "probability": "high|medium|low",
      "symptom_match": ["symptom1"]
    }
  ],
  "recommendedImaging": "chest_xray|ct_chest|urgent_imaging",
  "urgency": "routine|urgent|emergency",
  "nextSteps": ["step1"]
}

Symptoms: ${symptoms}
History: ${medicalHistory}`;

    const result = await model.generateContent(prompt);
    const parseResult = safeJsonParse(result.response.text());

    if (!parseResult.success) {
      return {
        likelyDiseases: [],
        recommendedImaging: 'chest_xray',
        urgency: 'routine',
        nextSteps: ['Proceed with chest X-ray']
      };
    }

    return parseResult.data;
  } catch (error) {
    console.error('[HEALTH] Error:', error.message);
    return {
      likelyDiseases: [],
      recommendedImaging: 'chest_xray',
      urgency: 'routine',
      nextSteps: ['Consult radiologist']
    };
  }
};

// ========== AI CHAT ASSISTANT ==========
exports.chatWithAssistant = async (messages, reportContext, healthContext) => {
  console.log('[CHAT] Processing message');
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let systemContext = `You are MediScan AI, a respiratory health information assistant.

CRITICAL GUIDELINES:
- NEVER provide medical diagnosis
- ALWAYS recommend professional consultation
- For emergency symptoms (severe breathlessness, chest pain, hemoptysis), recommend IMMEDIATE medical attention
- Be empathetic and clear`;

    if (reportContext) {
      systemContext += `\nPATIENT REPORT: Risk Score ${reportContext.riskScore}. Findings: ${reportContext.findings?.slice(0, 3).join(', ')}`;
    }

    const history = (messages || []).slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || '' }]
    }));

    const chat = model.startChat({
      history,
      systemInstruction: systemContext
    });

    const lastMsg = messages?.[messages.length - 1]?.content || 'Hello';
    const result = await chat.sendMessage(lastMsg);
    return result.response.text() || 'I could not generate a response. Please try again.';

  } catch (error) {
    console.error('[CHAT] Error:', error.message);
    return 'I apologize, but I cannot process your request now. Please consult a healthcare provider.';
  }
};

// ========== EXPORT DISEASES DATABASE ==========
exports.RESPIRATORY_DISEASES = RESPIRATORY_DISEASES;
exports.getRiskLevel = getRiskLevel;
exports.detectEmergency = detectEmergency;