import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    console.log("Login: useEffect checking auth", { isAuthenticated, user });
    if (isAuthenticated && user) {
      const destination =
        user.role === "provider" ? "/provider-dashboard" : "/dashboard";
      console.log("Login: Already authenticated, redirecting to", destination);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login: handleSubmit called", {
      email,
      password: password ? "[hidden]" : "",
    });
    setIsLoading(true);
    setError("");
    try {
      console.log("Login: Calling login function", { email });
      const loggedInUser = await login(email, password);
      console.log("Login: Success", {
        userId: loggedInUser.userId,
        email: loggedInUser.email,
        role: loggedInUser.role,
        providerId: loggedInUser.providerId,
      });
      const destination =
        loggedInUser.role === "provider" ? "/provider-dashboard" : "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      const errorMessage = err.message || "An unexpected error occurred";
      console.error("Login error in component:", {
        message: errorMessage,
        stack: err.stack,
      });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log("Login: handleSubmit completed", { isLoading: false, error });
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
            Login to AquaNexus
          </h2>
          {error && (
            <p
              className="text-red-500 text-sm text-center mb-4"
              aria-live="assertive"
            >
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua-blue focus:border-transparent sm:text-sm disabled:bg-gray-100"
                  placeholder="Email address"
                  disabled={isLoading}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "email-error" : undefined}
                />
              </div>
              <div
                className="input-with-icon password-input"
                style={{ position: "relative" }}
              >
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-aqua-blue focus:border-transparent sm:text-sm disabled:bg-gray-100 pr-10"
                  placeholder="Password"
                  disabled={isLoading}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "password-error" : undefined}
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
              <div className="text-right text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-aqua-blue hover:text-aqua-teal"
                  aria-label="Forgot your password?"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-aqua-blue hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aqua-blue transition duration-150 ease-in-out disabled:opacity-50"
                disabled={isLoading}
                aria-busy={isLoading ? "true" : "false"}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-aqua-blue hover:text-aqua-teal"
                aria-label="Sign up for a new account"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
