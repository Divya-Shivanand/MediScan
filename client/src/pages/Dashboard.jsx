import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const quickActions = [
  { to: '/health-form', label: 'Fill Health Form', icon: '📋', desc: 'Update your symptoms & history' },
  { to: '/upload', label: 'Upload X-Ray', icon: '🫁', desc: 'Get AI analysis instantly' },
  { to: '/doctor-map', label: 'Find Doctors', icon: '🗺️', desc: 'Locate nearby specialists' },
];

const diseases = ['Pneumonia', 'Tuberculosis', 'Asthma', 'COPD'];

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get('/report/my').then(r => setReports(r.data || [])).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: '1.8rem', color: 'var(--primary-darker)' }}>
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Here's your respiratory health overview</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Scans', value: reports.length },
          { label: 'Diseases Tracked', value: 4 },
          { label: 'Last Scan', value: reports[0]?.createdAt ? new Date(reports[0].createdAt).toLocaleDateString() : '—' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--primary-light)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
            <div style={{ fontSize: '12px', color: 'var(--primary-dark)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary-darker)', marginTop: '4px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary-darker)', marginBottom: '1rem' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {quickActions.map(a => (
          <Link key={a.to} to={a.to} style={{
            background: 'white', border: '1px solid var(--border)', borderRadius: '12px',
            padding: '1.25rem', textDecoration: 'none', display: 'block',
            transition: 'border-color 0.2s, transform 0.15s'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{a.icon}</div>
            <div style={{ fontWeight: '600', color: 'var(--primary-darker)', fontSize: '14px' }}>{a.label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{a.desc}</div>
          </Link>
        ))}
      </div>

      {/* Disease scope */}
      <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary-darker)', marginBottom: '1rem' }}>Diseases We Detect</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {diseases.map(d => (
          <span key={d} style={{ background: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>{d}</span>
        ))}
      </div>

      {/* Recent reports */}
      <h2 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary-darker)', marginBottom: '1rem' }}>Recent Reports</h2>
      {reports.length === 0 ? (
        <div style={{ background: 'white', border: '1px dashed var(--border)', borderRadius: '12px', padding: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No reports yet. Upload an X-ray to get started.</p>
          <Link to="/upload" style={{ display: 'inline-block', marginTop: '1rem', background: 'var(--primary)', color: 'white', padding: '10px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>Upload X-Ray</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {reports.slice(0, 5).map(r => (
            <Link key={r._id} to={`/report/${r._id}`} style={{
              background: 'white', border: '1px solid var(--border)', borderRadius: '10px',
              padding: '1rem 1.25rem', textDecoration: 'none', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--primary-darker)', fontSize: '14px' }}>{r.disease || 'Respiratory Scan'}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
              <span style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>View →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}