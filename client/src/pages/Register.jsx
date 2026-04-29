import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/health-form');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text' },
    { key: 'email', label: 'Email Address', type: 'email' },
    { key: 'password', label: 'Password', type: 'password' },
  ];

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(29,158,117,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: '1.8rem', color: 'var(--primary-darker)' }}>Create account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Start your respiratory health journey</p>
        </div>

        {error && <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--primary-darker)', marginBottom: '6px' }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-dark)' }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            background: 'var(--primary)', color: 'white', padding: '12px',
            border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '15px',
            cursor: 'pointer', marginTop: '0.5rem', opacity: loading ? 0.7 : 1
          }}>{loading ? 'Creating account...' : 'Create Account'}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}