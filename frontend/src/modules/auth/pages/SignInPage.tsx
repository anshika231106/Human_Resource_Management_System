import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthHeader } from "../components/AuthHeader";
import { AuthFooter } from "../components/AuthFooter";
import { login, saveSession, AuthError } from "../services/authApi";
import type { AuthUser } from "../types/auth.types";
import "../styles/Auth.css";

interface SignInPageProps {
  onNavigateToSignUp?: () => void;
  onSignInSuccess?: (user: AuthUser) => void;
}

export const SignInPage = ({ onNavigateToSignUp, onSignInSuccess }: SignInPageProps) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"admin" | "employee">("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ loginId?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: { loginId?: string; password?: string } = {};
    if (!loginId.trim()) {
      newErrors.loginId = "Login ID is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const session = await login({ loginId: loginId.trim(), password, role });
      saveSession(session);
      onSignInSuccess?.(session.user);
      navigate("/dashboard");
    } catch (err) {
      setFormError(err instanceof AuthError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpClick = () => {
    if (onNavigateToSignUp) {
      onNavigateToSignUp();
    } else {
      navigate("/signup");
    }
  };

  const handleFillAdmin = () => {
    setRole("admin");
    setLoginId("OIPRKA20220001");
    setPassword("Admin@123");
    setErrors({});
    setFormError(null);
  };

  const handleFillEmployee = () => {
    setRole("employee");
    setLoginId("OIAASH20230001");
    setPassword("Welcome@123");
    setErrors({});
    setFormError(null);
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

        {/* Quick Fill Demo Credentials */}
        <div className="quick-fill-container">
          <div className="quick-fill-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Quick Fill Demo Credentials
          </div>
          <div className="quick-fill-buttons">
            <button
              type="button"
              className="quick-fill-btn"
              onClick={handleFillAdmin}
              title="Fill Admin ID: OIPRKA20220001"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Fill Admin
            </button>
            <button
              type="button"
              className="quick-fill-btn"
              onClick={handleFillEmployee}
              title="Fill Employee ID: OIAASH20230001"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Fill Employee
            </button>
          </div>
        </div>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {/* Login ID */}
          <div className={`floating-group${errors.loginId ? " has-error" : ""}`}>
            <input
              id="signin-loginid"
              type="text"
              placeholder=" "
              autoComplete="username"
              required
              value={loginId}
              onChange={(e) => {
                setLoginId(e.target.value);
                if (errors.loginId) setErrors((p) => ({ ...p, loginId: undefined }));
              }}
            />
            <label htmlFor="signin-loginid">
              {role === "admin" ? "Admin Login ID" : "Employee Login ID"}
            </label>
            {errors.loginId && <span className="field-error">{errors.loginId}</span>}
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

          {formError && <span className="form-error">{formError}</span>}

          {/* Submit */}
          <button type="submit" className="signup-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing In…" : `Sign In as ${role === "admin" ? "Admin" : "Employee"}`}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        {role === "admin" ? (
          <p className="signin-link">
            Don't have an account?
            <Link to="/signup" className="text-link-btn" onClick={handleSignUpClick}>
              Sign Up
            </Link>
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
