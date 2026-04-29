import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const riskColor = (score) => {
  if (score >= 70) return { bg: '#fff5f5', border: '#fca5a5', text: '#dc2626', label: 'High Risk' };
  if (score >= 40) return { bg: '#fffbeb', border: '#fde68a', text: '#d97706', label: 'Moderate Risk' };
  return { bg: 'var(--primary-light)', border: 'var(--border)', text: 'var(--primary-dark)', label: 'Low Risk' };
};

export default function Report() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/report/${id}`).then(r => setReport(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--primary)' }}>Loading report...</div>;
  if (!report) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Report not found.</div>;

  const risk = riskColor(report.riskScore || 0);

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display'", fontSize: '1.8rem', color: 'var(--primary-darker)' }}>Diagnostic Report</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>{new Date(report.createdAt).toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
        </div>
        <Link to="/doctor-map" style={{
          background: 'var(--primary)', color: 'white', padding: '10px 20px',
          borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px'
        }}>Find a Doctor →</Link>
      </div>

      {/* Disease & Risk */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--primary-light)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Disease Screened</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary-darker)', marginTop: '6px' }}>{report.disease}</div>
        </div>
        <div style={{ background: risk.bg, border: `1px solid ${risk.border}`, borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: risk.text, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk Level</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: risk.text, marginTop: '6px' }}>{risk.label} ({report.riskScore || 0}%)</div>
        </div>
      </div>

      {/* X-ray image if available */}
      {report.imageUrl && (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <img src={report.imageUrl} alt="Uploaded X-ray" style={{ maxHeight: '320px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain' }} />
        </div>
      )}

      {/* Findings */}
      {report.findings && (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--primary-darker)', marginBottom: '0.75rem' }}>AI Findings</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.7' }}>{report.findings}</p>
        </div>
      )}

      {/* Recommendations */}
      {report.recommendations && (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--primary-darker)', marginBottom: '0.75rem' }}>Recommendations</h2>
          <p style={{ fontSize: '14px', color: 'var(--text-dark)', lineHeight: '1.7' }}>{report.recommendations}</p>
        </div>
      )}

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px', fontSize: '13px', color: '#92400e' }}>
        ⚠️ This report is for screening purposes only. Please consult a licensed pulmonologist or medical professional for clinical diagnosis and treatment.
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <Link to="/upload" style={{ background: 'var(--primary)', color: 'white', padding: '11px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>New Scan</Link>
        <Link to="/dashboard" style={{ background: 'white', color: 'var(--primary)', padding: '11px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px', border: '1.5px solid var(--border)' }}>Dashboard</Link>
      </div>
    </div>
  );
}