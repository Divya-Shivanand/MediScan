import { Link } from 'react-router-dom';

const diseases = ['Pneumonia', 'Tuberculosis (TB)', 'Asthma', 'COPD'];

const features = [
  { icon: '🫁', title: 'X-Ray Analysis', desc: 'Upload chest X-rays for instant AI-powered respiratory disease detection.' },
  { icon: '📋', title: 'Detailed Reports', desc: 'Get structured reports with risk scores, findings, and next steps.' },
  { icon: '🗺️', title: 'Find Specialists', desc: 'Locate pulmonologists and respiratory clinics near you instantly.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your health data is encrypted and never shared without consent.' },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, var(--primary-light) 0%, #d0f0e6 100%)',
        padding: '5rem 2rem', textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block', background: 'var(--accent)', color: 'var(--primary-darker)',
          padding: '6px 20px', borderRadius: '20px', fontSize: '13px',
          fontWeight: '600', marginBottom: '1.5rem', letterSpacing: '0.3px'
        }}>AI-Powered Respiratory Healthcare</div>

        <h1 style={{
          fontFamily: "'DM Serif Display'", fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          color: 'var(--primary-darker)', lineHeight: '1.1', marginBottom: '1rem'
        }}>Diagnose Smarter.<br /><span style={{ color: 'var(--primary)' }}>Live Healthier.</span></h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: '1.7' }}>
          MediScan AI analyzes your chest X-rays and medical history to detect respiratory diseases early, generate detailed reports, and connect you with the right specialists.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{
            background: 'var(--primary)', color: 'white', padding: '14px 32px',
            borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '1rem'
          }}>Get Started Free</Link>
          <Link to="/login" style={{
            background: 'white', color: 'var(--primary)', padding: '14px 32px',
            borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '1rem',
            border: '1.5px solid var(--border)'
          }}>Sign In</Link>
        </div>
      </section>

      {/* Disease ticker */}
      <section style={{ background: 'var(--primary)', padding: '1rem 2rem' }}>
        <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {diseases.map(d => (
            <span key={d} style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>• {d}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: '2rem', textAlign: 'center', color: 'var(--primary-darker)', marginBottom: '3rem' }}>
          Everything you need for smarter healthcare
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {features.map(f => (
            <div key={f.title} style={{
              background: 'white', border: '1px solid var(--border)', borderRadius: '14px',
              padding: '1.5rem', transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontWeight: '600', color: 'var(--primary-darker)', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}