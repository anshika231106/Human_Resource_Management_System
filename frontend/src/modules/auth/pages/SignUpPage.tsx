import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthHeader } from "../components/AuthHeader";
import { AuthFooter } from "../components/AuthFooter";
import "../styles/Auth.css";

interface SignUpPageProps {
  onNavigateToSignIn?: () => void;
}

interface FormErrors {
  companyName?: string;
  adminName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export const SignUpPage = ({ onNavigateToSignIn }: SignUpPageProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    companyName: "",
    adminName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!formData.adminName.trim()) {
      newErrors.adminName = "Admin name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNavigateToSignIn?.();
      navigate("/signin");
    }
  };

  const handleSignInClick = () => {
    if (onNavigateToSignIn) {
      onNavigateToSignIn();
    } else {
      navigate("/signin");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <AuthHeader
          title="Admin Registration"
          subtitle="Set up your enterprise workspace."
        />

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {/* Company Name */}
          <div className="company-input-row">
            <div className={`floating-group${errors.companyName ? " has-error" : ""}`}>
              <input
                id="company-name"
                type="text"
                placeholder=" "
                autoComplete="organization"
                required
                value={formData.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
              />
              <label htmlFor="company-name">Company Name *</label>
              {errors.companyName && <span className="field-error">{errors.companyName}</span>}
            </div>
            <button type="button" className="upload-btn" title="Upload company logo (optional)" aria-label="Upload company logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>
          </div>

          {/* Admin Name */}
          <div className={`floating-group${errors.adminName ? " has-error" : ""}`}>
            <input
              id="admin-name"
              type="text"
              placeholder=" "
              autoComplete="name"
              required
              value={formData.adminName}
              onChange={(e) => updateField("adminName", e.target.value)}
            />
            <label htmlFor="admin-name">Admin Name *</label>
            {errors.adminName && <span className="field-error">{errors.adminName}</span>}
          </div>

          {/* Email & Phone */}
          <div className="form-row">
            <div className={`floating-group${errors.email ? " has-error" : ""}`}>
              <input
                id="email"
                type="email"
                placeholder=" "
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
              <label htmlFor="email">Email Address *</label>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className={`floating-group${errors.phone ? " has-error" : ""}`}>
              <input
                id="phone"
                type="tel"
                placeholder=" "
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
              <label htmlFor="phone">Phone Number *</label>
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          {/* Password */}
          <div className={`floating-group${errors.password ? " has-error" : ""}`}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="password-input"
              placeholder=" "
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={(e) => updateField("password", e.target.value)}
            />
            <label htmlFor="password">Password *</label>
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

          {/* Confirm Password */}
          <div className={`floating-group${errors.confirmPassword ? " has-error" : ""}`}>
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              className="password-input"
              placeholder=" "
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
            />
            <label htmlFor="confirm-password">Confirm Password *</label>
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
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
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
          <Link to="/signin" className="text-link-btn" onClick={handleSignInClick}>
            Sign In
          </Link>
        </p>
      </div>

      <AuthFooter />
    </div>
  );
};
