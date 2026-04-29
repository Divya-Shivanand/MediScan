// Curated sample cases for demo and testing
// Each case has symptoms + expected diagnosis

const SAMPLE_CASES = [
  {
    id: 'pneumonia_1',
    disease: 'Pneumonia',
    imagePath: 'uploads/samples/pneumonia/pneumonia_1.jpg',
    patientProfile: {
      age: 45, gender: 'Male',
      symptoms: ['Fever', 'Cough (productive/wet)', 'Shortness of breath', 'Chest pain'],
      symptomDuration: '1-2 weeks',
      medicalHistory: ['None'],
      smokingStatus: 'Never',
      chiefComplaint: 'High fever and productive cough for 10 days'
    },
    expectedFindings: 'Right lower lobe consolidation with air bronchograms',
    clinicalNotes: 'Classic bacterial pneumonia presentation'
  },
  {
    id: 'pneumonia_2',
    disease: 'Pneumonia',
    imagePath: 'uploads/samples/pneumonia/pneumonia_2.jpg',
    patientProfile: {
      age: 67, gender: 'Female',
      symptoms: ['Fever', 'Cough (productive/wet)', 'Rapid breathing', 'Fatigue'],
      symptomDuration: '1-2 weeks',
      medicalHistory: ['Diabetes'],
      smokingStatus: 'Never',
      chiefComplaint: 'Worsening breathlessness and fever in diabetic patient'
    },
    expectedFindings: 'Bilateral lower lobe infiltrates',
    clinicalNotes: 'Pneumonia in immunocompromised diabetic patient'
  },
  {
    id: 'tb_1',
    disease: 'Tuberculosis',
    imagePath: 'uploads/samples/tuberculosis/tb_1.jpg',
    patientProfile: {
      age: 32, gender: 'Male',
      symptoms: ['Cough (productive/wet)', 'Night sweats', 'Weight loss', 'Haemoptysis (coughing blood)', 'Fatigue'],
      symptomDuration: 'More than 3 months',
      medicalHistory: ['None'],
      smokingStatus: 'Never',
      exposureHistory: ['TB contact'],
      chiefComplaint: 'Chronic cough with blood for 3 months, significant weight loss'
    },
    expectedFindings: 'Upper lobe cavitation with surrounding infiltrates',
    clinicalNotes: 'Classic TB presentation with cavitation'
  },
  {
    id: 'tb_2',
    disease: 'Tuberculosis',
    imagePath: 'uploads/samples/tuberculosis/tb_2.jpg',
    patientProfile: {
      age: 28, gender: 'Female',
      symptoms: ['Night sweats', 'Weight loss', 'Fever', 'Fatigue', 'Cough (dry)'],
      symptomDuration: 'More than 1 month',
      medicalHistory: ['HIV/AIDS'],
      smokingStatus: 'Never',
      chiefComplaint: 'Weight loss and night sweats in HIV positive patient'
    },
    expectedFindings: 'Miliary pattern - tiny nodules throughout both lungs',
    clinicalNotes: 'Miliary TB in immunocompromised patient'
  },
  {
    id: 'copd_1',
    disease: 'COPD',
    imagePath: 'uploads/samples/copd/copd_1.jpg',
    patientProfile: {
      age: 62, gender: 'Male',
      symptoms: ['Cough (productive/wet)', 'Shortness of breath', 'Wheezing', 'Fatigue'],
      symptomDuration: 'More than 3 months',
      medicalHistory: ['Smoking'],
      smokingStatus: 'Current smoker (heavy)',
      packYears: 40,
      chiefComplaint: 'Progressive breathlessness, heavy smoker for 40 years'
    },
    expectedFindings: 'Hyperinflated lungs, flattened diaphragm, bullae',
    clinicalNotes: 'Advanced COPD with emphysema in heavy smoker'
  },
  {
    id: 'copd_2',
    disease: 'COPD',
    imagePath: 'uploads/samples/copd/copd_2.jpg',
    patientProfile: {
      age: 55, gender: 'Female',
      symptoms: ['Shortness of breath', 'Cough (productive/wet)', 'Cyanosis (blue lips/fingers)', 'Fatigue'],
      symptomDuration: 'More than 3 months',
      medicalHistory: ['Smoking', 'Asthma'],
      smokingStatus: 'Former smoker',
      packYears: 25,
      chiefComplaint: 'Worsening dyspnoea and chronic productive cough'
    },
    expectedFindings: 'Barrel chest appearance, decreased vascular markings',
    clinicalNotes: 'Moderate-severe COPD with cor pulmonale signs'
  },
  {
    id: 'asthma_1',
    disease: 'Asthma',
    imagePath: 'uploads/samples/asthma/asthma_1.jpg',
    patientProfile: {
      age: 24, gender: 'Female',
      symptoms: ['Wheezing', 'Chest tightness', 'Shortness of breath', 'Cough (dry)'],
      symptomDuration: 'Less than 1 week',
      medicalHistory: ['Asthma'],
      smokingStatus: 'Never',
      chiefComplaint: 'Acute wheezing episode triggered by cold weather'
    },
    expectedFindings: 'Normal or mild hyperinflation - diagnosis mainly clinical',
    clinicalNotes: 'Acute asthma exacerbation - X-ray often normal'
  },
  {
    id: 'asthma_2',
    disease: 'Asthma',
    imagePath: 'uploads/samples/asthma/asthma_2.jpg',
    patientProfile: {
      age: 16, gender: 'Male',
      symptoms: ['Wheezing', 'Chest tightness', 'Cough (dry)', 'Shortness of breath'],
      symptomDuration: '1-2 weeks',
      medicalHistory: ['Asthma'],
      smokingStatus: 'Never',
      chiefComplaint: 'Recurrent wheezing and chest tightness since childhood'
    },
    expectedFindings: 'Mild hyperinflation, peribronchial thickening',
    clinicalNotes: 'Childhood asthma with allergic component'
  },
  {
    id: 'normal_1',
    disease: 'Normal',
    imagePath: 'uploads/samples/normal/normal_1.jpg',
    patientProfile: {
      age: 35, gender: 'Male',
      symptoms: ['Cough (dry)'],
      symptomDuration: 'Less than 1 week',
      medicalHistory: ['None'],
      smokingStatus: 'Never',
      chiefComplaint: 'Routine chest X-ray, mild dry cough'
    },
    expectedFindings: 'Clear lung fields, normal cardiac silhouette',
    clinicalNotes: 'Normal chest X-ray'
  },
  {
    id: 'normal_2',
    disease: 'Normal',
    imagePath: 'uploads/samples/normal/normal_2.jpg',
    patientProfile: {
      age: 28, gender: 'Female',
      symptoms: [],
      symptomDuration: 'Less than 1 week',
      medicalHistory: ['None'],
      smokingStatus: 'Never',
      chiefComplaint: 'Pre-employment health check'
    },
    expectedFindings: 'No abnormality detected',
    clinicalNotes: 'Completely normal chest X-ray'
  }
];

// Disease statistics for dashboard
const DISEASE_STATS = {
  Pneumonia: {
    globalPrevalence: '450 million cases/year worldwide',
    mortalityRate: '5-10% in adults, higher in elderly',
    kaggleDataset: 'Chest X-Ray Images (Pneumonia) - 5,863 images',
    kaggleAccuracy: '92.8% classification accuracy on test set',
    commonAge: '65+ years and children under 5'
  },
  Tuberculosis: {
    globalPrevalence: '10 million new cases/year',
    mortalityRate: '1.5 million deaths/year',
    kaggleDataset: 'Tuberculosis Chest X-ray Dataset - 4,200 images',
    kaggleAccuracy: '88.5% classification accuracy',
    commonAge: '25-44 years most affected'
  },
  COPD: {
    globalPrevalence: '300 million people worldwide',
    mortalityRate: '3rd leading cause of death globally',
    kaggleDataset: 'NIH Chest X-ray Dataset - 112,000 images',
    kaggleAccuracy: '80.2% classification accuracy',
    commonAge: 'Adults over 40, peak 65+'
  },
  Asthma: {
    globalPrevalence: '260 million people worldwide',
    mortalityRate: '0.19 per 100,000 people',
    kaggleDataset: 'NIH Chest X-ray Dataset - 112,000 images',
    kaggleAccuracy: '70.5% classification accuracy',
    commonAge: 'All ages, often starts in childhood'
  }
};

module.exports = { SAMPLE_CASES, DISEASE_STATS };