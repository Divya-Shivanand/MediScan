import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HealthForm from './pages/HealthForm';
import XRayUpload from './pages/XRayUpload';
import Report from './pages/Report';
import Assistant from './pages/Assistant';
import KnowledgeHub from './pages/KnowledgeHub';
import DoctorMap from './pages/DoctorMap';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/"         element={<Landing />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/health-form" element={<ProtectedRoute><HealthForm /></ProtectedRoute>} />
          <Route path="/xray" element={<ProtectedRoute><XRayUpload /></ProtectedRoute>} />
          <Route path="/report/:id" element={<ProtectedRoute><Report /></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
          <Route path="/knowledge" element={<ProtectedRoute><KnowledgeHub /></ProtectedRoute>} />
          <Route path="/map" element={<ProtectedRoute><DoctorMap /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}