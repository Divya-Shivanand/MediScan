import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function XRayUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [disease, setDisease] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  const diseases = ['Pneumonia', 'Tuberculosis (TB)', 'Asthma', 'COPD'];

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !disease) { alert('Please select a file and disease type.'); return; }
    setLoading(true);
    const fd = new FormData();
    fd.append('xray', file);
    fd.append('disease', disease);
    try {
      const res = await api.post('/xray/upload', fd);
      navigate(`/report/${res.data.reportId}`);
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: '1.8rem', color: 'var(--primary-darker)', marginBottom: '0.5rem' }}>Upload Chest X-Ray</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '2rem' }}>Upload a clear frontal chest X-ray image for AI analysis.</p>

      {/* Disease selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--primary-darker)', marginBottom: '8px' }}>Select Disease to Screen For</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {diseases.map(d => (
            <button key={d} onClick={() => setDisease(d)} style={{
              padding: '12px', border: '2px solid', borderRadius: '10px', cursor: 'pointer',
              fontWeight: '600', fontSize: '14px', textAlign: 'center',
              background: disease === d ? 'var(--primary)' : 'white',
              borderColor: disease === d ? 'var(--primary)' : 'var(--border)',
              color: disease === d ? 'white' : 'var(--text-dark)',
              transition: 'all 0.15s'
            }}>{d}</button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: '14px', padding: '3rem', textAlign: 'center',
          background: dragging ? 'var(--primary-light)' : 'white',
          cursor: 'pointer', transition: 'all 0.2s', marginBottom: '1.5rem'
        }}
      >
        {preview ? (
          <img src={preview} alt="X-ray preview" style={{ maxHeight: '280px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }} />
        ) : (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🩻</div>
            <p style={{ fontWeight: '600', color: 'var(--primary-darker)' }}>Drop your X-ray here</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>or click to browse — JPG, PNG supported</p>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
      </div>

      {file && (
        <div style={{ background: 'var(--primary-light)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>
          Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(0)} KB)
        </div>
      )}

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#92400e', marginBottom: '1.5rem' }}>
        ⚠️ For screening purposes only. Always consult a qualified medical professional for diagnosis.
      </div>

      <button onClick={handleSubmit} disabled={loading || !file || !disease} style={{
        width: '100%', background: 'var(--primary)', color: 'white', padding: '14px',
        border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '15px',
        cursor: 'pointer', opacity: (!file || !disease || loading) ? 0.6 : 1
      }}>{loading ? 'Analyzing X-Ray...' : 'Analyze X-Ray →'}</button>
    </div>
  );
}