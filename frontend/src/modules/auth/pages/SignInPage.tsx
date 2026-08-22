import { useState } from "react";
import { AuthHeader } from "../components/AuthHeader";
import { AuthFooter } from "../components/AuthFooter";
import "../styles/Auth.css";

interface SignInPageProps {
  onNavigateToSignUp?: () => void;
}

export const SignInPage = ({ onNavigateToSignUp }: SignInPageProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <AuthHeader
          title="Welcome Back"
          subtitle="Sign in to your enterprise workspace."
        />

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="floating-group">
            <input
              id="signin-email"
              type="email"
              placeholder=" "
              autoComplete="email"
            />
            <label htmlFor="signin-email">Email Address</label>
          </div>

          {/* Password */}
          <div className="floating-group">
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              className="password-input"
              placeholder=" "
              autoComplete="current-password"
            />
            <label htmlFor="signin-password">Password</label>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
            <a href="#" className="forgot-password-link">Forgot password?</a>
          </div>

          {/* Submit */}
          <button type="submit" className="signup-btn">
            Sign In
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        <p className="signin-link">
          Don't have an account?
          <button type="button" className="text-link-btn" onClick={onNavigateToSignUp}>
            Sign Up
          </button>
        </p>
      </div>

      <AuthFooter />
    </div>
  );
};
