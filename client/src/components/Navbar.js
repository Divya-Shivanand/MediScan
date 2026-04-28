import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = user ? [
    { to: '/dashboard',   label: 'Dashboard' },
    { to: '/health-form', label: 'Health Form' },
    { to: '/xray',        label: 'X-Ray' },
    { to: '/assistant',   label: 'AI Chat' },
    { to: '/knowledge',   label: 'Knowledge' },
    { to: '/map',         label: 'Find Doctor' },
  ] : [];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-blue-600">
          <Activity size={20} /> MediScan AI
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className="text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
              {label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-100">
              <span className="text-sm text-gray-600 font-medium">{user.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                user.role === 'doctor' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'
              }`}>{user.role}</span>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2 ml-3">
              <Link to="/login" className="text-sm text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">Sign In</Link>
              <Link to="/register" className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}