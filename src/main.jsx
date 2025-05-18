import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import "./index.css";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    console.error("ErrorBoundary caught an error:", error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-aqua-blue mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              Please try refreshing the page or return to the homepage.
            </p>
            <button
              onClick={() => window.location.assign("/")}
              className="bg-aqua-blue text-white py-2 px-4 rounded hover:bg-opacity-90"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);