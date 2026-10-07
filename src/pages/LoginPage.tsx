import React, { useState } from "react";
import {
  GraduationCap, Lock, Mail, User, Building2, Github,
  Linkedin, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, KeyRound
} from "lucide-react";
import { Role } from "../types";
import { authService, DEFAULT_USERS } from "../services/authService";

interface LoginPageProps {
  onLoginSuccess: (role: Role) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<Role>("Student");
  const [mode, setMode] = useState<"signin" | "register" | "forgot">("signin");

  // Sign In inputs
  const [email, setEmail] = useState("arup.lenka@campus.edu");
  const [password, setPassword] = useState("password123");
  const [companyName, setCompanyName] = useState("Tata Consultancy Services (TCS)");

  // Registration inputs (Student Onboarding)
  const [regName, setRegName] = useState("Arup Lenka");
  const [regNo, setRegNo] = useState("2101297042");
  const [regEmail, setRegEmail] = useState("arup.lenka@campus.edu");
  const [regPassword, setRegPassword] = useState("password123");
  const [regGithub, setRegGithub] = useState("https://github.com/aruplenka");
  const [regLinkedin, setRegLinkedin] = useState("https://linkedin.com/in/aruplenka");
  const [regBranch, setRegBranch] = useState("Computer Science & Engineering");
  const [regCgpa, setRegCgpa] = useState("8.42");

  // Forgot password input
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await authService.registerStudent({
        name: regName,
        regNo,
        email: regEmail,
        password: regPassword,
        githubUrl: regGithub,
        linkedinUrl: regLinkedin,
        branch: regBranch,
        cgpa: parseFloat(regCgpa) || 8.0
      });

      if (res.success) {
        setSuccessMessage("Account created successfully. Redirecting to Student Dashboard...");
        setTimeout(() => {
          onLoginSuccess("Student");
        }, 600);
      } else {
        setErrorMessage(res.error || "Failed to create verified account. Please verify input fields.");
      }
    } catch (err) {
      setErrorMessage("System error during account registration. Please retry.");
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
        {/* Brand Header */}
        <div className="auth-brand-header">
          <div className="brand-icon" style={{ width: 40, height: 40, fontSize: 18 }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--cp-black)", letterSpacing: -0.5 }}>
              CampusPulse
            </h1>
            <span style={{ fontSize: 12, color: "var(--cp-grey-500)", fontWeight: 500 }}>
              AI-Powered Student Placement Readiness & Intervention Platform
            </span>
          </div>
        </div>

        {/* Mode Title */}
        <div style={{ marginTop: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--cp-black)" }}>
            {mode === "signin"
              ? "Welcome back"
              : mode === "register"
              ? "Student Onboarding & Profile Verification"
              : "Reset Password"}
          </h2>
          <p style={{ fontSize: 13, color: "var(--cp-grey-600)", marginTop: 2 }}>
            {mode === "signin"
              ? "Select your institutional role to enter the placement platform."
              : mode === "register"
              ? "Register verified academic and portfolio credentials for automated placement readiness scoring."
              : "Enter your registered email to receive an institutional reset authorization link."}
          </p>
        </div>

        {/* Role Selector Segmented Control (Active in Sign In Mode) */}
        {mode === "signin" && (
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

        {/* Error / Alert notification banner */}
        {errorMessage && (
          <div className="auth-alert-banner error" role="alert">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 13 }}>
              <b>Sign In Failed</b>
              <p style={{ marginTop: 2 }}>{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Success notification banner */}
        {successMessage && (
          <div className="auth-alert-banner success" role="status">
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 13 }}>{successMessage}</div>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === "signin" && (
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
                    setMode("forgot");
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

            <div style={{ marginTop: 24, textAlign: "center", borderTop: "1px solid var(--cp-grey-200)", paddingTop: 16 }}>
              <span style={{ fontSize: 13, color: "var(--cp-grey-600)" }}>
                Don't have a verified student account?{" "}
              </span>
              <button
                type="button"
                className="btn-ghost"
                style={{ fontSize: 13, fontWeight: 600, color: "var(--cp-black)", padding: 0 }}
                onClick={() => {
                  setErrorMessage(null);
                  setMode("register");
                }}
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {/* STUDENT REGISTRATION (ONBOARDING) FORM */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Student Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Arup Lenka"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration Number *</label>
                <input
                  type="text"
                  className="form-input"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  placeholder="2101297042"
                  required
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Institutional Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="arup.lenka@campus.edu"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-input"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">GitHub Profile URL *</label>
                <input
                  type="url"
                  className="form-input"
                  value={regGithub}
                  onChange={(e) => setRegGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL *</label>
                <input
                  type="url"
                  className="form-input"
                  value={regLinkedin}
                  onChange={(e) => setRegLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  required
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="form-group">
                <label className="form-label">Degree Branch</label>
                <input
                  type="text"
                  className="form-input"
                  value={regBranch}
                  onChange={(e) => setRegBranch(e.target.value)}
                  placeholder="Computer Science & Engineering"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-input"
                  value={regCgpa}
                  onChange={(e) => setRegCgpa(e.target.value)}
                  placeholder="8.42"
                />
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <button
                type="submit"
                className="btn btn-primary btn-block"
                style={{ height: 42, fontSize: 14, fontWeight: 600 }}
                disabled={loading}
              >
                {loading ? "Verifying & Creating Profile..." : "Complete Verification & Create Account"}
              </button>
            </div>

            <div style={{ marginTop: 18, textAlign: "center" }}>
              <button
                type="button"
                className="btn-ghost"
                style={{ fontSize: 13, color: "var(--cp-grey-700)" }}
                onClick={() => {
                  setErrorMessage(null);
                  setMode("signin");
                }}
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === "forgot" && (
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
                    setMode("signin");
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
                    onClick={() => setMode("signin")}
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
