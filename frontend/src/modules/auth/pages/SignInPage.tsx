import { useState } from "react";
import { AuthHeader } from "../components/AuthHeader";
import { AuthFooter } from "../components/AuthFooter";
import "../styles/Auth.css";

interface SignInPageProps {
  onNavigateToSignUp?: () => void;
  onSignInSuccess?: () => void;
}

export const SignInPage = ({ onNavigateToSignUp, onSignInSuccess }: SignInPageProps) => {
  const [role, setRole] = useState<"admin" | "employee">("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSignInSuccess?.();
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        {/* Role Switcher */}
        <div className="role-toggle-container">
          <button
            type="button"
            className={`role-toggle-btn ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Admin
          </button>
          <button
            type="button"
            className={`role-toggle-btn ${role === "employee" ? "active" : ""}`}
            onClick={() => setRole("employee")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Employee
          </button>
        </div>

        <AuthHeader
          title={role === "admin" ? "Admin Sign In" : "Employee Sign In"}
          subtitle={
            role === "admin"
              ? "Sign in to your enterprise workspace."
              : "Sign in to access your employee portal."
          }
        />

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className={`floating-group${errors.email ? " has-error" : ""}`}>
            <input
              id="signin-email"
              type="email"
              placeholder=" "
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
            />
            <label htmlFor="signin-email">
              {role === "admin" ? "Admin Email Address" : "Employee Email Address"}
            </label>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className={`floating-group${errors.password ? " has-error" : ""}`}>
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              className="password-input"
              placeholder=" "
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
              }}
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
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
            <a href="#" className="forgot-password-link">Forgot password?</a>
          </div>

          {/* Submit */}
          <button type="submit" className="signup-btn">
            Sign In as {role === "admin" ? "Admin" : "Employee"}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        {role === "admin" ? (
          <p className="signin-link">
            Don't have an account?
            <button type="button" className="text-link-btn" onClick={onNavigateToSignUp}>
              Sign Up
            </button>
          </p>
        ) : (
          <p className="signin-link employee-no-signup">
            Employee registration is managed by your Admin.
          </p>
        )}
      </div>

      <AuthFooter />
    </div>
  );
};
