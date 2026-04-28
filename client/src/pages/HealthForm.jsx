import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SYMPTOMS = ['Chest Pain','Shortness of Breath','Cough','Fatigue','Headache','Fever','Nausea','Weight Loss','Dizziness','Joint Pain'];
const HISTORY  = ['Diabetes','Hypertension','Heart Disease','Asthma','Cancer','Tuberculosis','Stroke','None'];

export default function HealthForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age:'', gender:'', weight:'', height:'', bloodGroup:'',
    symptoms:[], medicalHistory:[], currentMedications:'',
    allergies:'', smokingStatus:'never', alcoholUsage:'never',
    exerciseFrequency:'moderate', familyHistory:[], chiefComplaint:''
  });

  useEffect(() => {
    api.get('/health').then(r => { if(r.data) setForm(prev => ({...prev, ...r.data})); }).catch(()=>{});
  }, []);

  const toggle = (field, val) =>
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(val)
        ? prev[field].filter(x => x !== val)
        : [...prev[field], val]
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/health', form);
      toast.success('Health profile saved!');
      navigate('/xray');
    } catch {
      toast.error('Failed to save');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Health Profile</h1>
        <p className="text-gray-500 mt-1">This information helps our AI provide accurate analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label:'Age', key:'age', type:'number', placeholder:'25' },
              { label:'Weight (kg)', key:'weight', type:'number', placeholder:'70' },
              { label:'Height (cm)', key:'height', type:'number', placeholder:'170' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm text-gray-600 mb-1">{label}</label>
                <input type={type} placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm({...form, [key]: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            ))}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Gender</label>
              <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Select</option>
                {['Male','Female','Other'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Blood Group</label>
              <select value={form.bloodGroup} onChange={e => setForm({...form, bloodGroup: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Select</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Current Symptoms</h2>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map(s => (
              <button key={s} type="button"
                onClick={() => toggle('symptoms', s)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  form.symptoms.includes(s)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 text-gray-600 hover:border-blue-400'
                }`}>
                {s}
              </button>
            ))}
          </div>
          <textarea
            className="w-full mt-4 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
            placeholder="Describe your main complaint in detail..."
            value={form.chiefComplaint}
            onChange={e => setForm({...form, chiefComplaint: e.target.value})} />
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Medical History</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {HISTORY.map(h => (
              <button key={h} type="button"
                onClick={() => toggle('medicalHistory', h)}
                className={`px-3 py-1.5 rounded-full text-sm border transition ${
                  form.medicalHistory.includes(h)
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'border-gray-200 text-gray-600 hover:border-teal-400'
                }`}>
                {h}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Current Medications</label>
              <input type="text" placeholder="e.g. Metformin, Aspirin"
                value={form.currentMedications}
                onChange={e => setForm({...form, currentMedications: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Allergies</label>
              <input type="text" placeholder="e.g. Penicillin, Peanuts"
                value={form.allergies}
                onChange={e => setForm({...form, allergies: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Lifestyle</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label:'Smoking', key:'smokingStatus', opts:['never','former','current'] },
              { label:'Alcohol', key:'alcoholUsage', opts:['never','occasional','regular'] },
              { label:'Exercise', key:'exerciseFrequency', opts:['none','moderate','regular'] },
            ].map(({ label, key, opts }) => (
              <div key={key}>
                <label className="block text-sm text-gray-600 mb-1">{label}</label>
                <select value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  {opts.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase()+o.slice(1)}</option>)}
                </select>
              </div>
            ))}
          </div>
        </section>

        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
          Save & Continue to X-Ray Upload →
        </button>
      </form>
    </div>
  );
}