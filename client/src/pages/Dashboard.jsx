import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FileText, Upload, Brain, Map } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api.get(user.role === 'doctor' ? '/report/doctor/pending' : '/report/my')
      .then(r => setReports(r.data)).catch(() => {});
  }, [user.role]);

  const quickLinks = [
    { to:'/health-form', icon: FileText, label:'Update Health Form', color:'bg-blue-50 text-blue-600' },
    { to:'/xray',        icon: Upload,   label:'Upload X-Ray',        color:'bg-purple-50 text-purple-600' },
    { to:'/assistant',   icon: Brain,    label:'AI Assistant',         color:'bg-teal-50 text-teal-600' },
    { to:'/map',         icon: Map,      label:'Find Doctors',         color:'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Welcome back, {user.name} 👋
      </h1>
      <p className="text-gray-500 mb-8 capitalize">{user.role} Dashboard</p>

      <div className="grid grid-cols-4 gap-4 mb-10">
        {quickLinks.map(({ to, icon: Icon, label, color }) => (
          <Link key={to} to={to}
            className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mx-auto mb-2`}>
              <Icon size={20} />
            </div>
            <p className="text-sm font-medium text-gray-700">{label}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-semibold text-gray-800 mb-4">
        {user.role === 'doctor' ? 'Pending Patient Reports' : 'Your Reports'}
      </h2>
      <div className="space-y-3">
        {reports.length === 0 && (
          <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-400">
            {user.role === 'doctor' ? 'No pending reports' : 'No reports yet. Upload your first X-ray!'}
          </div>
        )}
        {reports.map(r => (
          <Link key={r._id} to={`/report/${r._id}`}
            className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition">
            <div>
              {user.role === 'doctor' && <p className="text-xs text-gray-500 mb-0.5">Patient: {r.patient?.name}</p>}
              <p className="font-medium text-gray-900">
                {r.predictedDiseases?.[0]?.name || 'Analysis'} {r.predictedDiseases?.length > 1 ? `+${r.predictedDiseases.length-1} more` : ''}
              </p>
              <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`text-lg font-bold ${
                r.riskScore < 30 ? 'text-green-600' : r.riskScore < 60 ? 'text-amber-600' : 'text-red-600'
              }`}>{r.riskScore}</div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                r.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>{r.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}