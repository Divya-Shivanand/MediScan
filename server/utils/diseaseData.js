// Complete respiratory disease database
// Based on clinical guidelines and Kaggle chest X-ray dataset patterns

const DISEASE_DATABASE = {
  Pneumonia: {
    severity: 'High',
    xrayHallmarks: [
      'Lobar or segmental consolidation',
      'Air bronchograms',
      'Increased opacity in affected lobe',
      'Pleural effusion possible',
      'Blurred lung margins'
    ],
    keySymptoms: [
      'Fever (>38°C)',
      'Productive cough',
      'Shortness of breath',
      'Chest pain',
      'Rapid breathing',
      'Fatigue'
    ],
    riskFactors: [
      'Age >65 or <5',
      'Smoking',
      'Weakened immune system',
      'Diabetes',
      'Recent viral infection'
    ],
    baseConfidence: 80,
    causes: 'Bacterial (Streptococcus pneumoniae most common) or viral infection causing lung inflammation and fluid accumulation',
    treatment: [
      'Antibiotics (bacterial): Amoxicillin, Azithromycin',
      'Antivirals (viral): Oseltamivir for influenza',
      'Rest and hydration',
      'Oxygen therapy if SpO2 < 94%',
      'Hospitalization for severe cases'
    ],
    prevention: [
      'Pneumococcal vaccine',
      'Influenza vaccine annually',
      'Stop smoking',
      'Good hand hygiene',
      'Healthy diet and exercise'
    ],
    overview: 'Pneumonia is an infection that inflames the air sacs in one or both lungs. The air sacs may fill with fluid or pus, causing cough with phlegm, fever, chills, and difficulty breathing.'
  },

  Tuberculosis: {
    severity: 'High',
    xrayHallmarks: [
      'Upper lobe infiltrates or cavitation',
      'Hilar lymphadenopathy',
      'Miliary pattern (tiny nodules)',
      'Pleural effusion',
      'Fibrotic scarring in upper zones',
      'Ghon focus (primary TB)'
    ],
    keySymptoms: [
      'Chronic cough (>3 weeks)',
      'Haemoptysis (coughing blood)',
      'Night sweats',
      'Weight loss',
      'Fever (low-grade)',
      'Fatigue',
      'Loss of appetite'
    ],
    riskFactors: [
      'TB contact exposure',
      'HIV/AIDS',
      'Malnutrition',
      'Overcrowded living',
      'Diabetes',
      'Immunosuppressive drugs'
    ],
    baseConfidence: 85,
    causes: 'Caused by Mycobacterium tuberculosis bacteria, spread through airborne droplets from coughs and sneezes of infected individuals',
    treatment: [
      'RIPE therapy: Rifampicin + Isoniazid + Pyrazinamide + Ethambutol',
      'Minimum 6 months treatment',
      'DOTS (Directly Observed Treatment)',
      'Drug-resistant TB: 18-24 months treatment',
      'Isolation during infectious period'
    ],
    prevention: [
      'BCG vaccination',
      'TB contact tracing',
      'Infection control measures',
      'HIV treatment and prevention',
      'Nutritional support'
    ],
    overview: 'Tuberculosis (TB) is a potentially serious infectious disease caused by Mycobacterium tuberculosis bacteria. It mainly affects the lungs but can affect any part of the body. TB is curable with proper treatment.'
  },

  COPD: {
    severity: 'High',
    xrayHallmarks: [
      'Hyperinflation of lungs',
      'Flattened diaphragm',
      'Increased AP diameter (barrel chest)',
      'Bullae (air pockets)',
      'Emphysematous changes',
      'Decreased vascular markings',
      'Large retrosternal airspace'
    ],
    keySymptoms: [
      'Chronic cough (productive)',
      'Progressive shortness of breath',
      'Wheezing',
      'Chest tightness',
      'Frequent respiratory infections',
      'Cyanosis in severe cases',
      'Fatigue'
    ],
    riskFactors: [
      'Heavy smoking (>10 pack years)',
      'Age >40',
      'Occupational dust/chemical exposure',
      'Indoor air pollution',
      'Alpha-1 antitrypsin deficiency',
      'Recurrent childhood respiratory infections'
    ],
    baseConfidence: 80,
    causes: 'Long-term exposure to irritating gases or particulate matter, most often cigarette smoke. Causes irreversible damage to lung airways and air sacs.',
    treatment: [
      'Bronchodilators: Salbutamol, Tiotropium',
      'Inhaled corticosteroids',
      'Pulmonary rehabilitation',
      'Oxygen therapy (severe cases)',
      'Smoking cessation (most important)',
      'Lung volume reduction surgery (selected patients)'
    ],
    prevention: [
      'Never start smoking / quit smoking',
      'Avoid occupational lung irritants',
      'Use protective masks in dusty environments',
      'Indoor air quality improvement',
      'Annual influenza vaccine',
      'Pneumococcal vaccine'
    ],
    overview: 'Chronic Obstructive Pulmonary Disease (COPD) is a chronic inflammatory lung disease that causes obstructed airflow from the lungs. It includes emphysema and chronic bronchitis. COPD is progressive but treatable.'
  },

  Asthma: {
    severity: 'Variable',
    xrayHallmarks: [
      'Usually NORMAL X-ray',
      'Mild hyperinflation during attack',
      'Peribronchial thickening',
      'Air trapping in severe cases',
      'Pneumothorax (rare complication)'
    ],
    keySymptoms: [
      'Wheezing (high-pitched breathing sound)',
      'Shortness of breath',
      'Chest tightness',
      'Cough (especially at night/early morning)',
      'Symptoms triggered by allergens',
      'Symptoms worse with exercise'
    ],
    riskFactors: [
      'Family history of asthma/allergies',
      'Allergic conditions (eczema, hay fever)',
      'Obesity',
      'Smoking or secondhand smoke',
      'Air pollution exposure',
      'Occupational allergens'
    ],
    baseConfidence: 70,
    causes: 'Chronic airway inflammation causing swelling and narrowing of airways. Triggered by allergens, exercise, cold air, infections, or irritants. Has a strong genetic component.',
    treatment: [
      'Reliever inhalers: Salbutamol (SABA)',
      'Preventer inhalers: Inhaled corticosteroids (ICS)',
      'Long-acting bronchodilators (LABA)',
      'Montelukast (leukotriene receptor antagonist)',
      'Biologics for severe asthma: Omalizumab',
      'Identify and avoid triggers'
    ],
    prevention: [
      'Identify and avoid triggers',
      'Use prescribed preventer inhaler daily',
      'Keep reliever inhaler accessible',
      'Regular medical review',
      'Flu vaccination annually',
      'Maintain healthy weight'
    ],
    overview: 'Asthma is a condition where your airways narrow and swell and may produce extra mucus. This can make breathing difficult and trigger coughing, wheezing and shortness of breath. Asthma can be well controlled with proper treatment.'
  },

  Normal: {
    severity: 'None',
    xrayHallmarks: [
      'Clear lung fields bilaterally',
      'Normal cardiac silhouette',
      'Normal diaphragm position',
      'No infiltrates or consolidation',
      'Normal vascular markings'
    ],
    keySymptoms: [],
    riskFactors: [],
    baseConfidence: 95,
    causes: 'No respiratory pathology detected',
    treatment: ['Continue regular health check-ups', 'Maintain healthy lifestyle'],
    prevention: ['Regular exercise', 'No smoking', 'Balanced diet', 'Annual health check-ups'],
    overview: 'No significant respiratory pathology detected on this chest X-ray.'
  }
};

// Symptom to disease mapping for scoring
const SYMPTOM_DISEASE_WEIGHTS = {
  'Cough (productive/wet)':      { Pneumonia: 3, Tuberculosis: 2, COPD: 3, Asthma: 1 },
  'Cough (dry)':                 { Pneumonia: 1, Tuberculosis: 1, COPD: 1, Asthma: 2 },
  'Fever':                       { Pneumonia: 4, Tuberculosis: 2, COPD: 0, Asthma: 0 },
  'Night sweats':                { Pneumonia: 1, Tuberculosis: 4, COPD: 0, Asthma: 0 },
  'Weight loss':                 { Pneumonia: 0, Tuberculosis: 4, COPD: 1, Asthma: 0 },
  'Haemoptysis (coughing blood)':{ Pneumonia: 1, Tuberculosis: 4, COPD: 1, Asthma: 0 },
  'Wheezing':                    { Pneumonia: 0, Tuberculosis: 0, COPD: 3, Asthma: 4 },
  'Chest tightness':             { Pneumonia: 1, Tuberculosis: 0, COPD: 2, Asthma: 4 },
  'Shortness of breath':         { Pneumonia: 3, Tuberculosis: 2, COPD: 4, Asthma: 3 },
  'Fatigue':                     { Pneumonia: 2, Tuberculosis: 3, COPD: 2, Asthma: 1 },
  'Chest pain':                  { Pneumonia: 3, Tuberculosis: 1, COPD: 1, Asthma: 1 },
  'Rapid breathing':             { Pneumonia: 3, Tuberculosis: 1, COPD: 2, Asthma: 2 },
  'Cyanosis (blue lips/fingers)':{ Pneumonia: 2, Tuberculosis: 0, COPD: 3, Asthma: 1 },
  'Loss of smell/taste':         { Pneumonia: 0, Tuberculosis: 0, COPD: 0, Asthma: 0 },
};

// Calculate symptom match score for each disease
function calculateSymptomScores(symptoms = []) {
  const scores = { Pneumonia: 0, Tuberculosis: 0, COPD: 0, Asthma: 0 };
  symptoms.forEach(symptom => {
    const weights = SYMPTOM_DISEASE_WEIGHTS[symptom];
    if (weights) {
      Object.keys(weights).forEach(disease => {
        scores[disease] += weights[disease];
      });
    }
  });
  return scores;
}

module.exports = { DISEASE_DATABASE, SYMPTOM_DISEASE_WEIGHTS, calculateSymptomScores };