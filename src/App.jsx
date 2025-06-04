import { Routes, Route, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Providers from "./pages/Providers";
import ProviderProfile from "./pages/ProviderProfile";
import UserDashboard from "./pages/UserDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import HowItWorksPage from "./pages/HowItWorksPage";
import Chatbot from "./components/Chatbot";

function App() {
  const { loading } = useContext(AuthContext);
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup", "/forgot-password"];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  console.log("App: Rendering", {
    loading,
    pathname: location.pathname,
    localStorage: {
      accessToken: !!localStorage.getItem("accessToken"),
      refreshToken: !!localStorage.getItem("refreshToken"),
      user: !!localStorage.getItem("user"),
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div>
          <p className="text-gray-600">Loading AquaNexus...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showNavbar && <Navbar />}
      <Chatbot />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute requiresAuth={false}>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <ProtectedRoute requiresAuth={false}>
              <Signup />
            </ProtectedRoute>
          }
        />
        <Route path="/providers" element={<Providers />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute requiresAuth={false}>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiresAuth={true} allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider-dashboard"
          element={
            <ProtectedRoute requiresAuth={true} allowedRoles={["provider"]}>
              <ProviderDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div>
                <h1 className="text-2xl font-bold mb-4">
                  404 - Page Not Found
                </h1>
                <p className="text-gray-600">
                  The page you are looking for does not exist.
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
