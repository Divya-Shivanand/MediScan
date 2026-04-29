import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(29,158,117,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: "'DM Serif Display'", fontSize: '1.8rem', color: 'var(--primary-darker)' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Sign in to your MediScan account</p>
        </div>

        {error && <div style={{ background: '#fff5f5', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { label: 'Email', type: 'email', value: email, setter: setEmail },
            { label: 'Password', type: 'password', value: password, setter: setPassword }
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--primary-darker)', marginBottom: '6px' }}>{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.setter(e.target.value)} required
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', color: 'var(--text-dark)' }}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            background: 'var(--primary)', color: 'white', padding: '12px',
            border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '15px',
            cursor: 'pointer', marginTop: '0.5rem', opacity: loading ? 0.7 : 1
          }}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--text-muted)' }}>
          No account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Register free</Link>
        </p>
      </div>
    </div>
  );
}