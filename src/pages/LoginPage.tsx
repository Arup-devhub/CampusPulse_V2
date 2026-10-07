import React, { useState } from "react";
import {
  Lock, Mail, Building2, AlertCircle, CheckCircle2,
  ArrowRight, KeyRound
} from "lucide-react";
import { Role } from "../types";
import { authService } from "../services/authService";

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

  // Sign In inputs
  const [email, setEmail] = useState("arup.lenka@campus.edu");
  const [password, setPassword] = useState("password123");
  const [companyName, setCompanyName] = useState("Tata Consultancy Services (TCS)");

  // Forgot password input
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick switch role prefill
  const handleRoleSelect = (newRole: Role) => {
    setSelectedRole(newRole);
    setErrorMessage(null);
    if (newRole === "Student") {
      setEmail("arup.lenka@campus.edu");
      setPassword("password123");
    } else if (newRole === "Placement Admin") {
      setEmail("officer@campuspulse.edu");
      setPassword("password123");
    } else if (newRole === "Recruiter") {
      setEmail("pooja.nair@tcs.com");
      setPassword("password123");
      setCompanyName("Tata Consultancy Services (TCS)");
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await authService.login({
        email,
        password,
        role: selectedRole,
        companyName: selectedRole === "Recruiter" ? companyName : undefined
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
              <label className="form-label">
                {selectedRole === "Recruiter" ? "Work Email / Username" : "Email / Username"}
              </label>
              <div className="input-with-icon">
                <Mail size={15} className="input-prefix-icon" />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === "Student"
                      ? "student@campus.edu"
                      : selectedRole === "Recruiter"
                      ? "recruiter@company.com"
                      : "admin@campuspulse.edu"
                  }
                  required
                />
              </div>
            </div>

            {selectedRole === "Recruiter" && (
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label className="form-label">Company Name</label>
                <div className="input-with-icon">
                  <Building2 size={15} className="input-prefix-icon" />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: 34 }}
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Tata Consultancy Services, Infosys"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
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
                <Lock size={15} className="input-prefix-icon" />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 34 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
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

            {/* Quick Demo Pre-sets for reviewer testing */}
            <div className="auth-quick-presets">
              <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase", fontWeight: 700 }}>
                Instant Demo Credentials:
              </span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                <button
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => {
                    setSelectedRole("Student");
                    setEmail("arup.lenka@campus.edu");
                    setPassword("password123");
                  }}
                >
                  Student (Arup Lenka)
                </button>
                <button
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => {
                    setSelectedRole("Placement Admin");
                    setEmail("officer@campuspulse.edu");
                    setPassword("password123");
                  }}
                >
                  Placement Admin (Arup Lenka)
                </button>
                <button
                  type="button"
                  className="preset-pill-btn"
                  onClick={() => {
                    setSelectedRole("Recruiter");
                    setEmail("pooja.nair@tcs.com");
                    setPassword("password123");
                    setCompanyName("Tata Consultancy Services (TCS)");
                  }}
                >
                  Recruiter (Pooja Nair · TCS)
                </button>
              </div>
            </div>

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
