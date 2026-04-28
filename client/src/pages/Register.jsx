import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ name:'', email:'', password:'', speciality:'', licenseNumber:'', hospital:'' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ ...form, role });
      toast.success('Account created!');
      navigate('/health-form');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-500 mb-6">Join MediScan AI today</p>

        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          {['patient', 'doctor'].map(r => (
            <button key={r} type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
              }`}>
              {r === 'patient' ? '🏥 Patient' : '👨‍⚕️ Doctor'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} required
                value={form[key]}
                onChange={e => setForm({...form, [key]: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder} />
            </div>
          ))}

          {role === 'doctor' && (
            <>
              {[
                { label: 'Speciality', key: 'speciality', placeholder: 'e.g. Radiologist, Cardiologist' },
                { label: 'License Number', key: 'licenseNumber', placeholder: 'Medical license ID' },
                { label: 'Hospital / Clinic', key: 'hospital', placeholder: 'Hospital name' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type="text" required
                    value={form[key]}
                    onChange={e => setForm({...form, [key]: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={placeholder} />
                </div>
              ))}
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-blue-600 font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
}