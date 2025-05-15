import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") }),
      });
      if (!response.ok) throw new Error("Failed to refresh token");
      const { accessToken } = await response.json();
      localStorage.setItem("accessToken", accessToken);
      // Fetch user data after refresh
      const userResponse = await fetch("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();
      const providerResponse = await fetch(`http://localhost:5000/provider/${userData.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const providerId = providerResponse.ok ? (await providerResponse.json()).id : null;
      setUser({ userId: userData.id, role: userData.role, providerId });
      setIsAuthenticated(true);
      return accessToken;
    } catch (err) {
      console.error("Refresh token error:", err);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
      return null;
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser({
            userId: userData.userId,
            role: userData.role,
            providerId: userData.providerId,
          });
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Validate token error:", err);
          const newToken = await refreshToken();
          if (!newToken) {
            setUser(null);
            setIsAuthenticated(false);
            navigate("/login");
          }
        }
      }
    };
    validateToken();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};