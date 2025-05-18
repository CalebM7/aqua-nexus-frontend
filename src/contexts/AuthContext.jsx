import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false); // Prevent loop

  const logout = useCallback(() => {
    console.log("AuthContext: Logging out user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    if (!isRedirecting) {
      setIsRedirecting(true);
      window.location.href = "/";
    }
  }, [isRedirecting]);

  const attemptRefreshToken = useCallback(
    async (caller = "unknown") => {
      console.log(`AuthContext: Attempting token refresh, called by: ${caller}`);
      const refreshTokenValue = localStorage.getItem("refreshToken");
      if (!refreshTokenValue) {
        console.log("Refresh attempt: No refresh token found.");
        throw new Error("No refresh token found");
      }
      try {
        const response = await fetch("http://localhost:5000/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: refreshTokenValue }),
        });
        console.log("Refresh token response:", {
          status: response.status,
          ok: response.ok,
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Failed to refresh token: ${errorData.error || "Unknown error"}`
          );
        }
        const { accessToken } = await response.json();
        localStorage.setItem("accessToken", accessToken);
        const userResponse = await fetch("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        console.log("User fetch response after refresh:", {
          status: userResponse.status,
          ok: userResponse.ok,
        });
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(
            `Failed to fetch user data: ${errorData.error || "Unknown error"}`
          );
        }
        const fetchedUser = await userResponse.json();
        const userInfo = {
          userId: fetchedUser.userId ?? fetchedUser.userid,
          email: fetchedUser.email,
          role: fetchedUser.role,
          providerId: fetchedUser.providerId ?? fetchedUser.providerid,
        };
        setUser(userInfo);
        localStorage.setItem("user", JSON.stringify(userInfo));
        setIsAuthenticated(true);
        return accessToken;
      } catch (err) {
        console.error(`Refresh token error (${caller}):`, err.message);
        logout();
        throw err;
      }
    },
    [logout]
  );

  const validateToken = useCallback(async () => {
    console.log("AuthContext: Validating token...");
    const token = localStorage.getItem("accessToken");
    const storedUserString = localStorage.getItem("user");
    if (token && storedUserString) {
      try {
        console.log(
          "Token and user found in localStorage. Verifying with /auth/me."
        );
        const response = await fetch("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Validate token (/auth/me) response:", {
          status: response.status,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
        });
        if (!response.ok) {
          console.log("Validate token failed:", { status: response.status });
          if (response.status === 401 || response.status === 403) {
            console.log("/auth/me returned 401/403. Attempting token refresh.");
            await attemptRefreshToken("validateToken_authMe_failed");
          } else {
            const errorData = await response.json();
            throw new Error(
              `Validation API error: ${errorData.error || response.statusText}`
            );
          }
        } else {
          const fetchedUser = await response.json();
          const userInfo = {
            userId: fetchedUser.userId ?? fetchedUser.userid,
            email: fetchedUser.email,
            role: fetchedUser.role,
            providerId: fetchedUser.providerId ?? fetchedUser.providerid,
          };
          setUser(userInfo);
          localStorage.setItem("user", JSON.stringify(userInfo));
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Validate token error:", err.message);
        if (
          !err.message.includes("Failed to refresh token") &&
          !err.message.includes("No refresh token found") &&
          !isRedirecting
        ) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    } else {
      console.log(
        "No token or user in localStorage. Setting logged out state."
      );
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, [attemptRefreshToken, logout, isRedirecting]);

  const login = useCallback(async (email, password) => {
    console.log("AuthContext: login function called.", { email });
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("Login API response:", {
        status: response.status,
        ok: response.ok,
      });
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonErr) {
          console.error("Login: Failed to parse error response:", jsonErr);
          throw new Error(`Login failed with status ${response.status}`);
        }
        console.error("Login: Error response data:", errorData);
        throw new Error(
          errorData.error || `Login failed with status ${response.status}`
        );
      }
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.error("Login: Failed to parse response JSON:", jsonErr);
        throw new Error("Invalid response format from server");
      }
      const { accessToken, refreshToken, user: loggedInUser } = data;
      if (!accessToken || !refreshToken || !loggedInUser) {
        console.error("Login: Incomplete response data:", data);
        throw new Error("Incomplete login response from server");
      }
      console.log("Login API success data:", {
        accessToken: accessToken.slice(0, 10) + "...",
        refreshToken: refreshToken.slice(0, 10) + "...",
        user: loggedInUser,
      });
      console.log("Saving to localStorage:", {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
        user: !!loggedInUser,
      });
      const normalizedUser = {
        userId: loggedInUser.userId ?? loggedInUser.userid,
        email: loggedInUser.email,
        role: loggedInUser.role,
        providerId: loggedInUser.providerId ?? loggedInUser.providerid,
      };
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      setIsAuthenticated(true);
      setLoading(false);
      console.log("Login state updated:", {
        user: normalizedUser,
        isAuthenticated: true,
      });
      return normalizedUser;
    } catch (err) {
      console.error("Login error:", {
        message: err.message,
        stack: err.stack,
        email,
      });
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    console.log(
      "AuthContext: Initial effect running validateToken. Current loading state:",
      loading
    );
    validateToken();
  }, [validateToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        attemptRefreshToken,
        loading,
        validateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};