import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/health-form', label: 'Health Form' },
    { to: '/upload', label: 'X-Ray Upload' },
    { to: '/doctor-map', label: 'Find Doctors' },
  ];

  return (
    <nav style={{
      background: 'var(--primary-darker)', color: 'white',
      padding: '0 2rem', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: '60px',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 12px rgba(4,52,44,0.3)'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M2 12 Q6 4 10 12 Q14 20 18 12 Q20 8 22 12" stroke="#9FE1CB" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        </svg>
        <span style={{ fontFamily: "'DM Serif Display'", fontSize: '20px', letterSpacing: '-0.3px' }}>MediScan AI</span>
      </Link>

      {user && (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={{
              color: location.pathname === l.to ? '#9FE1CB' : 'rgba(255,255,255,0.75)',
              textDecoration: 'none', padding: '6px 12px', borderRadius: '6px',
              fontSize: '13px', fontWeight: '500',
              background: location.pathname === l.to ? 'rgba(159,225,203,0.15)' : 'transparent',
              transition: 'all 0.2s'
            }}>{l.label}</Link>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>Hi, {user.name?.split(' ')[0]}</span>
            <button onClick={handleLogout} style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.3)',
              color: 'white', padding: '6px 16px', borderRadius: '6px',
              cursor: 'pointer', fontSize: '13px', fontWeight: '500'
            }}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Sign In</Link>
            <Link to="/register" style={{
              background: 'var(--primary-mid)', color: 'var(--text-dark)',
              padding: '7px 18px', borderRadius: '8px', textDecoration: 'none',
              fontSize: '14px', fontWeight: '600'
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}