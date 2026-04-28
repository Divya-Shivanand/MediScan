import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, MessageSquare, Map } from 'lucide-react';
import api from '../api/axios';

const severityColor = {
  low:      'bg-green-100 text-green-800',
  moderate: 'bg-amber-100 text-amber-800',
  high:     'bg-red-100 text-red-800'
};

export default function Report() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    api.get(`/report/${id}`).then(r => setReport(r.data));
  }, [id]);

  if (!report) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  );

  const riskColor = report.riskScore < 30 ? 'text-green-600' :
                    report.riskScore < 60 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medical Report</h1>
          <p className="text-gray-500 text-sm mt-1">{new Date(report.createdAt).toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          report.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {report.status === 'reviewed' ? '✓ Doctor Reviewed' : '⏳ Pending Review'}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Overall Risk Score</h2>
          <span className={`text-3xl font-bold ${riskColor}`}>{report.riskScore}/100</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              report.riskScore < 30 ? 'bg-green-500' :
              report.riskScore < 60 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${report.riskScore}%` }} />
        </div>
      </div>

      {report.xrayPath && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Scan Image</h2>
          <img
            src={`http://localhost:5000/${report.xrayPath}`}
            alt="X-ray scan"
            className="rounded-xl max-h-72 object-contain w-full bg-gray-900" />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">AI Findings</h2>
        <p className="text-gray-700 text-sm leading-relaxed">{report.xrayFindings}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Detected Conditions</h2>
        <div className="space-y-3">
          {report.predictedDiseases?.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{d.name}</p>
                <p className="text-xs text-gray-500 capitalize">{d.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{d.confidence}%</p>
                  <p className="text-xs text-gray-400">confidence</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColor[d.severity]}`}>
                  {d.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-4">Recommendations</h2>
        <ul className="space-y-2">
          {report.recommendations?.map((r, i) => (
            <li key={i} className="flex gap-3 items-start">
              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
              <p className="text-sm text-gray-700">{r}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Full Medical Report</h2>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{report.reportText}</p>
      </div>

      {report.doctorNotes && (
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">👨‍⚕️ Doctor's Notes</h2>
          <p className="text-blue-700 text-sm">{report.doctorNotes}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Link to={`/assistant?reportId=${id}`}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
          <MessageSquare size={18} /> Ask AI Assistant
        </Link>
        <Link to="/map"
          className="flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
          <Map size={18} /> Find Nearby Doctors
        </Link>
      </div>
    </div>
  );
}