// BackButton.jsx — Full-fledged smart back button
// Handles: navigate(-1), fallback to home, and avoids looping
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * Props:
 *  - fallback (string)   — path to go if no history (default: "/")
 *  - label   (string)    — button label (default: "Back")
 *  - className (string)  — extra Tailwind classes
 *  - compact (bool)      — icon-only mode for mobile
 */
const BackButton = ({ fallback = "/", label = "Back", className = "", compact = false }) => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleBack = () => {
    // If there is actual history, go back; else navigate to fallback
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`back-btn ${className}`}
      aria-label="Go back"
      title={`Back to previous page`}
    >
      <ArrowLeft size={14} strokeWidth={2.5} />
      {!compact && <span>{label}</span>}
    </button>
  );
};

export default BackButton;
