import { Routes, Route } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Providers from './pages/Providers';
import ProviderProfile from './pages/ProviderProfile';

export default function App() {
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}