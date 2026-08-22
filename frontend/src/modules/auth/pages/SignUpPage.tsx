import { useState } from "react";
import { AuthHeader } from "../components/AuthHeader";
import { AuthFooter } from "../components/AuthFooter";
import "../styles/Auth.css";

interface SignUpPageProps {
  onNavigateToSignIn?: () => void;
}

export const SignUpPage = ({ onNavigateToSignIn }: SignUpPageProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <AuthHeader
          title="Admin Registration"
          subtitle="Set up your enterprise workspace."
        />

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Company Name */}
          <div className="company-input-row">
            <div className="floating-group">
              <input
                id="company-name"
                type="text"
                placeholder=" "
                autoComplete="organization"
              />
              <label htmlFor="company-name">Company Name</label>
            </div>
            <button type="button" className="upload-btn" title="Upload company logo" aria-label="Upload company logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>
          </div>

          {/* Admin Name */}
          <div className="floating-group">
            <input
              id="admin-name"
              type="text"
              placeholder=" "
              autoComplete="name"
            />
            <label htmlFor="admin-name">Admin Name</label>
          </div>

          {/* Email & Phone */}
          <div className="form-row">
            <div className="floating-group">
              <input
                id="email"
                type="email"
                placeholder=" "
                autoComplete="email"
              />
              <label htmlFor="email">Email Address</label>
            </div>
            <div className="floating-group">
              <input
                id="phone"
                type="tel"
                placeholder=" "
                autoComplete="tel"
              />
              <label htmlFor="phone">Phone Number</label>
            </div>
          </div>

          {/* Password */}
          <div className="floating-group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="password-input"
              placeholder=" "
              autoComplete="new-password"
            />
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="floating-group">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              className="password-input"
              placeholder=" "
              autoComplete="new-password"
            />
            <label htmlFor="confirm-password">Confirm Password</label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="signup-btn">
            Sign Up
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        <p className="signin-link">
          Already have an account?
          <button type="button" className="text-link-btn" onClick={onNavigateToSignIn}>
            Sign In
          </button>
        </p>
      </div>

      <AuthFooter />
    </div>
  );
};
