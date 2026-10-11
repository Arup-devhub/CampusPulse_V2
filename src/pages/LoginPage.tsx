import React, { useState } from "react";
import {
  Lock, Mail, Building2, AlertCircle, CheckCircle2,
  ArrowRight, KeyRound, Eye, EyeOff
} from "lucide-react";
import { Role } from "../types";
import { authService } from "../services/authService";
import { isValidEmail } from "../utils/validation";

interface LoginPageProps {
  initialRole?: Role;
  onLoginSuccess: (role: Role) => void;
  onNavigateSignup: (role: Role) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole = "Student",
  onLoginSuccess,
  onNavigateSignup
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [isForgotMode, setIsForgotMode] = useState(false);

  // Sign In inputs (all start empty with no prefill)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Forgot password input
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Switch role without injecting demo values
  const handleRoleSelect = (newRole: Role) => {
    setSelectedRole(newRole);
    setErrorMessage(null);
    setEmailError(null);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError && isValidEmail(val)) {
      setEmailError(null);
    }
  };

  const handleEmailBlur = () => {
    if (email.trim() && !isValidEmail(email)) {
      setEmailError("Please enter a valid email.");
    } else {
      setEmailError(null);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email.");
      return;
    }
    setEmailError(null);

    setLoading(true);

    try {
      const res = await authService.login({
        email: trimmedEmail,
        password,
        role: selectedRole,
        companyName: selectedRole === "Recruiter" ? companyName.trim() : undefined
      });

      if (res.success) {
        onLoginSuccess(selectedRole);
      } else {
        setErrorMessage(res.error || "We couldn't sign you in. Your email or password may be incorrect.");
      }
    } catch (err) {
      setErrorMessage("Network error occurred while connecting to authentication service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      setErrorMessage("Please enter a valid registered institutional email address.");
      return;
    }
    setForgotSent(true);
    setErrorMessage(null);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-panel">
        {/* Brand Header with Official CampusPulse Logo */}
        <div className="auth-brand-header">
          <a href="/login" className="auth-logo-badge" aria-label="CampusPulse home" onClick={(e) => { e.preventDefault(); setIsForgotMode(false); }}>
            <img
              src="/campuspulse-logo.png"
              alt="CampusPulse"
              className="auth-official-logo"
            />
          </a>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--cp-black)", letterSpacing: -0.5, margin: 0 }}>
              CampusPulse
            </h1>
            <span style={{ fontSize: 13, color: "var(--cp-grey-600)", fontWeight: 500, display: "block", marginTop: 2 }}>
              {isForgotMode
                ? "Password Reset"
                : `${selectedRole} Sign In`}
            </span>
          </div>
        </div>

        {/* Mode Title */}
        <div style={{ marginTop: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--cp-black)" }}>
            {isForgotMode ? "Reset Password" : "Welcome back"}
          </h2>
          <p style={{ fontSize: 13, color: "var(--cp-grey-600)", marginTop: 2 }}>
            {isForgotMode
              ? "Enter your registered email to receive an institutional reset authorization link."
              : "Choose your role to sign in to your placement portal."}
          </p>
        </div>

        {/* Role Selector Segmented Control (Active in Sign In Mode) */}
        {!isForgotMode && (
          <div className="auth-role-segmented-box" role="tablist" aria-label="Choose your role">
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--cp-grey-700)", marginBottom: 8, display: "block" }}>
              Choose your role:
            </span>
            <div className="auth-role-pills">
              {(["Student", "Placement Admin", "Recruiter"] as Role[]).map((r) => {
                const isSelected = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`auth-role-pill-btn ${isSelected ? "active" : ""}`}
                    onClick={() => handleRoleSelect(r)}
                  >
                    <span>{r}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="auth-alert-banner error" role="alert">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 13 }}>
              <b>Sign In Failed</b>
              <p style={{ marginTop: 2 }}>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* SIGN IN FORM */}
        {!isForgotMode ? (
          <form onSubmit={handleSignInSubmit}>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label" htmlFor="login-email">
                {selectedRole === "Recruiter" ? "Work Email / Username" : "Email / Username"}
              </label>
              <div className="input-with-icon">
                <Mail size={15} className="input-prefix-icon" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder={
                    selectedRole === "Recruiter"
                      ? "name@company.com"
                      : "name@example.com"
                  }
                  required
                  aria-invalid={!!emailError}
                  aria-describedby={emailError ? "login-email-error" : undefined}
                />
              </div>
              {emailError && (
                <span
                  id="login-email-error"
                  role="alert"
                  style={{ color: "var(--cp-danger, #ef4444)", fontSize: 12, marginTop: 4, display: "block" }}
                >
                  {emailError}
                </span>
              )}
            </div>

            {selectedRole === "Recruiter" && (
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label" htmlFor="login-company">Company Name</label>
                <div className="input-with-icon">
                  <Building2 size={15} className="input-prefix-icon" aria-hidden="true" />
                  <input
                    id="login-company"
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: 34 }}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Example Technologies"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label" htmlFor="login-password" style={{ marginBottom: 0 }}>Password</label>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ fontSize: 12, padding: 0, color: "var(--cp-grey-600)" }}
                  onClick={() => {
                    setErrorMessage(null);
                    setIsForgotMode(true);
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="input-with-icon" style={{ marginTop: 6 }}>
                <Lock size={15} className="input-prefix-icon" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  style={{ paddingLeft: 34, paddingRight: 36 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="input-suffix-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ height: 42, fontSize: 14, fontWeight: 600 }}
              disabled={loading}
            >
              {loading ? "Authenticating..." : `Sign In as ${selectedRole}`}
            </button>

            {/* Role-Specific Sign Up Destination Navigation */}
            <div style={{ marginTop: 24, textAlign: "center", borderTop: "1px solid var(--cp-grey-200)", paddingTop: 16 }}>
              <span style={{ fontSize: 13, color: "var(--cp-grey-600)" }}>
                {selectedRole === "Student"
                  ? "Don't have a student account? "
                  : selectedRole === "Placement Admin"
                  ? "Don't have a placement admin account? "
                  : "Don't have a recruiter account? "}
              </span>
              <button
                type="button"
                className="btn-ghost"
                style={{ fontSize: 13, fontWeight: 600, color: "var(--cp-black)", padding: 0 }}
                onClick={() => onNavigateSignup(selectedRole)}
              >
                Create {selectedRole} Account
              </button>
            </div>
          </form>
        ) : (
          /* FORGOT PASSWORD FORM */
          <form onSubmit={handleForgotSubmit}>
            {forgotSent ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--cp-success-bg)",
                    color: "var(--cp-success)",
                    display: "grid",
                    placeItems: "center",
                    margin: "0 auto 12px"
                  }}
                >
                  <CheckCircle2 size={24} />
                </div>
                <h3 style={{ fontSize: 16, color: "var(--cp-black)" }}>Password Reset Dispatched</h3>
                <p style={{ fontSize: 13, color: "var(--cp-grey-600)", margin: "8px 0 20px" }}>
                  A secure password reset link has been dispatched to <b>{forgotEmail}</b>. Please follow the instructions to update your credentials.
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setForgotSent(false);
                    setIsForgotMode(false);
                  }}
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <>
                <div className="form-group" style={{ marginBottom: 18 }}>
                  <label className="form-label">Registered Institutional Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your registered email address"
                    required
                  />
                  <span className="form-helper">
                    Verification link will be transmitted through university LDAP directory.
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  style={{ height: 42, fontSize: 14, fontWeight: 600 }}
                >
                  Send Reset Link
                </button>

                <div style={{ marginTop: 18, textAlign: "center" }}>
                  <button
                    type="button"
                    className="btn-ghost"
                    style={{ fontSize: 13, color: "var(--cp-grey-700)" }}
                    onClick={() => setIsForgotMode(false)}
                  >
                    Back to Sign In
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
