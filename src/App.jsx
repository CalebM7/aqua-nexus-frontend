import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import { AuthContext } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Providers from './pages/Providers';
import ProviderProfile from './pages/ProviderProfile';
import Dashboard from './pages/Dashboard';
import './index.css';

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext); // Moved inside AuthProvider scope
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}