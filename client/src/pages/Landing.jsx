import { Link } from 'react-router-dom';
import { Activity, Brain, Map, Users, Shield, FileText } from 'lucide-react';

const features = [
  { icon: Activity,  title: 'X-Ray Analysis',     desc: 'AI-powered CNN analysis detects anomalies in chest X-rays and scans with radiologist-level accuracy.' },
  { icon: Brain,     title: 'Disease Prediction', desc: 'Predict risk of respiratory, cardiac, neurological, metabolic and oncological conditions.' },
  { icon: FileText,  title: 'Smart Reports',       desc: 'Auto-generated medical reports with findings, risk scores and doctor-reviewable notes.' },
  { icon: Users,     title: 'Community Hub',       desc: 'Connect with others facing the same diagnosis. Share, learn, and fight together.' },
  { icon: Map,       title: 'Find Doctors',        desc: 'Locate specialists near you based on your diagnosis using real-time Google Maps.' },
  { icon: Shield,    title: 'AI Assistant',        desc: 'Chat with our medical AI to understand your report and get health guidance anytime.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1 rounded-full mb-4">
          AI-Powered Healthcare
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Diagnose Smarter.<br />
          <span className="text-blue-600">Live Healthier.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          MediScan AI analyzes your X-rays and medical history to detect diseases early,
          generate detailed reports, and connect you with the right specialists.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition">
            Get Started Free
          </Link>
          <Link to="/login"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-semibold transition">
            Sign In
          </Link>
        </div>
      </div>

      <div className="bg-blue-600 py-4">
        <div className="flex gap-8 whitespace-nowrap px-8 text-white/80 text-sm justify-center">
          {['Respiratory', 'Cardiovascular', 'Neurological', 'Metabolic', 'Oncological', 'Musculoskeletal'].map(c => (
            <span key={c} className="font-medium">• {c}</span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything you need for smarter healthcare
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Icon className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-teal-600 py-16 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to take control of your health?</h2>
        <p className="text-blue-100 mb-8">Join thousands already using MediScan AI</p>
        <Link to="/register"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
          Create Free Account
        </Link>
      </div>
    </div>
  );
}