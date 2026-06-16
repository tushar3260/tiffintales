// ErrorBoundary.jsx — Catches React render errors globally
import React from "react";
import { FaExclamationTriangle, FaHome, FaRedo } from "react-icons/fa";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-3xl text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              An unexpected error occurred. Please try refreshing the page or go back to home.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-secondary flex items-center gap-2"
              >
                <FaRedo className="text-xs" /> Refresh
              </button>
              <a href="/" className="btn btn-primary flex items-center gap-2">
                <FaHome className="text-xs" /> Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
