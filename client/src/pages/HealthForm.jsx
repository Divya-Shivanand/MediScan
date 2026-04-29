import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const symptoms = ['Persistent cough', 'Shortness of breath', 'Wheezing', 'Chest pain', 'Fever', 'Night sweats', 'Fatigue', 'Blood in sputum', 'Rapid breathing', 'Loss of appetite'];

export default function HealthForm() {
  const [form, setForm] = useState({ age: '', gender: '', smokingStatus: 'never', duration: '', selectedSymptoms: [], otherNotes: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleSymptom = (s) => {
    setForm(f => ({
      ...f,
      selectedSymptoms: f.selectedSymptoms.includes(s) ? f.selectedSymptoms.filter(x => x !== s) : [...f.selectedSymptoms, s]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/health', form);
      navigate('/upload');
    } catch (err) {
      alert('Failed to save health details. Please try again.');
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-dark)', background: 'white' };
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--primary-darker)', marginBottom: '6px' };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: '1.8rem', color: 'var(--primary-darker)', marginBottom: '0.5rem' }}>Health Details</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '2rem' }}>Help us understand your health background for accurate analysis.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Age</label>
            <input type="number" min="1" max="120" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} required style={inputStyle} placeholder="e.g. 35" />
          </div>
          <div>
            <label style={labelStyle}>Gender</label>
            <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} required style={inputStyle}>
              <option value="">Select</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Smoking Status</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['never', 'former', 'current'].map(s => (
              <button key={s} type="button" onClick={() => setForm({ ...form, smokingStatus: s })} style={{
                flex: 1, padding: '9px', border: '1.5px solid', borderRadius: '8px', cursor: 'pointer',
                fontWeight: '500', fontSize: '13px', textTransform: 'capitalize',
                background: form.smokingStatus === s ? 'var(--primary)' : 'white',
                borderColor: form.smokingStatus === s ? 'var(--primary)' : 'var(--border)',
                color: form.smokingStatus === s ? 'white' : 'var(--text-muted)',
              }}>{s}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Symptom Duration</label>
          <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required style={inputStyle}>
            <option value="">Select duration</option>
            <option>Less than 1 week</option><option>1–2 weeks</option>
            <option>2–4 weeks</option><option>1–3 months</option><option>More than 3 months</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Current Symptoms (select all that apply)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {symptoms.map(s => (
              <button key={s} type="button" onClick={() => toggleSymptom(s)} style={{
                padding: '6px 14px', borderRadius: '20px', border: '1.5px solid', cursor: 'pointer', fontSize: '13px',
                background: form.selectedSymptoms.includes(s) ? 'var(--primary)' : 'white',
                borderColor: form.selectedSymptoms.includes(s) ? 'var(--primary)' : 'var(--border)',
                color: form.selectedSymptoms.includes(s) ? 'white' : 'var(--text-dark)',
                fontWeight: form.selectedSymptoms.includes(s) ? '600' : '400',
              }}>{s}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Additional Notes (optional)</label>
          <textarea value={form.otherNotes} onChange={e => setForm({ ...form, otherNotes: e.target.value })} rows={4}
            placeholder="Any medications, allergies, or other relevant information..."
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }} />
        </div>

        <button type="submit" disabled={loading} style={{
          background: 'var(--primary)', color: 'white', padding: '13px',
          border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '15px',
          cursor: 'pointer', opacity: loading ? 0.7 : 1
        }}>{loading ? 'Saving...' : 'Save & Continue to X-Ray Upload →'}</button>
      </form>
    </div>
  );
}