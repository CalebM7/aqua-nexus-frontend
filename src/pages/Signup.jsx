import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate phone number (Kenyan mobile: starts with 7, 9 digits total)
    const phoneRegex = /^7\d{8}$/;
    let formattedPhone = formData.phone.replace(/\s/g, "");
    if (!phoneRegex.test(formattedPhone)) {
      setError("Invalid phone number. Use format: 7XX XXX XXX");
      setIsLoading(false);
      return;
    }
    formattedPhone = `+254${formattedPhone}`;

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullname,
          email: formData.email,
          phone: formattedPhone,
          password: formData.password,
          role,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 409) {
          throw new Error(
            "Email already exists. Please use a different email."
          );
        }
        throw new Error(data.error || "Signup failed");
      }
      const data = await response.json();
      // Remove auto-login and redirect to login page instead
      // localStorage.setItem("accessToken", data.accessToken);
      // localStorage.setItem("refreshToken", data.refreshToken);
      // setIsAuthenticated(true);
      navigate("/login"); // Redirect to login page after signup
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 xl:w-3/5 bg-aqua-blue text-white p-8 md:p-12 flex flex-col justify-center items-center relative overflow-hidden order-2 lg:order-1">
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8 flex items-center justify-center text-4xl font-bold">
            <i className="fas fa-tint mr-3 text-aqua-teal"></i>
            <span>AquaNexus</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold mb-4 leading-tight">
            Connecting Kenya to Trusted Water Solutions.
          </h1>
          <p className="text-lg text-blue-100">
            Find certified providers for rainwater harvesting and borehole
            drilling, or offer your services to those in need.
          </p>
        </div>
      </div>
      <div className="lg:w-1/2 xl:w-2/5 w-full bg-white p-6 md:p-12 flex items-center justify-center order-1 lg:order-2">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-center text-aqua-blue mb-6">
            Sign Up for AquaNexus
          </h2>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}
          <div className="mb-5">
            <p className="text-sm text-gray-600 mb-2 text-center">
              Are you a...
            </p>
            <div className="flex justify-center space-x-3">
              <button
                className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                  role === "user"
                    ? "border-aqua-blue text-aqua-blue bg-blue-100 hover:bg-blue-200"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                }`}
                onClick={() => setRole("user")}
                disabled={isLoading}
                type="button"
              >
                <i className="fas fa-user mr-1"></i> User / Client
              </button>
              <button
                className={`flex-1 px-4 py-2 border rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                  role === "provider"
                    ? "border-aqua-blue text-aqua-blue bg-blue-100 hover:bg-blue-200"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                }`}
                onClick={() => setRole("provider")}
                disabled={isLoading}
                type="button"
              >
                <i className="fas fa-tools mr-1"></i> Service Provider
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="input-with-icon">
                <label htmlFor="fullname" className="sr-only">
                  Full Name
                </label>
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  required
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua-blue focus:border-transparent sm:text-sm"
                  placeholder="Full Name"
                  disabled={isLoading}
                />
              </div>
              <div className="input-with-icon">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua-blue focus:border-transparent sm:text-sm"
                  placeholder="Email address"
                  disabled={isLoading}
                />
              </div>
              <div className="phone-input input-with-icon">
                <label htmlFor="phone" className="sr-only">
                  Phone Number
                </label>
                <span className="flag">🇰🇪</span>{" "}
                <span className="country-code">+254</span>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua-blue focus:border-transparent sm:text-sm"
                  placeholder="7XX XXX XXX"
                  pattern="7[0-9]{8}" // Stricter validation for Kenyan mobile numbers
                  disabled={isLoading}
                />
              </div>
              <div className="input-with-icon password-input" style={{ position: "relative" }}>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua-blue focus:border-transparent sm:text-sm pr-10"
                  placeholder="Password"
                  disabled={isLoading}
                  style={{ paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="password-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#6b7280",
                    zIndex: 3,
                    cursor: "pointer",
                    padding: 0,
                    height: "100%",
                  }}
                >
                  <i
                    className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                  ></i>
                </button>
              </div>
              <div className="input-with-icon password-input" style={{ position: "relative" }}>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <i className="fas fa-lock"></i>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirm-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua-blue focus:border-transparent sm:text-sm pr-10"
                  placeholder="Confirm Password"
                  disabled={isLoading}
                  style={{ paddingRight: "2.5rem" }}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="password-eye-btn"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#6b7280",
                    zIndex: 3,
                    cursor: "pointer",
                    padding: 0,
                    height: "100%",
                  }}
                >
                  <i
                    className={
                      showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-aqua-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aqua-blue transition duration-150 ease-in-out disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create My Account"}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-aqua-blue hover:text-aqua-teal"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
