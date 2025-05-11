import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      const response = await fetch('http://localhost:5000/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) throw new Error('Failed to refresh token');
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      setIsAuthenticated(true);
      return data.accessToken;
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      navigate('/login');
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      if (localStorage.getItem('refreshToken')) {
        await refreshToken();
      }
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}